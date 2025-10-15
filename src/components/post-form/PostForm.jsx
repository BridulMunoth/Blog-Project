import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import StorageService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const { register, handleSubmit, setValue, watch, getValues, control } =
    useForm({
      defaultValues: {
        Title: post?.Title || "",
        Content: post?.Content || "",
        slug: post?.slug || "",
        Status: post?.Status || "active",
      },
    });

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const onSubmit = async (data) => {
    try {
      if (post) {
        // Update post logic here
        const file = data.Image?.[0]
          ? await StorageService.uploadFile(data.Image[0])
          : null;

        let imageId = post.Image; // keep old image by default
        if (file) {
          StorageService.deleteFile(post.Image); // delete old one if new uploaded
          imageId = file.$id;
        }

        const dbPost = await StorageService.updatePost(post.$id, {
          ...data,
          Image: imageId, // always send a valid image id
        });
        if (dbPost) {
          console.log("Post updated successfully:", dbPost);
          navigate(`/posts/${dbPost.$id}`);
        } else {
          console.error("Failed to update post");
        }
      } else {
        // Create new post logic here
        // const file = data.Image[0]
        //   ? await StorageService.uploadFile(data.Image[0])
        //   : null;

        const file = await StorageService.uploadFile(data.Image[0]);

        // if (file) {
        //   const dbPost = await StorageService.upsertPost(data.slug, {
        //     ...data,
        //     Image: file ? file.$id : null,
        //     UserID: user.$id,
        //   });
        //   if (dbPost) {
        //     console.log("Post created successfully:", dbPost);
        //     navigate(`/posts/${dbPost.$id}`);
        //   } else {
        //     console.error("Failed to create post");
        //   }
        // }

        if (file) {
          const fileId = file.$id;
          console.log("File uploaded successfully:", fileId);
          data.Image = fileId;
          console.log("data with fileId:", data);
          console.log("user:", user.$id);
          const dbPost = await StorageService.createPost({
            ...data,
            UserID: user.$id, // Add UserID to the post data
          });

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim() // remove whitespace at start/end
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // replace any non-alphanumeric sequence with "-"
        .replace(/^-+|-+$/g, ""); // remove leading/trailing "-"
    }
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "Title") {
        setValue("slug", slugTransform(value.Title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  React.useEffect(() => {
    if (post) {
      setValue("Title", post.Title);
      setValue("Content", post.Content);
      setValue("Status", post.Status || "active");
      setValue("slug", post.slug ? post.slug : slugTransform(post.Title), {
        shouldValidate: true,
      });
    }
  }, [post, setValue, slugTransform]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("Title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="Content"
          control={control}
          defaultValue={getValues("Content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label={post ? "Change Image (optional):" : "Image :"}
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("Image", { required: !post })}
        />

        {post && post.Image && (
          <div className="w-full mb-4">
            <p className="text-sm text-gray-600 mb-1">Current Image:</p>
            {/* Debug: Show the generated URL */}
            <p className="text-xs text-red-500 break-all">
              {StorageService.getFilePreview(post.Image)}
            </p>
            <img
              src={StorageService.getFilePreview(post.Image)}
              alt={post.Title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("Status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;

// PROBLEM:
// react-hook-form takes `defaultValues` only on the first render.
// When `EditPost` fetches the post asynchronously, the `post` prop
// updates AFTER the form is already initialized.
// Because of this, `defaultValues.slug` stays empty until the user
// changes the Title (which triggers the slugTransform via watch).

// FIX:
// Whenever `post` changes, update the form fields manually with setValue.
// This ensures that Title, Content, Status, and Slug are pre-filled
// when editing an existing post.

// next question to gpt when i updated the code with this
// async uploadFile(file, UserID) {
//         try {
//             return await this.storage.createFile(
//                 conf.appwriteBucketId,
//                 ID.unique(),
//                 file,
//                 [
//                     Permission.read(Role.any()),     // 👈 anyone can view
//                     Permission.write(Role.any()), //For Temperory any but for production it must be only owner can edit/delete
//                 ]
//             );
//         } catch (error) {
//             console.error("Appwrite Service :: uploadFile :: error", error);
//         }
//     }
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
        Category: post?.Category || "general",
        ImageURL: typeof post?.Image === 'string' && /^https?:\/\//i.test(post?.Image) ? post.Image : "",
      },
    });

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const onSubmit = async (data) => {
    try {
      if (post) {
        // Update post logic
        const hasFile = data.Image && data.Image[0];
        const uploaded = hasFile ? await StorageService.uploadFile(data.Image[0]) : null;

        let imageId = post.Image;
        if (uploaded) {
          if (post.Image) {
            try { await StorageService.deleteFile(post.Image); } catch (_) {}
          }
          imageId = uploaded.$id;
        } else if (data.ImageURL && /^https?:\/\//i.test(data.ImageURL)) {
          imageId = data.ImageURL.trim();
        }

        const oldSlug = post.$id;
        const newSlug = data.slug;

        if (newSlug && newSlug !== oldSlug) {
          const created = await StorageService.createPost({
            ...data,
            slug: newSlug,
            Image: imageId,
            UserID: user.$id,
            AuthorName: user.name || user.email || "Anonymous",
          });
          if (created) {
            try { await StorageService.deletePost(oldSlug); } catch (_) {}
            navigate(`/post/${newSlug}`);
            return;
          }
          console.error("Failed to recreate post with new slug");
        } else {
          const dbPost = await StorageService.updatePost(oldSlug, { ...data, Image: imageId });
          if (dbPost) {
            navigate(`/post/${oldSlug}`);
          } else {
            console.error("Failed to update post");
          }
        }
        return;
      }

      // Create new post
      const hasFile = data.Image && data.Image[0];
      const uploaded = hasFile ? await StorageService.uploadFile(data.Image[0]) : null;
      let imageId = null;
      if (uploaded) {
        imageId = uploaded.$id;
      } else if (data.ImageURL && /^https?:\/\//i.test(data.ImageURL)) {
        imageId = data.ImageURL.trim();
      } else {
        alert("Please upload an image or paste a valid image URL");
        return;
      }

      const dbPost = await StorageService.createPost({
        ...data,
        Image: imageId,
        UserID: user.$id,
        AuthorName: user.name || user.email || "Anonymous",
      });
      if (dbPost) {
        const newSlug = dbPost.slug || data.slug;
        navigate(`/post/${newSlug}`);
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
      setValue("Category", post.Category || "general");
      setValue("ImageURL", (typeof post.Image === 'string' && /^https?:\/\//i.test(post.Image)) ? post.Image : "");
    }
  }, [post, setValue, slugTransform]);

  return (
    <div className="w-full py-8">
      <div className="relative mx-auto w-full max-w-6xl rounded-2xl p-6 sm:p-8 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur bg-white dark:bg-slate-800/90 dark:ring-slate-700 overflow-hidden">
        <div className="absolute inset-x-0 -top-1 mx-auto h-1.5 w-40 rounded-full bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 shadow-lg shadow-orange-500/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/3 via-purple-500/3 to-cyan-500/3 pointer-events-none"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Input
              label="Title :"
              placeholder="Title"
              className=""
              {...register("Title", { required: true })}
            />
            <Input
              label="Slug :"
              placeholder="Slug"
              className=""
              {...register("slug", { required: true })}
              onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                });
              }}
            />
            <div className="rounded-xl ring-1 ring-slate-900/10 dark:ring-slate-700 bg-white dark:bg-slate-800/60 p-2">
              <RTE
                label="Content :"
                name="Content"
                control={control}
                defaultValue={getValues("Content")}
              />
            </div>
          </div>
          <div className="space-y-4">
            <Input
              label={post ? "Change Image (optional):" : "Image :"}
              type="file"
              className=""
              accept="image/png, image/jpg, image/jpeg, image/gif"
              {...register("Image", { required: !post })}
            />
            <Input
              label="Or paste Image URL"
              type="url"
              placeholder="https://..."
              {...register("ImageURL")}
            />

            {post && post.Image && (
              <div className="w-full">
                <p className="text-sm text-gray-600 dark:text-slate-300 mb-1">Current Image:</p>
                {/* Debug: Show the generated URL */}
                <p className="text-xs text-red-500 break-all">
                  {StorageService.getFilePreview(post.Image)}
                </p>
                <div className="overflow-hidden rounded-lg ring-1 ring-slate-900/10 dark:ring-slate-700">
                  <img
                    src={StorageService.getFilePreview(post.Image)}
                    alt={post.Title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
            <Select
              options={["active", "inactive"]}
              label="Status"
              className=""
              {...register("Status", { required: true })}
            />
            <Select
              options={["general","technology","health","travel","food","finance","sports","education","lifestyle","entertainment"]}
              label="Category"
              className=""
              {...register("Category", { required: true })}
            />
            <Button
              type="submit"
              bgColor={post ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
              className="w-full"
            >
              {post ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
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
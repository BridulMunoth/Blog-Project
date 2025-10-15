import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

export default function RTE({
  name,
  control,
  label,
  rules,
  defaultValue = "",
}) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="ib5um7o2a8qhymmv519b5pd5az80dmi7l2y21rw5deqg4xcw"
            initialValue={defaultValue}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | styleselect formatselect | bold italic underline backcolor forecolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | link image table code | \
                    removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              // tinycomments_mode: "embedded",
              // tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() =>
                  Promise.reject("See docs to implement AI Assistant")
                ),
              uploadcare_public_key: "dbf84bcabe5e3b101504",
            }}
            onEditorChange={onChange}
            // onEditorChange={(content) => onChange(content)}
          />
        )}
      />
    </div>
  );
}

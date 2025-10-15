import React from "react";
import { Link } from "react-router-dom";
import StorageService from "../appwrite/config";

function PostCard({ $id, Title, Image }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img
            src={StorageService.getFilePreview(Image)}
            alt={Title}
            className="rounded-xl"
          />
        </div>
        <h2 className="text-lg font-bold">{Title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;

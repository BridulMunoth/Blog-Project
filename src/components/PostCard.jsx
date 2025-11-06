import React from "react";
import { Link } from "react-router-dom";
import StorageService from "../appwrite/config";

function PostCard({ $id, Title, Image = '', AuthorName }) {
  return (
    <Link to={`/post/${$id}`} className="block group h-full">
      {/* Outer glossy gradient border */}
      <div className="relative h-full rounded-2xl p-[1.5px] bg-gradient-to-r from-purple-400/70 via-fuchsia-400/70 to-violet-400/70 shadow-lg transition-transform duration-300 group-hover:-translate-y-1 dark:from-slate-700/60 dark:via-slate-700/60 dark:to-slate-700/60">
        
        {/* Inner card with glossy purple + text-black */}
        <div className="h-full flex flex-col rounded-2xl 
          bg-purple-200/80 backdrop-blur-md dark:bg-slate-800/95 
          p-6 ring-1 ring-purple-300/70 dark:ring-slate-700 overflow-hidden light-card light-card-ring">
          
          {/* Soft glossy hover overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/40 via-transparent to-white/10" />
          
          {/* Image Container */}
          <div className="relative w-full flex-1 mb-5 overflow-hidden rounded-xl bg-purple-100/70 dark:bg-slate-700 group-hover:scale-[1.02] transition-transform duration-300">
            <img
              src={Image ? StorageService.getFilePreview(Image) : 'https://placehold.co/600x400/1e293b/94a3b8?text=Blog+Image'}
              alt={Title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                if (e.target.src !== 'https://placehold.co/600x400/1e293b/94a3b8?text=Blog+Image') {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400/1e293b/94a3b8?text=Blog+Image';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Title */}
          <h2 className="relative text-xl font-bold text-black dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors duration-300 line-clamp-3 leading-snug light-card-title">
            {Title}
          </h2>
          {AuthorName && (
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              by <span className="font-medium">{AuthorName}</span>
            </div>
          )}
          
          {/* Read More CTA */}
          <div className="mt-4 pt-4 border-t border-purple-300/60 dark:border-slate-700">
            <span className="inline-flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:underline">
              Read more
              <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StorageService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const isAuthor = user && post && user.$id === post.UserID;

    useEffect(() => {
        if (slug) {
            StorageService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                } else {
                    console.error("Post not found");
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        StorageService.deletePost(post.$id).then((status) => {
            if (status){
                StorageService.deleteFile(post.Image)
                navigate("/"); 
            }
        })
    }

return post ? (
        <div className="py-10">
            <Container>
                <div className="relative mx-auto w-full max-w-3xl rounded-2xl p-0 sm:p-1 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur bg-white dark:bg-slate-800/90 dark:ring-slate-700 overflow-hidden">
                    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                        <img
                            src={StorageService.getFilePreview(post.Image)}
                            alt={post.Title}
                            className="w-full h-auto max-h-[520px] object-contain"
                        />
                    </div>

                    {isAuthor && (
                        <div className="absolute right-4 top-4 flex gap-2 z-10">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-emerald-600 hover:bg-emerald-700" className="mr-0 shadow-lg">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-600 hover:bg-red-700" onClick={deletePost} className="shadow-lg">
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mx-auto w-full max-w-3xl mt-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-1 bg-clip-text text-transparent 
                    bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 
                    dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 
                    drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">{post.Title}</h1>
                </div>

                <div className="mx-auto w-full max-w-3xl mt-6 content-prose">
                    {parse(post.Content)}
                </div>
            </Container>
        </div>
    ) : null;
}



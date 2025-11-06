import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import StorageService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        StorageService.listPosts([]).then((posts) => {
            posts && setPosts(posts.documents)
        })
    }, []);
  return (
    <div className='w-full py-10 min-h-[60vh]'>
        <Container>
            <div className="mb-12 text-center transition-all duration-500">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent 
      bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 
      dark:from-red-400 dark:via-rose-400 dark:to-pink-400 
      drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-all duration-700">All Posts</h1>
                <p className="text-lg prefer-light text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
                    Browse through our collection of insightful blog posts and articles
                </p>
            </div>
            <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {posts.map((post) => (
                    <PostCard key={post.$id} {...post} />
                ))}
            </div>
            </Container>
    </div>
  )
}

export default AllPosts

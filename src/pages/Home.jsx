import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container, PostCard, Button } from "../components";
import StorageService from "../appwrite/config";
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Search from 'lucide-react/dist/esm/icons/search';
import X from 'lucide-react/dist/esm/icons/x';
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;
  const user = useSelector((state) => state.auth.user);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await StorageService.listPosts();
      if (response) {
        setPosts(response.documents || []);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts based on search query and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.Content && post.Content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = category === 'all' || post.Category === category;
    return matchesSearch && matchesCategory;
  });

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (category !== 'all') params.set('category', category);
    setSearchParams(params);
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (newCategory !== 'all') params.set('category', newCategory);
    setSearchParams(params);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Get unique categories
  const categories = [...new Set(posts.map(post => post.Category).filter(Boolean))];

  // Loading state
  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <p className="text-slate-700 dark:text-slate-300">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full py-20">
        <Container>
          <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-red-50 dark:bg-red-900/20">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Oops! Something went wrong</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">{error}</p>
            <Button
              onClick={fetchPosts}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
            >
              Try Again
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 dark:from-red-400 dark:via-rose-400 dark:to-pink-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
                Welcome to BRM Blogger
              </h1>
              <p className="prefer-light text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Share your stories, insights, and inspirations with a beautiful, modern blogging experience.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link to="/signup" className="px-6 py-3 rounded-full text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow hover:opacity-90 transition">
                Create an account
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-full bg-white text-slate-900 ring-1 ring-pink-300 hover:bg-pink-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600 transition">
                Sign in
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-20">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-2xl bg-white dark:bg-slate-800/90 backdrop-blur-sm ring-1 ring-slate-900/10 dark:ring-slate-700 p-12 text-center shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse"></div>
              <div className="relative">
                <div className="inline-block mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-orange-500/50">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">No Posts Yet</h1>
                <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 font-medium">Be the first to create an amazing post!</p>
                <div className="flex gap-4 justify-center">
                  <Link
                    to="/add-post"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 text-white rounded-full font-medium shadow-lg shadow-orange-500/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Create First Post
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  return (
    <div className="w-full py-10">
      <Container>
        <div className="mb-12 text-center transition-all duration-500">
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent 
      bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 
      dark:from-red-400 dark:via-rose-400 dark:to-pink-400 
      drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-all duration-700"
          >
            Discover Posts
          </h1>
          <p
            className="text-lg font-medium max-w-2xl mx-auto mb-8 
      prefer-light text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-500"
          >
            Explore our collection of engaging blog posts and inspiring articles.
          </p>


          {/* Search and Filter */}
          <div className="max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative p-[2px] rounded-full bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 shadow-md">
                <div className="relative rounded-full bg-pink-50 dark:bg-slate-800 ring-1 ring-pink-200/70 dark:ring-slate-700 light-search-inner">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="block w-full pl-10 pr-20 py-3 rounded-full bg-transparent text-black dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none light-search-input"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow hover:opacity-90 transition-opacity"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {(searchQuery || category !== 'all') && (
              <div className="flex justify-center items-center gap-2 mb-6">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                  {searchQuery && ` for "${searchQuery}"`}
                  {category !== 'all' && ` in ${category}`}
                </span>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:underline"
                >
                  <X className="w-4 h-4" /> Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {
          currentPosts.length > 0 ? (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentPosts.map((post) => (
                  <PostCard key={post.$id} {...post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show current page in the middle when possible
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentPage === pageNum
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No posts found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear all filters
              </button>                    
            </div>
          )
        }
      </Container >
    </div >
  );
}
export default Home;

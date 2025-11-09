import React from 'react';
import { Bookmark } from 'lucide-react';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import PostCard from '../components/posts/PostCard';

const BookmarksPage = () => {
  // Mock bookmarked posts
  const bookmarkedPosts = [
    {
      _id: 'bookmark-1',
      author: { username: 'WisdomKeeper', avatar: 'https://i.pravatar.cc/150?img=11' },
      content: 'Every elder is library. Sit and listen. 📚✨',
      images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800'],
      hashtags: ['Wisdom', 'Culture', 'AfricanProverbs'],
      likesCount: 245,
      commentsCount: 34,
      location: 'Lagos, Nigeria',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center space-x-3">
            <Bookmark className="w-6 h-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {bookmarkedPosts.length} saved {bookmarkedPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {/* Bookmarked Posts */}
        {bookmarkedPosts.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {bookmarkedPosts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookmarks Yet</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Bookmark posts to save them for later. They'll show up here.
            </p>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default BookmarksPage;

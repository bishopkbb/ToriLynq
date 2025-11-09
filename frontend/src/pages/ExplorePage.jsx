import React, { useState } from 'react';
import { Search, TrendingUp, Hash } from 'lucide-react';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import PostCard from '../components/posts/PostCard';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending'); // trending, people, hashtags

  // Mock trending posts
  const trendingPosts = [
    {
      _id: 'explore-1',
      author: { username: 'FoodieNaija', avatar: 'https://i.pravatar.cc/150?img=30' },
      content: 'Best Jollof rice recipe! 🍛 Who wants the secret? #JollofRice #NigerianFood',
      images: ['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800'],
      hashtags: ['JollofRice', 'NigerianFood', 'Cooking'],
      likesCount: 342,
      commentsCount: 89,
      location: 'Lagos, Nigeria',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      _id: 'explore-2',
      author: { username: 'TravelDiaries', avatar: 'https://i.pravatar.cc/150?img=31' },
      content: 'Sunset at Cape Coast Castle 🌅 #Ghana #Travel #History',
      images: ['https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=800'],
      hashtags: ['Ghana', 'Travel', 'History'],
      likesCount: 567,
      commentsCount: 123,
      location: 'Cape Coast, Ghana',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ];

  // Mock trending hashtags
  const trendingHashtags = [
    { tag: 'ToriLynqAdventures', posts: '15.2K', growth: '+12%' },
    { tag: 'AfricanCulture', posts: '23.5K', growth: '+8%' },
    { tag: 'NigerianFood', posts: '18.7K', growth: '+15%' },
    { tag: 'GhanaLove', posts: '12.3K', growth: '+5%' },
    { tag: 'LagosLife', posts: '9.8K', growth: '+20%' },
  ];

  // Mock suggested people
  const suggestedPeople = [
    { id: 1, username: 'AfroArtist', avatar: 'https://i.pravatar.cc/150?img=40', followers: '5.2K', bio: 'Digital artist | Lagos' },
    { id: 2, username: 'MusicVibes', avatar: 'https://i.pravatar.cc/150?img=41', followers: '8.9K', bio: 'Afrobeats producer' },
    { id: 3, username: 'FashionIcon', avatar: 'https://i.pravatar.cc/150?img=42', followers: '12.5K', bio: 'Fashion designer | Accra' },
  ];

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header with Search */}
        <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Explore</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, people, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                activeTab === 'trending' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Trending</span>
            </button>
            <button
              onClick={() => setActiveTab('hashtags')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                activeTab === 'hashtags' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Hash className="w-4 h-4" />
              <span className="font-medium">Hashtags</span>
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === 'people' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span className="font-medium">People</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {activeTab === 'trending' && (
            <div className="divide-y divide-gray-200">
              {trendingPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {activeTab === 'hashtags' && (
            <div className="p-4 space-y-3">
              {trendingHashtags.map((hashtag, index) => (
                <button
                  key={hashtag.tag}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">#{index + 1} Trending</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">#{hashtag.tag}</p>
                      <p className="text-sm text-gray-600 mt-1">{hashtag.posts} posts</p>
                    </div>
                    <div className="text-right">
                      <span className="text-primary-500 font-semibold">{hashtag.growth}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'people' && (
            <div className="p-4 space-y-4">
              {suggestedPeople.map(person => (
                <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3 flex-1">
                    <img
                      src={person.avatar}
                      alt={person.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">@{person.username}</p>
                      <p className="text-sm text-gray-600 truncate">{person.bio}</p>
                      <p className="text-xs text-gray-500">{person.followers} followers</p>
                    </div>
                  </div>
                  <button className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default ExplorePage;

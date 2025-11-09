import React, { useState } from 'react';
import { 
  TrendingUp, Hash, MapPin, Sparkles, Clock, 
  Heart, MessageCircle, Eye, ChevronRight, Music,
  Video, Image as ImageIcon, Award, Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import PostCard from '../components/posts/PostCard';

const TrendingPage = () => {
  const [activeCategory, setActiveCategory] = useState('all'); // all, hashtags, locations, sounds, creators

  // Mock trending hashtags (Twitter/Instagram style)
  const trendingHashtags = [
    {
      id: 1,
      tag: 'ToriLynqAdventures',
      category: 'Entertainment',
      posts: 45200,
      growth: '+125%',
      trend: 'up',
      description: 'Share your adventures on ToriLynq',
    },
    {
      id: 2,
      tag: 'NaijaJollof',
      category: 'Food & Cooking',
      posts: 89300,
      growth: '+89%',
      trend: 'up',
      description: 'The great Jollof debate continues',
    },
    {
      id: 3,
      tag: 'AfricanFashion',
      category: 'Fashion',
      posts: 67800,
      growth: '+45%',
      trend: 'up',
      description: 'Celebrating African fashion excellence',
    },
    {
      id: 4,
      tag: 'TechInAfrica',
      category: 'Technology',
      posts: 34500,
      growth: '+67%',
      trend: 'up',
      description: 'Tech innovation across the continent',
    },
    {
      id: 5,
      tag: 'LagosLife',
      category: 'Lifestyle',
      posts: 23400,
      growth: '+12%',
      trend: 'steady',
      description: 'Life in the city that never sleeps',
    },
  ];

  // Mock trending locations (Instagram/Foursquare style)
  const trendingLocations = [
    {
      id: 1,
      name: 'Lekki Phase 1, Lagos',
      posts: 12400,
      image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400',
      topHashtag: '#LagosLife',
    },
    {
      id: 2,
      name: 'Obudu Mountain Resort',
      posts: 8900,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      topHashtag: '#NigerianTourism',
    },
    {
      id: 3,
      name: 'Eko Atlantic City',
      posts: 15600,
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
      topHashtag: '#ModernLagos',
    },
  ];

  // Mock trending sounds (TikTok style)
  const trendingSounds = [
    {
      id: 1,
      name: 'Amapiano Vibes 2024',
      artist: 'DJ Maphorisa',
      videos: 234500,
      duration: '0:30',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    },
    {
      id: 2,
      name: 'Afrobeats Dance Challenge',
      artist: 'Burna Boy',
      videos: 189200,
      duration: '0:15',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    },
    {
      id: 3,
      name: 'Original Sound',
      artist: 'Trending Creator',
      videos: 156700,
      duration: '0:25',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    },
  ];

  // Mock trending creators (YouTube/TikTok style)
  const trendingCreators = [
    {
      id: 1,
      username: 'AfroArtist',
      avatar: 'https://i.pravatar.cc/150?img=40',
      followers: 567800,
      category: 'Art & Design',
      isVerified: true,
      recentPosts: 45,
      engagement: '12.5%',
    },
    {
      id: 2,
      username: 'ChefKemi',
      avatar: 'https://i.pravatar.cc/150?img=41',
      followers: 892300,
      category: 'Food & Cooking',
      isVerified: true,
      recentPosts: 89,
      engagement: '18.2%',
    },
    {
      id: 3,
      username: 'TechGuru',
      avatar: 'https://i.pravatar.cc/150?img=42',
      followers: 423100,
      category: 'Technology',
      isVerified: true,
      recentPosts: 67,
      engagement: '9.8%',
    },
  ];

  // Mock trending posts
  const trendingPosts = [
    {
      _id: 'trending-1',
      author: { username: 'ViralContent', avatar: 'https://i.pravatar.cc/150?img=60' },
      content: 'This is how we do it in Lagos! 🔥 #LagosLife #ViralMoment',
      images: ['https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800'],
      hashtags: ['LagosLife', 'ViralMoment'],
      likesCount: 45600,
      commentsCount: 1234,
      viewsCount: 234567,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ];

  // Format numbers
  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 z-10">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              <h1 className="text-2xl font-bold text-gray-900">Trending</h1>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>

            {/* Category Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'all', label: 'All', icon: TrendingUp },
                { id: 'hashtags', label: 'Hashtags', icon: Hash },
                { id: 'locations', label: 'Locations', icon: MapPin },
                { id: 'sounds', label: 'Sounds', icon: Music },
                { id: 'creators', label: 'Creators', icon: Award },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {/* All / Hashtags */}
          {(activeCategory === 'all' || activeCategory === 'hashtags') && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Hash className="w-5 h-5 text-primary-500" />
                  <span>Trending Hashtags</span>
                </h2>
                <button className="text-primary-500 text-sm font-semibold hover:underline">
                  See all
                </button>
              </div>

              <div className="space-y-3">
                {trendingHashtags.map((hashtag, index) => (
                  <button
                    key={hashtag.id}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs text-gray-500 font-semibold">
                            {index + 1} · {hashtag.category} · Trending
                          </span>
                          {hashtag.trend === 'up' && (
                            <div className="flex items-center space-x-1 text-primary-500">
                              <TrendingUp className="w-3 h-3" />
                              <span className="text-xs font-semibold">{hashtag.growth}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">#{hashtag.tag}</h3>
                        <p className="text-sm text-gray-600 mb-2">{hashtag.description}</p>
                        <p className="text-xs text-gray-500">{formatCount(hashtag.posts)} posts</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {(activeCategory === 'all' || activeCategory === 'locations') && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <span>Trending Locations</span>
                </h2>
                <button className="text-primary-500 text-sm font-semibold hover:underline">
                  Explore
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {trendingLocations.map((location) => (
                  <button
                    key={location.id}
                    className="relative h-32 rounded-xl overflow-hidden group"
                  >
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold mb-1">{location.name}</h3>
                      <div className="flex items-center justify-between text-white/90 text-sm">
                        <span>{formatCount(location.posts)} posts</span>
                        <span className="text-primary-400">{location.topHashtag}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sounds */}
          {(activeCategory === 'all' || activeCategory === 'sounds') && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Music className="w-5 h-5 text-primary-500" />
                  <span>Trending Sounds</span>
                </h2>
                <button className="text-primary-500 text-sm font-semibold hover:underline">
                  Listen
                </button>
              </div>

              <div className="space-y-3">
                {trendingSounds.map((sound) => (
                  <button
                    key={sound.id}
                    className="w-full flex items-center space-x-4 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={sound.image}
                        alt={sound.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 truncate">{sound.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{sound.artist}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <Video className="w-3 h-3" />
                        <span>{formatCount(sound.videos)} videos</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{sound.duration}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Creators */}
          {(activeCategory === 'all' || activeCategory === 'creators') && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary-500" />
                  <span>Trending Creators</span>
                </h2>
                <button className="text-primary-500 text-sm font-semibold hover:underline">
                  See all
                </button>
              </div>

              <div className="space-y-3">
                {trendingCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="relative">
                        <img
                          src={creator.avatar}
                          alt={creator.username}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        {creator.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 flex items-center space-x-1">
                          <span>@{creator.username}</span>
                        </h3>
                        <p className="text-sm text-gray-600">{creator.category}</p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                          <span>{formatCount(creator.followers)} followers</span>
                          <span>•</span>
                          <span>{creator.engagement} engagement</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Posts */}
          {activeCategory === 'all' && (
            <div className="border-t border-gray-200">
              <div className="p-4 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Hot Right Now</span>
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {trendingPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default TrendingPage;
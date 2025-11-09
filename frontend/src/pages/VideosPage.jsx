import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Play, Pause, Heart, MessageCircle, Share2, Bookmark, 
  Volume2, VolumeX, MoreVertical, Music, User, Flag,
  ChevronUp, ChevronDown, Search, Filter
} from 'lucide-react';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

const VideosPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('foryou'); // foryou, following, live
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const videoRef = useRef(null);

  // Mock videos data (TikTok/Reels style)
  const videos = [
    {
      id: 1,
      author: {
        username: 'DanceKing',
        avatar: 'https://i.pravatar.cc/150?img=50',
        isVerified: true,
      },
      videoUrl: 'https://example.com/video1.mp4', // Placeholder
      thumbnail: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800',
      caption: 'New dance challenge! Who can do this? 🕺💃 #DanceChallenge #Viral',
      sound: 'Original Sound - DanceKing',
      likes: 45600,
      comments: 892,
      shares: 234,
      bookmarks: 1200,
      isLiked: false,
      isBookmarked: false,
      hashtags: ['DanceChallenge', 'Viral', 'ToriLynq'],
    },
    {
      id: 2,
      author: {
        username: 'ChefKemi',
        avatar: 'https://i.pravatar.cc/150?img=51',
        isVerified: false,
      },
      videoUrl: 'https://example.com/video2.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
      caption: '30-second Jollof rice hack! 🍛 You won\'t believe how easy this is! #Cooking #JollofRice',
      sound: 'Trending Sound 2024',
      likes: 78900,
      comments: 1543,
      shares: 567,
      bookmarks: 3400,
      isLiked: true,
      isBookmarked: false,
      hashtags: ['Cooking', 'JollofRice', 'FoodTok'],
    },
    {
      id: 3,
      author: {
        username: 'ComedyNaija',
        avatar: 'https://i.pravatar.cc/150?img=52',
        isVerified: true,
      },
      videoUrl: 'https://example.com/video3.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
      caption: 'When your Nigerian mom finds out you didn\'t eat the food 😂😂 #Comedy #Relatable',
      sound: 'Funny Sound Effects',
      likes: 123400,
      comments: 2891,
      shares: 1200,
      bookmarks: 5600,
      isLiked: false,
      isBookmarked: true,
      hashtags: ['Comedy', 'Relatable', 'NaijaHumor'],
    },
  ];

  const currentVideo = videos[currentVideoIndex];

  // Handle video navigation
  const goToPrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const goToNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  // Handle like
  const handleLike = () => {
    // TODO: API call to like video
    console.log('Liked video:', currentVideo.id);
  };

  // Handle bookmark
  const handleBookmark = () => {
    // TODO: API call to bookmark video
    console.log('Bookmarked video:', currentVideo.id);
  };

  // Handle share
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  // Format numbers (45600 -> 45.6K)
  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <ResponsiveLayout>
      <div className="bg-black min-h-screen relative">
        {/* Top Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between p-4 max-w-screen-sm mx-auto">
            {/* Live indicator (optional) */}
            <button className="text-white/80 hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </button>

            {/* Tabs */}
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('following')}
                className={`text-sm font-semibold transition-colors ${
                  activeTab === 'following' ? 'text-white' : 'text-white/60'
                }`}
              >
                Following
              </button>
              <button
                onClick={() => setActiveTab('foryou')}
                className={`text-sm font-semibold transition-colors relative ${
                  activeTab === 'foryou' ? 'text-white' : 'text-white/60'
                }`}
              >
                For You
                {activeTab === 'foryou' && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className={`text-sm font-semibold transition-colors flex items-center space-x-1 ${
                  activeTab === 'live' ? 'text-white' : 'text-white/60'
                }`}
              >
                <span>LIVE</span>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>

            <button className="text-white/80 hover:text-white transition-colors">
              <Filter className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative h-screen max-w-screen-sm mx-auto">
          {/* Video Placeholder (since we don't have real videos) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Play/Pause overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Arrows (Desktop) */}
          <div className="hidden md:block">
            <button
              onClick={goToPrevVideo}
              disabled={currentVideoIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={goToNextVideo}
              disabled={currentVideoIndex === videos.length - 1}
              className="absolute left-4 bottom-32 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Right Action Buttons (TikTok style) */}
          <div className="absolute right-4 bottom-24 flex flex-col space-y-6">
            {/* Author Avatar */}
            <button className="relative">
              <img
                src={currentVideo.author.avatar}
                alt={currentVideo.author.username}
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center border-2 border-black">
                <User className="w-3 h-3 text-white" />
              </div>
            </button>

            {/* Like */}
            <button onClick={handleLike} className="flex flex-col items-center space-y-1">
              <Heart
                className={`w-8 h-8 ${
                  currentVideo.isLiked ? 'text-red-500 fill-red-500' : 'text-white'
                }`}
              />
              <span className="text-xs text-white font-semibold">
                {formatCount(currentVideo.likes)}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setShowComments(true)}
              className="flex flex-col items-center space-y-1"
            >
              <MessageCircle className="w-8 h-8 text-white" />
              <span className="text-xs text-white font-semibold">
                {formatCount(currentVideo.comments)}
              </span>
            </button>

            {/* Bookmark */}
            <button onClick={handleBookmark} className="flex flex-col items-center space-y-1">
              <Bookmark
                className={`w-8 h-8 ${
                  currentVideo.isBookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-white'
                }`}
              />
              <span className="text-xs text-white font-semibold">
                {formatCount(currentVideo.bookmarks)}
              </span>
            </button>

            {/* Share */}
            <button onClick={handleShare} className="flex flex-col items-center space-y-1">
              <Share2 className="w-8 h-8 text-white" />
              <span className="text-xs text-white font-semibold">
                {formatCount(currentVideo.shares)}
              </span>
            </button>

            {/* More Options */}
            <button className="flex flex-col items-center">
              <MoreVertical className="w-8 h-8 text-white" />
            </button>

            {/* Sound Disc (Rotating) */}
            <button className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-spin-slow">
                <Music className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="max-w-xs">
              {/* Author */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-white font-semibold">@{currentVideo.author.username}</span>
                {currentVideo.author.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
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

              {/* Caption */}
              <p className="text-white text-sm mb-2 line-clamp-2">{currentVideo.caption}</p>

              {/* Sound */}
              <div className="flex items-center space-x-2 text-white/90 text-xs">
                <Music className="w-4 h-4" />
                <span className="truncate">{currentVideo.sound}</span>
              </div>
            </div>
          </div>

          {/* Volume Control */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-20 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Share Menu Modal */}
        {showShareMenu && (
          <div
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
            onClick={() => setShowShareMenu(false)}
          >
            <div
              className="bg-white rounded-t-3xl w-full max-w-screen-sm p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share to</h3>
              <div className="grid grid-cols-4 gap-4">
                {['WhatsApp', 'Facebook', 'Twitter', 'Copy Link'].map((platform) => (
                  <button
                    key={platform}
                    className="flex flex-col items-center space-y-2 hover:opacity-70 transition-opacity"
                  >
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-xs text-gray-600">{platform}</span>
                  </button>
                ))}
              </div>
              <button className="w-full py-3 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                Report
              </button>
            </div>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-40 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm px-6 py-4 rounded-xl">
            <Play className="w-12 h-12 text-primary-500 mx-auto mb-2" />
            <p className="text-white font-semibold">Video Feature Coming Soon!</p>
            <p className="text-white/70 text-sm mt-1">UI Preview</p>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default VideosPage;
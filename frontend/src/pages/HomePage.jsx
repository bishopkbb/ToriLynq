import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../components/layout/MainLayout';
import StoryCarousel from '../components/stories/StoryCarousel';
import PostCard from '../components/posts/PostCard';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock posts data (will be replaced with API call)
  const mockPosts = [
    {
      _id: '1',
      author: {
        username: 'AfroNomadStories',
        avatar: 'https://i.pravatar.cc/150?img=10',
      },
      content: 'Sunrise in Jamestown! The energy here ad electric.',
      images: ['https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=600'],
      hashtags: ['GhanaLove', 'ToriLynqAdventures'],
      likesCount: 30,
      commentsCount: 5,
      isVideo: true,
      location: 'Accra, Ghana',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      _id: '2',
      author: {
        username: 'user123',
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
      content: 'Every elder is library. Sit and listen. 📚✨',
      images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600'],
      hashtags: ['Wisdom', 'Culture'],
      likesCount: 45,
      commentsCount: 8,
      location: 'Lagos, Nigeria',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
  ];

  return (
    <MainLayout>
      {/* Story Carousel */}
      <StoryCarousel />

      {/* Posts Feed */}
      <div className="divide-y divide-gray-200">
        {mockPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* Loading indicator for infinite scroll (future) */}
      <div className="py-8 text-center text-gray-500">
        <p className="text-sm">You're all caught up! 🎉</p>
      </div>
    </MainLayout>
  );
};

export default HomePage;

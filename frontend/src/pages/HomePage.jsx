import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import StoryCarousel from '../components/stories/StoryCarousel';
import PostCard from '../components/posts/PostCard';
import PostSkeleton from '../components/common/PostSkeleton';
import Loader from '../components/common/Loader';
import { fetchFeed, refreshFeed } from '../store/slices/postsSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, currentPage, hasMore, isLoading, isRefreshing } = useSelector(
    (state) => state.posts
  );

  // Mock posts as fallback when no real data
  const mockPosts = [
    {
      _id: 'mock-1',
      author: {
        username: 'AfroNomadStories',
        avatar: 'https://i.pravatar.cc/150?img=10',
      },
      content: 'Sunrise in Jamestown! The energy here ad electric. 🌅',
      images: ['https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=800'],
      hashtags: ['GhanaLove', 'ToriLynqAdventures'],
      likesCount: 30,
      commentsCount: 5,
      isVideo: true,
      location: 'Accra, Ghana',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      _id: 'mock-2',
      author: {
        username: 'WisdomKeeper',
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
      content: 'Every elder is library. Sit and listen. 📚✨',
      images: ['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800'],
      hashtags: ['Wisdom', 'Culture', 'AfricanProverbs'],
      likesCount: 45,
      commentsCount: 8,
      location: 'Lagos, Nigeria',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      _id: 'mock-3',
      author: {
        username: 'LagosStreetFood',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
      content: 'Jollof rice debate settled! 🍛 Nigerian style hits different! Who agrees?',
      images: ['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800'],
      hashtags: ['JollofWars', 'NigerianFood', 'FoodieLife'],
      likesCount: 120,
      commentsCount: 34,
      location: 'Lagos, Nigeria',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
  ];

  // Fetch initial feed
  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchFeed({ page: 1, limit: 10 }));
    }
  }, [dispatch, posts.length]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      dispatch(fetchFeed({ page: currentPage + 1, limit: 10 }));
    }
  }, [dispatch, currentPage, hasMore, isLoading]);

  // Refresh feed (pull to refresh)
  const handleRefresh = useCallback(() => {
    dispatch(refreshFeed({ limit: 10 }));
  }, [dispatch]);

  // Use real posts if available, otherwise use mock data
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  return (
    <ResponsiveLayout>
      {/* Story Carousel */}
      <StoryCarousel />

      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="py-4 text-center">
          <Loader size="sm" />
        </div>
      )}

      {/* Posts Feed with Infinite Scroll */}
      <InfiniteScroll
        dataLength={displayPosts.length}
        next={loadMore}
        hasMore={hasMore && posts.length > 0}
        loader={
          <div className="py-4">
            <PostSkeleton />
          </div>
        }
        endMessage={
          <div className="py-8 text-center">
            <p className="text-gray-500 font-medium mb-2">🎉 You're all caught up!</p>
            <p className="text-sm text-gray-400">
              {posts.length === 0 
                ? 'Follow people to see their posts in your feed'
                : 'No more posts to load'}
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 text-primary-500 hover:text-primary-600 font-semibold text-sm"
            >
              Refresh Feed
            </button>
          </div>
        }
        refreshFunction={handleRefresh}
        pullDownToRefresh={window.innerWidth < 768}
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <div className="text-center py-2">
            <p className="text-gray-500 text-sm">Pull down to refresh</p>
          </div>
        }
        releaseToRefreshContent={
          <div className="text-center py-2">
            <p className="text-primary-500 text-sm">Release to refresh</p>
          </div>
        }
      >
        <div className="divide-y divide-gray-200">
          {displayPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </InfiniteScroll>

      {/* Initial loading state */}
      {isLoading && posts.length === 0 && (
        <div>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* Empty state when no posts and no loading */}
      {!isLoading && posts.length === 0 && (
        <div className="py-16 text-center">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to ToriLynq!</h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Start following people to see their stories and posts in your feed
          </p>
          <button
            onClick={() => window.location.href = '/explore'}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Explore Users
          </button>
        </div>
      )}
    </ResponsiveLayout>
  );
};

export default HomePage;

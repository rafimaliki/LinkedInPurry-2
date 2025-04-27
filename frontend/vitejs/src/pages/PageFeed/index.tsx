import React, { useEffect, useState, useRef, useCallback } from "react";
import ProfileFeedCard from "./components/ProfileFeedCard";
import RecommendationFeedCard from "./components/RecommendationFeedCard";
import FeedCard from "./components/FeedCard";
import PostFeedCard from "./components/PostFeedCard";
import { useParams } from "react-router-dom";
import useActiveUser from "../../hooks/useActiveUser";

const PageFeed: React.FC = () => {
  const { user_id } = useParams();
  const [feedData, setFeedData] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeUser] = useActiveUser();
  const isFetchingNextPage = useRef(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const nextCursorRef = useRef<string | null>(null);

  const fetchFeedPage = useCallback(async (pageCursor: string | null) => {
    const response = await fetch(
      `http://localhost:3000/api/feed?cursor=${pageCursor || ""}&limit=5`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  }, []);

  const fetchNextPage = useCallback(async () => {
    if (loading || isFetchingNextPage.current || !hasMore) return;

    isFetchingNextPage.current = true;
    setLoading(true);

    try {
      const data = await fetchFeedPage(nextCursorRef.current);
      if (data.body.cleanedFeedData.length > 0) {
        setFeedData((prev) => {
          const newPosts = data.body.cleanedFeedData.filter(
            (newPost: any) =>
              !prev.some((existingPost) => existingPost.id === newPost.id)
          );
          return [...prev, ...newPosts]; // Append only unique posts
        });
        nextCursorRef.current = data.nextCursor;
        setHasMore(data.nextCursor !== null); // Check if there's more data
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching feed data:", error);
    } finally {
      setLoading(false);
      isFetchingNextPage.current = false;
    }
  }, [loading, hasMore, fetchFeedPage]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!activeUser) {
        setProfileData(null);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/profile/${user_id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
          }
        );
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    if (activeUser) fetchProfileData();
    if (feedData.length === 0) {
      // Initial fetch to prevent repeated calls
      if (activeUser) fetchNextPage();
    }
  }, [user_id, activeUser, fetchNextPage, feedData.length]);

  const handleScroll = useCallback(() => {
    if (!listRef.current || isFetchingNextPage.current || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 200) {
      if (activeUser) fetchNextPage(); // Trigger fetching when near the end
    }
  }, [fetchNextPage, hasMore]);

  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    listElement.addEventListener("scroll", handleScroll);
    return () => listElement.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!profileData && activeUser) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex flex-col lg:flex-row items-start justify-center gap-6 p-6 w-full lg:h-[90vh] md:h-[70vh] sm:h-[60vh]"
      ref={listRef}
      style={{
        overflowY: "auto",
      }}
    >
      <div className="w-full lg:w-[18%] mb-6 lg:mb-0">
        {activeUser ? (
          <ProfileFeedCard
            id={profileData.body.id}
            username={profileData.body.username}
            profile_photo={profileData.body.profile_photo}
            connection_count={profileData.body.connection_count}
            isAuthenticated={profileData.body.isAuthenticated}
          />
        ) : (
          <ProfileFeedCard
            id={0}
            username="Welcome, User!"
            profile_photo=""
            connection_count={0}
            isAuthenticated={false}
          />
        )}
      </div>
      {activeUser ? (
        <div className="w-full lg:w-[50%] mb-6 lg:mb-0">
          <PostFeedCard
            id={profileData.body.id}
            username={profileData.body.username}
            profile_photo={profileData.body.profile_photo}
            isAuthenticated={profileData.body.isAuthenticated}
          />
          {feedData.map((activity, index) => (
            <FeedCard
              key={activity.id} // Use unique post ID as key
              {...activity}
              isCurrentUser={activity.user_id === profileData.body.id}
            />
          ))}
          {loading && (
            <div className="text-center my-4">Loading more posts...</div>
          )}
        </div>
      ) : (
        <div className="w-full lg:w-[50%] mb-6 lg:mb-0">
          <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
            <h1 className="pl-4 pt-4 font-semibold">Not Logged In</h1>
          </div>
        </div>
      )}
      <div className="w-full lg:w-[22%]">
        <div className="w-full h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden ">
          {activeUser ? (
            <h1 className="pl-4 pt-4 font-semibold">Add to your feed</h1>
          ) : (
            <h1 className="pl-4 pt-4 font-semibold">Not logged in</h1>
          )}
          {profileData?.body.recommendations?.map((recommendation: any) => (
            <RecommendationFeedCard
              key={recommendation.id}
              {...recommendation}
              isAuthenticated={profileData.body.isAuthenticated}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageFeed;

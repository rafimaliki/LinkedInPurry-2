import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface PostFeedCardProps {
  id: number;
  username: string;
  profile_photo: string;
  isAuthenticated: boolean;
}

const PostFeedCard: React.FC<PostFeedCardProps> = ({
  id,
  username,
  profile_photo,
  isAuthenticated,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [postContent, setPostContent] = useState('');

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(event.target.value);
  };

  const handlePost = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/feed', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      alert('Post created successfully!');
      setPostContent('');
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg border border-neutral-300 mb-2">
      <div className="flex flex-row">
        <div className="flex flex-row gap-4">
          {profile_photo ? (
            <img
              className="w-[50px] h-[50px] rounded-full"
              src={profile_photo}
              alt={`${username}'s profile`}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="text-[50px] text-black bg-white rounded-full"
            />
          )}
          <button
            className="bg-white border border-gray-300 text-start text-gray-700 py-2 px-4 rounded-full hover:bg-gray-100 lg:w-[490px]"
            onClick={handleButtonClick}
          >
            Start a post, try writing by yourself!
          </button>
        </div>
      </div>
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-[100%] h-[50%] bg-white p-6 rounded-lg lg:w-[60%] relative lg:h-full">
            <button
              className="absolute top-4 right-4 text-gray-700"
              onClick={handleCloseDialog}
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
            <div className="flex flex-row mb-4">
              {profile_photo ? (
                <img
                  className="w-[80px] h-[80px] rounded-full"
                  src={profile_photo}
                  alt={`${username}'s profile`}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="text-[80px] text-black bg-white rounded-full"
                />
              )}
              <div className="flex flex-col justify-center items-start ml-2">
                <h2 className="text-lg font-bold cursor-pointer hover:underline">
                  {username}
                </h2>
                <p className="text-gray-600 text-base">Post to anyone</p>
              </div>
            </div>
            <textarea
              className="w-full h-[60%] p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="What do you want to talk about?"
              value={postContent}
              onChange={handleContentChange}
            />
            <div className="flex justify-end">
              <button
                className={`bg-[#0072b1] text-white py-1 px-5 rounded-full hover:opacity-50 ${!postContent ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''} ${postContent && postContent.length > 280 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                disabled={!postContent || postContent.length > 280}
                onClick={handlePost}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFeedCard;
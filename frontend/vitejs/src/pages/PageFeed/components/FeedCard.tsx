import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

interface FeedCardProps {
  id: number;
  updated_at: string;
  content: string;
  created_at: string;
  user_id: number;
  isCurrentUser: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({ id, updated_at, content, created_at, user_id, isCurrentUser }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postContent, setPostContent] = useState(content);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(event.target.value);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/feed/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      alert('Post updated successfully!');
      setIsEditDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/feed/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      alert('Post deleted successfully!');
      setIsDeleteDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg border border-neutral-300 mb-2 relative">
      <p className="text-gray-600">{content}</p>
      {updated_at !== created_at ? (
        <p className="text-gray-400 mt-2">Edited on {new Date(updated_at).toLocaleDateString()} by {user_id} postID {id} </p>
      ) : (
        <p className="text-gray-400 mt-2">Posted on {new Date(created_at).toLocaleDateString()} by {user_id} postID {id}</p>
      )}
      {isCurrentUser && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}

      {isEditDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full h-[50%] bg-white p-6 rounded-lg lg:w-[60%] lg:h-full relative">
            <button
              className="absolute top-4 right-4 text-gray-700"
              onClick={handleCloseEditDialog}
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <textarea
              className="w-full h-[60%] p-2 border border-gray-300 rounded-lg mb-4"
              value={postContent}
              onChange={handleContentChange}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
                onClick={handleCloseEditDialog}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${postContent.length === 0  ? 'opacity-50 cursor-not-allowed' : ''} ${postContent.length > 280  ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-[80%] bg-white p-6 rounded-lg lg:w-[40%] relative">
            <button
              className="absolute top-4 right-4 text-gray-700"
              onClick={handleCloseDeleteDialog}
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>
            <h2 className="text-xl font-bold mb-4">Delete Post</h2>
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
                onClick={handleCloseDeleteDialog}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
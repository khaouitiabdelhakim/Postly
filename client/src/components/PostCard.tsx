import React, { useState } from 'react';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  onUpdate: (post: Post) => void;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isOwner = user?.id === post.userId || user?.id === post.owner?.id;

  // Function to parse text and style hashtags
  const parseHashtags = (text: string) => {
    const hashtagRegex = /(#[a-zA-Z0-9_]+)/g;
    const parts = text.split(hashtagRegex);
    
    return parts.map((part, index) => {
      if (hashtagRegex.test(part)) {
        return (
          <span key={index} className="text-blue-600 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleEdit = async () => {
    if (!editText.trim()) {
      toast.error('Post cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await apiService.updatePost(post.id, { text: editText });
      if (response.success && response.data) {
        onUpdate(response.data);
        setIsEditing(false);
        toast.success('Post updated successfully!');
      } else {
        toast.error(response.error || 'Failed to update post');
      }
    } catch (error) {
      toast.error('Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await apiService.deletePost(post.id);
      if (response.success) {
        onDelete(post.id);
      } else {
        toast.error(response.error || 'Failed to delete post');
      }
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const response = await apiService.uploadMedia(post.id, file);
      if (response.success && response.data) {
        // Update the post with the new blob URL (already full URL from backend)
        const updatedPost = { ...post, blobUrl: response.data.blobUrl };
        onUpdate(updatedPost);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(response.error || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div className="card p-6 animate-fade-in">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium">
              {post.owner?.firstName?.[0] || 'U'}
              {post.owner?.lastName?.[0] || ''}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {post.owner?.firstName} {post.owner?.lastName}
            </p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <label className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="What's on your mind?"
          />
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEdit}
              disabled={isUpdating}
              className="btn btn-primary disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(post.text);
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {parseHashtags(post.text)}
          </p>

          {/* Image */}
          {post.blobUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <img
                src={post.blobUrl}
                alt="Post attachment"
                className="w-full h-auto max-h-96 object-cover"
                onError={(e) => {
                  console.error('Failed to load image:', post.blobUrl);
                  console.error('Image error event:', e);
                  console.error('Network status:', navigator.onLine);
                  // Test if we can fetch the URL directly
                  if (post.blobUrl) {
                    fetch(post.blobUrl)
                      .then(response => {
                        console.log('Fetch response status:', response.status);
                        console.log('Fetch response headers:', response.headers);
                      })
                      .catch(fetchError => {
                        console.error('Fetch error:', fetchError);
                      });
                  }
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', post.blobUrl);
                }}
              />
            </div>
          )}

          {/* Upload indicator */}
          {isUploading && (
            <div className="flex items-center space-x-2 text-primary-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span className="text-sm">Uploading image...</span>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default PostCard;

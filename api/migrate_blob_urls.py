#!/usr/bin/env python3
"""
Migration script to update existing blob URLs from full paths to filenames.
This ensures compatibility with the new blob serving endpoint.
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.post import Post
from app.models.user import User
from app.config import settings

def migrate_blob_urls():
    """Migrate existing blob URLs from full paths to filenames"""
    db = SessionLocal()
    
    try:
        # Get all posts with blob URLs
        posts_with_blobs = db.query(Post).filter(Post.blobUrl.isnot(None)).all()
        
        print(f"Found {len(posts_with_blobs)} posts with blob URLs")
        
        for post in posts_with_blobs:
            if post.blobUrl:
                print(f"Processing post {post.id}: {post.blobUrl}")
                
                # Check if it's already a filename (not a full path)
                if not ('/' in post.blobUrl or '\\' in post.blobUrl):
                    print(f"  Already a filename: {post.blobUrl}")
                    continue
                
                # Extract filename from path
                filename = os.path.basename(post.blobUrl)
                
                # Check if the file exists in uploads directory
                file_path = os.path.join(settings.upload_dir, filename)
                if os.path.exists(file_path):
                    print(f"  Updating to filename: {filename}")
                    post.blobUrl = filename
                else:
                    print(f"  File not found, removing blob URL: {file_path}")
                    post.blobUrl = None
        
        # Commit changes
        db.commit()
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_blob_urls()

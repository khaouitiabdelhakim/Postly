export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  creationDate: string;
  birthday: string;
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  blobUrl?: string | null;
  createdAt: string;
  owner?: User;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  birthday: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePostRequest {
  text: string;
}

export interface UpdatePostRequest {
  text: string;
}

export interface UploadResponse {
  message: string;
  blobUrl: string;
}

export interface ErrorResponse {
  detail: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

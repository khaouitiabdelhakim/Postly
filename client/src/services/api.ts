import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Post, 
  AuthResponse, 
  CreateUserRequest, 
  LoginRequest, 
  CreatePostRequest, 
  UpdatePostRequest,
  UploadResponse,
  ApiResponse 
} from '../types';
import { getToken, removeToken } from '../utils/auth';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'http://localhost:8001';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          removeToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to handle API responses
  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      success: true,
    };
  }

  private handleError(error: any): ApiResponse<never> {
    const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
    return {
      error: errorMessage,
      success: false,
    };
  }

  // Auth endpoints
  async signup(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.post<User>('/auth/signup', userData);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/signin', credentials);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.get<User>('/auth/me');
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Posts endpoints
  async getPosts(skip: number = 0, limit: number = 10): Promise<ApiResponse<Post[]>> {
    try {
      const response = await this.api.get<Post[]>(`/posts?skip=${skip}&limit=${limit}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    try {
      const response = await this.api.get<Post>(`/posts/${postId}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createPost(postData: CreatePostRequest): Promise<ApiResponse<Post>> {
    try {
      const response = await this.api.post<Post>('/posts', postData);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updatePost(postId: string, postData: UpdatePostRequest): Promise<ApiResponse<Post>> {
    try {
      const response = await this.api.put<Post>(`/posts/${postId}`, postData);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deletePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.api.delete<{ message: string }>(`/posts/${postId}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async uploadMedia(postId: string, file: File): Promise<ApiResponse<UploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await this.api.post<UploadResponse>(
        `/posts/${postId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const apiService = new ApiService();

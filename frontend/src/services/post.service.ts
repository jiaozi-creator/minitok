import api from './api'
import type {
  CreatePostPayload,
  GetPostsParams,
  PaginatedPostsResponse,
  PostDetail,
  PostItem,
} from '../types/post'

export const postService = {
  async getPosts(params?: GetPostsParams) {
    const response = await api.get<PaginatedPostsResponse>('/posts', {
      params,
    })

    return response.data
  },

  async getPostDetail(id: number) {
    const response = await api.get<PostDetail>(`/posts/${id}`)
    return response.data
  },

  async createPost(data: CreatePostPayload) {
    const response = await api.post<PostItem>('/posts', data)
    return response.data
  },

  async deletePost(id: number) {
    const response = await api.delete<{ message: string }>(`/posts/${id}`)
    return response.data
  },
}
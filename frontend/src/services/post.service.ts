import api from './api'
import type { CreatePostPayload, PostDetail, PostItem } from '../types/post'

export const postService = {
  async getPosts() {
    const response = await api.get<PostItem[]>('/posts')
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
}
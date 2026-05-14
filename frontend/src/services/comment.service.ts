import api from './api'
import type { CommentItem, CreateCommentPayload } from '../types/post'

export const commentService = {
  async getComments(postId: number) {
    const response = await api.get<CommentItem[]>(`/posts/${postId}/comments`)
    return response.data
  },

  async createComment(postId: number, data: CreateCommentPayload) {
    const response = await api.post<CommentItem>(`/posts/${postId}/comments`, data)
    return response.data
  },

  async deleteComment(commentId: number) {
    const response = await api.delete<{ message: string }>(`/comments/${commentId}`)
    return response.data
  },
}
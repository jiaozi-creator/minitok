import api from './api'

export interface LikeStatusResponse {
  liked: boolean
  likesCount: number
}

export const likeService = {
  async likePost(postId: number) {
    const response = await api.post<LikeStatusResponse>(
      `/posts/${postId}/like`,
    )

    return response.data
  },

  async unlikePost(postId: number) {
    const response = await api.delete<LikeStatusResponse>(
      `/posts/${postId}/like`,
    )

    return response.data
  },

  async getLikeStatus(postId: number) {
    const response = await api.get<LikeStatusResponse>(
      `/posts/${postId}/like-status`,
    )

    return response.data
  },
}
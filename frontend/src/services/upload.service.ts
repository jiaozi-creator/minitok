import api from './api'

export interface UploadImageResponse {
  filename: string
  url: string
}

export const uploadService = {
  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<UploadImageResponse>(
      '/upload/image',
      formData,
    )

    return response.data
  },
}
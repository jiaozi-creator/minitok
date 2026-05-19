export interface PostAuthor {
  id: number
  username: string
  email?: string
  avatar?: string | null
  bio?: string | null
}

export interface CommentUser {
  id: number
  username: string
  avatar?: string | null
}

export interface CommentItem {
  id: number
  postId: number
  userId: number
  content: string
  createdAt: string
  user: CommentUser
}

export interface PostItem {
  id: number
  authorId: number
  title: string
  content: string
  coverImage?: string | null
  createdAt: string
  updatedAt: string
  author: PostAuthor
  _count: {
    comments: number
    likes: number
  }
}

export interface PostDetail extends PostItem {
  comments: CommentItem[]
}

export interface CreatePostPayload {
  title: string
  content: string
  coverImage?: string
}

export interface CreateCommentPayload {
  content: string
}

export interface PostsPaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
}

export interface PaginatedPostsResponse {
  items: PostItem[]
  meta: PostsPaginationMeta
}

export interface GetPostsParams {
  page?: number
  pageSize?: number
  keyword?: string
}
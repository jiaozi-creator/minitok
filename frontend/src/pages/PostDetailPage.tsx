import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LikeButton from '../components/LikeButton'
import { commentService } from '../services/comment.service'
import { postService } from '../services/post.service'
import { useAuthStore } from '../store/auth.store'
import type { PostDetail } from '../types/post'

export default function PostDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const postId = Number(id)

  const { isAuthenticated, user } = useAuthStore()

  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  )
  const [deletingPost, setDeletingPost] = useState(false)

  const fetchPostDetail = async () => {
    try {
      const data = await postService.getPostDetail(postId)
      setPost(data)
      setError('')
    } catch (err: any) {
      setError(err?.response?.data?.message || '获取帖子详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!postId || Number.isNaN(postId)) {
      setLoading(false)
      setError('帖子 ID 无效')
      return
    }

    fetchPostDetail()
  }, [postId])

  const handleDeletePost = async () => {
    if (!post) return

    const confirmed = window.confirm('确定要删除这篇帖子吗？')
    if (!confirmed) return

    setDeletingPost(true)

    try {
      await postService.deletePost(post.id)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || '删除帖子失败')
    } finally {
      setDeletingPost(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!commentContent.trim()) return

    setSubmitting(true)

    try {
      await commentService.createComment(postId, {
        content: commentContent.trim(),
      })
      setCommentContent('')
      await fetchPostDetail()
    } catch (err: any) {
      setError(err?.response?.data?.message || '发表评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    setDeletingCommentId(commentId)

    try {
      await commentService.deleteComment(commentId)
      await fetchPostDetail()
    } catch (err: any) {
      setError(err?.response?.data?.message || '删除评论失败')
    } finally {
      setDeletingCommentId(null)
    }
  }

  if (loading) {
    return <div className="px-6 py-10 text-gray-500">正在加载帖子详情...</div>
  }

  if (error && !post) {
    return <div className="px-6 py-10 text-red-600">{error}</div>
  }

  if (!post) {
    return <div className="px-6 py-10 text-gray-500">帖子不存在</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-black">
          ← 返回首页
        </Link>
      </div>

      <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

          {user?.id === post.authorId && (
            <button
              onClick={handleDeletePost}
              disabled={deletingPost}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {deletingPost ? '删除中...' : '删除帖子'}
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span>作者：{post.author.username}</span>
          <span>评论 {post._count.comments}</span>
          <LikeButton
            postId={post.id}
            initialLikesCount={post._count.likes}
          />
        </div>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="mt-6 h-72 w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-6 whitespace-pre-wrap text-base leading-7 text-gray-700">
          {post.content}
        </div>
      </article>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">评论区</h2>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {isAuthenticated ? (
          <form className="mt-4 space-y-3" onSubmit={handleSubmitComment}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={4}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="写下你的评论..."
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-60"
            >
              {submitting ? '提交中...' : '发表评论'}
            </button>
          </form>
        ) : (
          <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            请先登录后再发表评论。
          </div>
        )}

        <div className="mt-6 space-y-4">
          {post.comments.length === 0 ? (
            <div className="text-sm text-gray-500">
              还没有评论，来发表第一条吧。
            </div>
          ) : (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-gray-100 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {comment.user.username}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {user?.id === comment.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deletingCommentId === comment.id}
                      className="text-sm text-red-500 hover:text-red-600 disabled:opacity-60"
                    >
                      {deletingCommentId === comment.id
                        ? '删除中...'
                        : '删除'}
                    </button>
                  )}
                </div>

                <div className="mt-3 whitespace-pre-wrap text-gray-700">
                  {comment.content}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
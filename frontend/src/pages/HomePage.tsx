import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LikeButton from '../components/LikeButton'
import { postService } from '../services/post.service'
import { useAuthStore } from '../store/auth.store'
import type { PostItem } from '../types/post'

export default function HomePage() {
  const user = useAuthStore((state) => state.user)

  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts()
        setPosts(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || '获取帖子列表失败')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleDeletePost = async (postId: number) => {
    const confirmed = window.confirm('确定要删除这篇帖子吗？')
    if (!confirmed) return

    setDeletingId(postId)

    try {
      await postService.deletePost(postId)
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    } catch (err: any) {
      alert(err?.response?.data?.message || '删除帖子失败')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="px-6 py-10 text-gray-500">正在加载帖子...</div>
  }

  if (error) {
    return <div className="px-6 py-10 text-red-600">{error}</div>
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">首页 Feed</h1>
        <p className="mt-2 text-sm text-gray-500">
          这里展示最新发布的帖子内容
        </p>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-500 shadow-sm ring-1 ring-gray-100">
            还没有帖子，快去发布第一篇吧。
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-xl font-semibold text-gray-900 hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    作者：{post.author.username}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/posts/${post.id}`}
                    className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    查看详情
                  </Link>

                  {user?.id === post.authorId && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingId === post.id}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingId === post.id ? '删除中...' : '删除'}
                    </button>
                  )}
                </div>
              </div>

              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="mt-4 h-56 w-full rounded-xl object-cover"
                />
              )}

              <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-gray-700">
                {post.content}
              </p>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>评论 {post._count.comments}</span>
                <LikeButton
                  postId={post.id}
                  initialLikesCount={post._count.likes}
                />
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
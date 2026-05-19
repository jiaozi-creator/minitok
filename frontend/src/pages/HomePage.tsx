import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LikeButton from '../components/LikeButton'
import { useDebounce } from '../hooks/useDebounce'
import { postService } from '../services/post.service'
import { useAuthStore } from '../store/auth.store'
import type { PostItem } from '../types/post'

const PAGE_SIZE = 6

export default function HomePage() {
  const user = useAuthStore((state) => state.user)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const [posts, setPosts] = useState<PostItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [searchText, setSearchText] = useState('')
  const debouncedKeyword = useDebounce(searchText.trim(), 500)

  const fetchPosts = useCallback(
    async (targetPage: number, reset = false) => {
      if (reset) {
        setLoadingInitial(true)
      } else {
        setLoadingMore(true)
      }

      setError('')

      try {
        const result = await postService.getPosts({
          page: targetPage,
          pageSize: PAGE_SIZE,
          keyword: debouncedKeyword || undefined,
        })

        setPosts((prev) => {
          if (reset) {
            return result.items
          }

          const existedIds = new Set(prev.map((post) => post.id))
          const nextItems = result.items.filter(
            (post) => !existedIds.has(post.id),
          )

          return [...prev, ...nextItems]
        })

        setPage(result.meta.page)
        setHasMore(result.meta.hasNextPage)
      } catch (err: any) {
        setError(err?.response?.data?.message || '获取帖子列表失败')
      } finally {
        setLoadingInitial(false)
        setLoadingMore(false)
      }
    },
    [debouncedKeyword],
  )

  useEffect(() => {
    fetchPosts(1, true)
  }, [fetchPosts])

  useEffect(() => {
    if (loadingInitial || loadingMore || !hasMore) return

    const node = loadMoreRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]

        if (firstEntry.isIntersecting) {
          fetchPosts(page + 1)
        }
      },
      {
        rootMargin: '200px',
      },
    )

    observer.observe(node)

    return () => {
      observer.unobserve(node)
    }
  }, [fetchPosts, hasMore, loadingInitial, loadingMore, page])

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

  const handleClearSearch = () => {
    setSearchText('')
  }

  if (loadingInitial) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mb-6 h-12 w-full animate-pulse rounded-2xl bg-gray-100" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-4 w-32 animate-pulse rounded bg-gray-100" />
              <div className="mt-4 h-56 w-full animate-pulse rounded-xl bg-gray-100" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && posts.length === 0) {
    return <div className="px-6 py-10 text-red-600">{error}</div>
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">首页 Feed</h1>
        <p className="mt-2 text-sm text-gray-500">
          支持关键词搜索、分页加载和无限滚动
        </p>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          搜索帖子
        </label>

        <div className="flex items-center gap-3">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
            placeholder="搜索标题或正文，例如：摄影、穿搭、旅行"
          />

          {searchText && (
            <button
              onClick={handleClearSearch}
              className="shrink-0 rounded-xl border px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
            >
              清空
            </button>
          )}
        </div>

        {debouncedKeyword && (
          <p className="mt-3 text-sm text-gray-500">
            当前搜索：
            <span className="font-medium text-gray-900">
              {debouncedKeyword}
            </span>
          </p>
        )}
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-gray-500 shadow-sm ring-1 ring-gray-100">
            {debouncedKeyword
              ? '没有找到相关帖子，试试其他关键词。'
              : '还没有帖子，快去发布第一篇吧。'}
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
                  loading="lazy"
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

      {error && posts.length > 0 && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div ref={loadMoreRef} className="h-10" />

      {loadingMore && (
        <div className="mt-6 text-center text-sm text-gray-500">
          正在加载更多...
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-400">
          已经到底啦
        </div>
      )}
    </div>
  )
}
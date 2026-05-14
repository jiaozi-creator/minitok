import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { likeService } from '../services/like.service'
import { useAuthStore } from '../store/auth.store'

interface LikeButtonProps {
  postId: number
  initialLikesCount: number
}

export default function LikeButton({
  postId,
  initialLikesCount,
}: LikeButtonProps) {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLikesCount(initialLikesCount)
  }, [initialLikesCount])

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!isAuthenticated) return

      try {
        const result = await likeService.getLikeStatus(postId)
        setLiked(result.liked)
        setLikesCount(result.likesCount)
      } catch {
        // 获取点赞状态失败不影响页面主流程
      }
    }

    fetchLikeStatus()
  }, [postId, isAuthenticated])

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (loading) return

    setLoading(true)

    try {
      const result = liked
        ? await likeService.unlikePost(postId)
        : await likeService.likePost(postId)

      setLiked(result.liked)
      setLikesCount(result.likesCount)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        liked
          ? 'rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-60'
          : 'rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60'
      }
    >
      {liked ? '已点赞' : '点赞'} {likesCount}
    </button>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services/post.service'

export default function CreatePostPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    content: '',
    coverImage: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await postService.createPost({
        title: form.title,
        content: form.content,
        coverImage: form.coverImage || undefined,
      })
      navigate('/')
    } catch (err: any) {
      setError(
        err?.response?.data?.message || '发布帖子失败',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">发布帖子</h1>
        <p className="mt-2 text-sm text-gray-500">
          先完成图文发布流程，后面我们再补图片上传功能
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              标题
            </label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="请输入标题"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              封面图链接
            </label>
            <input
              name="coverImage"
              type="text"
              value={form.coverImage}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="先填图片 URL，后面再做上传功能"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              正文
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={8}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="请输入正文内容"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-60"
          >
            {loading ? '发布中...' : '发布帖子'}
          </button>
        </form>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services/post.service'
import { uploadService } from '../services/upload.service'

export default function CreatePostPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    content: '',
    coverImage: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let coverImage = form.coverImage || undefined

      if (selectedFile) {
        const uploaded = await uploadService.uploadImage(selectedFile)
        coverImage = uploaded.url
      }

      await postService.createPost({
        title: form.title,
        content: form.content,
        coverImage,
      })

      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message || '发布帖子失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">发布帖子</h1>
        <p className="mt-2 text-sm text-gray-500">
          现在支持本地图片上传，后续可以切换到云存储
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
              上传封面图
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border px-4 py-3"
            />

            {previewUrl && (
              <img
                src={previewUrl}
                alt="预览图"
                className="mt-4 h-64 w-full rounded-xl object-cover"
              />
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              或填写封面图链接
            </label>
            <input
              name="coverImage"
              type="text"
              value={form.coverImage}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="如果已上传本地图片，这里可以不填"
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
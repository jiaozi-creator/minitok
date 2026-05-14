import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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
      await authService.register(form)
      const result = await authService.login({
        email: form.email,
        password: form.password,
      })
      setAuth(result.accessToken, result.user)
      navigate('/')
    } catch (err: any) {
      setError(
        err?.response?.data?.message || '注册失败，请稍后重试',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">注册</h1>
        <p className="mt-2 text-sm text-gray-500">
          创建账号后即可开始体验 MiniTok
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="请输入邮箱"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="至少 6 位密码"
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
            className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-60"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          已有账号？{' '}
          <Link to="/login" className="font-medium text-black">
            去登录
          </Link>
        </p>
      </div>
    </div>
  )
}
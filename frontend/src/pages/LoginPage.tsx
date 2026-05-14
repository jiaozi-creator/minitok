import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({
    email: '',
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
      const result = await authService.login(form)
      setAuth(result.accessToken, result.user)
      navigate('/')
    } catch (err: any) {
      setError(
        err?.response?.data?.message || '登录失败，请检查账号密码',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">登录</h1>
        <p className="mt-2 text-sm text-gray-500">
          登录后可以发布内容和管理自己的帖子
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
              密码
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              placeholder="请输入密码"
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
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          还没有账号？{' '}
          <Link to="/register" className="font-medium text-black">
            去注册
          </Link>
        </p>
      </div>
    </div>
  )
}
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-gray-900">
          MiniTok
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-black' : 'text-gray-600'
            }
          >
            首页
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/create"
              className={({ isActive }) =>
                isActive ? 'font-semibold text-black' : 'text-gray-600'
              }
            >
              发帖
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'font-semibold text-black' : 'text-gray-600'
                }
              >
                登录
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? 'font-semibold text-black' : 'text-gray-600'
                }
              >
                注册
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-gray-700">
                你好，{user?.username ?? '用户'}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border px-3 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                退出
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
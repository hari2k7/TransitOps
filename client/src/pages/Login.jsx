import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
import { ROLES } from '../utils/roles.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: ROLES[0].id,
    remember: false,
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (e) => {
    const value = field === 'remember' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login({
        email: form.email,
        password: form.password,
        roleId: form.role,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-zinc-100">
        Sign in to your account
      </h1>
      <p className="mt-1.5 text-sm text-zinc-500">
        Enter your credentials to continue
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@transitops.io"
          value={form.email}
          onChange={handleChange('email')}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange('password')}
          required
        />

        <Select label="Role" value={form.role} onChange={handleChange('role')}>
          {ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              {role.label}
            </option>
          ))}
        </Select>

        {error && <Alert title="Sign in failed">{error}</Alert>}

        <div className="flex items-center justify-between pt-1 text-sm">
          <label className="flex items-center gap-2 text-zinc-400">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={handleChange('remember')}
              className="h-3.5 w-3.5 rounded border-border-subtle bg-surface-raised accent-amber-600"
            />
            Remember me
          </label>
          <a href="#" className="text-zinc-400 hover:text-zinc-200">
            Forgot password?
          </a>
        </div>

        <Button type="submit" disabled={submitting} className="mt-2 w-full">
          {submitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </AuthLayout>
  )
}

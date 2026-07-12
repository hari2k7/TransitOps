import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
import * as authService from '../services/authService.js'
import { useConnectionStatus, CONNECTION_MESSAGES } from '../hooks/useConnectionStatus.js'

// Mirrors server/src/validations/auth.validation.js so the user sees a
// clear message before submitting rather than a generic 400 back.
function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(password)) return 'Password must contain one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must contain one lowercase letter.'
  if (!/[0-9]/.test(password)) return 'Password must contain one number.'
  if (!/[!@#$%^&*]/.test(password)) return 'Password must contain one special character (!@#$%^&*).'
  return null
}

export default function Register() {
  const navigate = useNavigate()

  const [roles, setRoles] = useState([])
  const [rolesError, setRolesError] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { status: connectionStatus } = useConnectionStatus()
  const isOffline = connectionStatus === 'offline' || connectionStatus === 'server-unreachable'

  // Role list is DB-backed (GET /api/auth/roles) rather than hardcoded, so
  // it can't drift from whatever's actually seeded in the roles table.
  useEffect(() => {
    authService
      .getRoles()
      .then((data) => {
        setRoles(data)
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, roleId: String(data[0].id) }))
        }
      })
      .catch(() => setRolesError('Could not load roles from the server.'))
  }, [])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const passwordIssue = validatePassword(form.password)
    if (passwordIssue) {
      setError(passwordIssue)
      return
    }

    if (!form.roleId) {
      setError('Select a role.')
      return
    }

    setSubmitting(true)
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        password: form.password,
        roleId: Number(form.roleId),
      })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-zinc-100">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-zinc-500">
        Register to get access to TransitOps
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          value={form.name}
          onChange={handleChange('name')}
          required
        />

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

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          required
        />

        <Select label="Role" value={form.roleId} onChange={handleChange('roleId')} required>
          {roles.length === 0 && <option value="">Loading roles…</option>}
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.role_name}
            </option>
          ))}
        </Select>

        {isOffline && (
          <Alert title={CONNECTION_MESSAGES[connectionStatus].title}>
            {CONNECTION_MESSAGES[connectionStatus].message}
          </Alert>
        )}

        {!isOffline && rolesError && <Alert title="Heads up">{rolesError}</Alert>}
        {!isOffline && error && <Alert title="Registration failed">{error}</Alert>}

        <Button type="submit" disabled={submitting || isOffline} className="mt-2 w-full">
          {submitting ? 'Creating account…' : 'Create Account'}
        </Button>

        <p className="pt-1 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

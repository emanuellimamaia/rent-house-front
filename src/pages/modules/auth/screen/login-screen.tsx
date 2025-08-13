import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { authService } from '../service/auth.service'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Digite um email válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, location])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      const response = await authService.login(data)

      login(
        {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role,
        },
        response.token
      )

      toast.success('Login realizado com sucesso!')

      // Redireciona para a página original ou dashboard
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch {
      toast.error('Erro interno. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6 rounded-2xl border border-purple-100 bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-3xl text-purple-700">Bem-vindo</h1>
            <p className="text-gray-600 text-sm">Faça login para continuar</p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <label
                className="block font-medium text-purple-700 text-sm"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                {...register('email')}
                autoComplete="email"
                className={`h-12 transition-all duration-200 ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                    : 'border-purple-200 focus:border-purple-500 focus:ring-purple-200'
                }`}
                id="email"
                placeholder="seu@email.com"
                type="email"
              />
              {errors.email && (
                <span className="mt-1 flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="block font-medium text-purple-700 text-sm"
                htmlFor="password"
              >
                Senha
              </label>
              <Input
                {...register('password')}
                autoComplete="current-password"
                className={`h-12 transition-all duration-200 ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                    : 'border-purple-200 focus:border-purple-500 focus:ring-purple-200'
                }`}
                id="password"
                placeholder="••••••••"
                type="password"
              />
              {errors.password && (
                <span className="mt-1 flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              className="mt-2 h-12 transform bg-purple-600 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-purple-700 active:scale-[0.98]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Não tem uma conta?{' '}
              <button
                className="font-medium text-purple-600 transition-colors hover:text-purple-700"
                type="button"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

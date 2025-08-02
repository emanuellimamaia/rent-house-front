import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
      // Aqui você faria a chamada para a API de login
      // Simular uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert(`Login realizado com sucesso para: ${data.email}`)
    } catch {
      alert('Erro interno. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="flex h-fit w-fit flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
        <h2 className="text-center font-bold text-2xl text-purple-700">
          Faça seu login
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-purple-700" htmlFor="email">
              Email:
            </label>
            <Input
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
              type="email"
            />
            {errors.email && (
              <span className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-purple-700" htmlFor="password">
              Senha:
            </label>
            <Input
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
              type="password"
            />
            {errors.password && (
              <span className="mt-1 text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <Button
            className="hover:bg-purple-700 hover:text-white"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}

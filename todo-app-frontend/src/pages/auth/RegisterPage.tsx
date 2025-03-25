import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '@/services/auth.service';

const registerSchema = z.object({
  name: z.string().min(2, 'Imię musi zawierać co najmniej 2 znaki').optional(),
  email: z.string().email('Wymagany jest prawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi zawierać co najmniej 6 znaków'),
  confirmPassword: z.string().min(6, 'Potwierdź swoje hasło'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są zgodne",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setRegisterError(null);
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/login', { state: { message: 'Rejestracja przebiegła pomyślnie. Możesz się teraz zalogować.' } });
    } catch (error: any) {
      setRegisterError(
        error.response?.data?.message || 'Wystąpił błąd podczas rejestracji'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Rejestracja</h1>

        {registerError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {registerError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Imię (opcjonalnie)
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="form-input"
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="form-input"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="form-input"
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
              Potwierdź hasło
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="form-input"
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary"
          >
            {isSubmitting ? 'Rejestracja...' : 'Zarejestruj się'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Masz już konto?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
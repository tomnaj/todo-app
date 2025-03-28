import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Wymagany jest prawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi zawierać co najmniej 6 znaków'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    shouldFocusError: false,
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    setLoading(true);
  
    try {
      await login(data);
      

      setTimeout(() => {
        navigate('/tasks');
      }, 100);
    } catch (error: any) {
      console.error('Login error:', error);
  
      let errorMessage = 'Nieprawidłowy email lub hasło';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 403 || (error.data && error.data.code === 403)) {
        errorMessage = 'Brak uprawnień. Skontaktuj się z administratorem.';
      }
      
      setLoginError(errorMessage);
  
      if (error.response?.data?.field === 'email') {
        setError('email', { type: 'server', message: 'Nieprawidłowy adres email' });
      } else if (error.response?.data?.field === 'password') {
        setError('password', { type: 'server', message: 'Nieprawidłowe hasło' });
      }
  
      setTimeout(() => setLoginError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Logowanie</h1>

        {loginError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {loginError}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e).catch((err) =>
            console.error('Unhandled form submission error:', err)
          );
        }}>
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
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="form-input"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Nie masz konta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

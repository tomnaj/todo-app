import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import taskService, { TaskStatus } from '@/services/task.service';

const taskSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const TaskFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: TaskStatus.TODO,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchTask = async () => {
        try {
          setLoading(true);
          const task = await taskService.getTask(parseInt(id));
          reset({
            title: task.title,
            description: task.description,
            status: task.status,
          });
          setError(null);
        } catch (err) {
          setError('Nie można załadować zadania. Sprawdź, czy istnieje.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }
  }, [id, isEditMode, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEditMode) {
        await taskService.updateTask(parseInt(id), data);
      } else {
        await taskService.createTask(data);
      }
      navigate('/tasks');
    } catch (err) {
      setError('Wystąpił błąd podczas zapisywania zadania');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">
                {isEditMode ? 'Edytuj zadanie' : 'Dodaj nowe zadanie'}
              </h1>
            </div>
            <div className="flex items-center">
              <Link to="/tasks" className="text-sm text-gray-600 hover:text-gray-900">
                Powrót do listy
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-8">Ładowanie zadania...</div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2 text-sm font-medium">
                  Tytuł *
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title')}
                  className="form-input"
                />
                {errors.title && (
                  <p className="error-message">{errors.title.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block mb-2 text-sm font-medium">
                  Opis
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className="form-input"
                />
                {errors.description && (
                  <p className="error-message">{errors.description.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="status" className="block mb-2 text-sm font-medium">
                  Status
                </label>
                <select id="status" {...register('status')} className="form-input">
                  {Object.values(TaskStatus).map((status) => (
                    <option key={status} value={status}>
                      {status === TaskStatus.TODO
                        ? 'Do zrobienia'
                        : status === TaskStatus.IN_PROGRESS
                        ? 'W trakcie'
                        : 'Ukończone'}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="error-message">{errors.status.message}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting
                    ? 'Zapisywanie...'
                    : isEditMode
                    ? 'Zapisz zmiany'
                    : 'Dodaj zadanie'}
                </button>
                <Link to="/tasks" className="btn btn-secondary">
                  Anuluj
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskFormPage;
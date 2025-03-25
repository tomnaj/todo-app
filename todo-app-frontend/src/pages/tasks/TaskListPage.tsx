import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiEdit, FiTrash2, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import taskService, { Task, TaskStatus } from '@/services/task.service';
import authService from '@/services/auth.service';

const TaskListPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania zadań');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      await taskService.updateTask(task.id, { status: newStatus });
      loadTasks(); // Załaduj zadania ponownie aby zaktualizować listę
    } catch (err) {
      setError('Wystąpił błąd podczas aktualizacji statusu zadania');
      console.error(err);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err) {
        setError('Wystąpił błąd podczas usuwania zadania');
        console.error(err);
      }
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <FiCheckCircle className="text-green-500" />;
      case TaskStatus.IN_PROGRESS:
        return <FiClock className="text-yellow-500" />;
      case TaskStatus.TODO:
      default:
        return <FiCircle className="text-gray-400" />;
    }
  };

  const user = authService.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Lista Zadań</h1>
            </div>
            <div className="flex items-center">
              {user && (
                <span className="mr-4 text-sm text-gray-600">
                  Zalogowano jako: {user.name || user.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Twoje zadania</h2>
          <Link to="/tasks/new" className="btn btn-primary flex items-center">
            <FiPlusCircle className="mr-2" />
            Dodaj zadanie
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Ładowanie zadań...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">Nie masz jeszcze żadnych zadań.</p>
            <Link to="/tasks/new" className="mt-4 inline-block text-blue-500 hover:underline">
              Dodaj swoje pierwsze zadanie
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          const nextStatus = 
                            task.status === TaskStatus.TODO 
                              ? TaskStatus.IN_PROGRESS 
                              : task.status === TaskStatus.IN_PROGRESS 
                                ? TaskStatus.DONE 
                                : TaskStatus.TODO;
                          handleStatusChange(task, nextStatus);
                        }}
                        className="mr-3"
                        title="Zmień status zadania"
                      >
                        {getStatusIcon(task.status)}
                      </button>
                      <div>
                        <h3 className="text-lg font-medium">
                          <Link to={`/tasks/${task.id}`} className="hover:text-blue-600">
                            {task.title}
                          </Link>
                        </h3>
                        {task.description && (
                          <p className="text-gray-500 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/tasks/${task.id}/edit`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                        title="Edytuj zadanie"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        title="Usuń zadanie"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskListPage;
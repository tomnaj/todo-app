import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import taskService, { Task, TaskStatus } from '@/services/task.service';

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await taskService.getTask(parseInt(id!));
        setTask(data);
        setError(null);
      } catch (err) {
        setError('Nie można załadować zadania. Sprawdź, czy istnieje.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      try {
        await taskService.deleteTask(parseInt(id!));
        navigate('/tasks');
      } catch (err) {
        setError('Wystąpił błąd podczas usuwania zadania');
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      if (task) {
        const updatedTask = await taskService.updateTask(task.id, { status: newStatus });
        setTask(updatedTask);
      }
    } catch (err) {
      setError('Wystąpił błąd podczas aktualizacji statusu zadania');
      console.error(err);
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return 'Ukończone';
      case TaskStatus.IN_PROGRESS:
        return 'W trakcie';
      case TaskStatus.TODO:
      default:
        return 'Do zrobienia';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL') + ' ' + date.toLocaleTimeString('pl-PL');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Szczegóły zadania</h1>
            </div>
            <div className="flex items-center">
              <Link to="/tasks" className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                <FiArrowLeft className="mr-1" /> Powrót do listy
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-8">Ładowanie zadania...</div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
            <div className="mt-4">
              <Link to="/tasks" className="text-blue-500 hover:underline">
                Powrót do listy zadań
              </Link>
            </div>
          </div>
        ) : task ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{task.title}</h2>
              <div className="flex space-x-2">
                <Link
                  to={`/tasks/${task.id}/edit`}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                  title="Edytuj zadanie"
                >
                  <FiEdit />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  title="Usuń zadanie"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 mr-2">Status:</span>
              <div className="flex items-center">
                {getStatusIcon(task.status)}
                <span className="ml-1">{getStatusText(task.status)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Zmień status</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusChange(TaskStatus.TODO)}
                  className={`px-3 py-1 rounded-md flex items-center ${
                    task.status === TaskStatus.TODO
                      ? 'bg-gray-200 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <FiCircle className="mr-1" /> Do zrobienia
                </button>
                <button
                  onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
                  className={`px-3 py-1 rounded-md flex items-center ${
                    task.status === TaskStatus.IN_PROGRESS
                      ? 'bg-yellow-100 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <FiClock className="mr-1 text-yellow-500" /> W trakcie
                </button>
                <button
                  onClick={() => handleStatusChange(TaskStatus.DONE)}
                  className={`px-3 py-1 rounded-md flex items-center ${
                    task.status === TaskStatus.DONE
                      ? 'bg-green-100 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <FiCheckCircle className="mr-1 text-green-500" /> Ukończone
                </button>
              </div>
            </div>

            {task.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Opis:</h3>
                <div className="text-gray-700 whitespace-pre-line">{task.description}</div>
              </div>
            )}

            <div className="border-t pt-4 flex flex-col space-y-2 text-sm text-gray-500">
              <p>Utworzono: {formatDate(task.createdAt)}</p>
              <p>Zaktualizowano: {formatDate(task.updatedAt)}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Nie znaleziono zadania.</p>
            <div className="mt-4">
              <Link to="/tasks" className="text-blue-500 hover:underline">
                Powrót do listy zadań
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskDetailPage;
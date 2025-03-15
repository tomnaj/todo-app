import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Task } from './types';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError('Nie udało się załadować zadań');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleAddTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      setIsLoading(true);
      const newTask = await createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setError(null);
    } catch (err) {
      setError('Nie udało się dodać zadania');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: Task) => {
    try {
      console.log('Aktualizacja zadania:', taskData); 
      setIsLoading(true);
      const updatedTask = await updateTask(taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      setEditingTask(null);
      setError(null);
    } catch (err) {
      console.error('Błąd aktualizacji:', err);
      setError('Nie udało się zaktualizować zadania');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      setError('Nie udało się usunąć zadania');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    await handleUpdateTask(updatedTask);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div className="w-full h-full bg-white">
        <div className="container mx-auto p-4">
          <div className="text-center mb-8 pt-4">
            <h1 className="text-3xl font-bold text-gray-800">Lista zadań</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <TaskForm
            onSubmit={(data) => {
              if (editingTask) {
                handleUpdateTask(data as Task);
              } else {
                handleAddTask(data as Omit<Task, 'id'>);
              }
            }}
            initialValues={editingTask || undefined}
            isEditing={!!editingTask}
            onCancel={editingTask ? () => setEditingTask(null) : undefined}
          />

          <div className="mt-8">
            {isLoading && !tasks.length ? (
              <div className="text-center text-gray-500">Ładowanie zadań...</div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            )}

            {!isLoading && !tasks.length && (
              <div className="text-center text-gray-500">Brak zadań do wyświetlenia</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
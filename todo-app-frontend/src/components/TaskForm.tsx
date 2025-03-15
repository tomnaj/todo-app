import { useForm } from 'react-hook-form';
import { Task } from '../types/index';

interface TaskFormProps {
  onSubmit: (data: Task | Omit<Task, 'id'>) => void;
  initialValues?: Task;
  isEditing?: boolean;
  onCancel?: () => void;
}

const TaskForm = ({ onSubmit, initialValues, isEditing, onCancel }: TaskFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Task>({
    defaultValues: initialValues || {
      title: '',
      description: '',
      isCompleted: false
    }
  });

  const submitHandler = (data: any) => {
    if (isEditing && initialValues?.id) {
      onSubmit({
        ...data,
        id: initialValues.id
      });
    } else {
      onSubmit(data);
    }
    
    if (!isEditing) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Tytuł
        </label>
        <input
          type="text"
          id="title"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Wpisz tytuł zadania"
          {...register('title', { required: 'Tytuł jest wymagany' })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Opis
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Wpisz opis zadania (opcjonalnie)"
          {...register('description')}
        />
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Zapisz zmiany' : 'Dodaj zadanie'}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Anuluj
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
import { Task } from '../types/index';

interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) => {
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${task.isCompleted ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={onToggleComplete}
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <h3 className={`text-lg font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-800 p-1"
          >
            Edytuj
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 p-1"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
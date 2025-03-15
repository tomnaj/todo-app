import axios from 'axios';
import { Task } from '../types/index';

const API_BASE_URL = 'http://localhost:3000/tasks';

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
  const response = await axios.post(API_BASE_URL, taskData);
  return response.data;
};

export const updateTask = async (taskData: Task): Promise<Task> => {
  console.log('Wysyłanie aktualizacji do API:', taskData.id, taskData);
  
  if (!taskData.id) {
    throw new Error('Brak ID zadania do aktualizacji');
  }
  
  const response = await axios.put(`${API_BASE_URL}/${taskData.id}`, taskData);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
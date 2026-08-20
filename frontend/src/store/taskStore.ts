import { create } from 'zustand';

export type Task = {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
    assignee: string | null;
    tags: string[];
    projectId?: string;
    parentTaskId?: string;
    createdAt: string;
};

type TaskState = {
    tasks: Task[];
    loadTasks: () => Promise<void>;
    createTask: (data: Partial<Task>) => Promise<void>;
    updateTask: (id: string, data: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
};

const API_URL = 'http://localhost:3001/tasks';

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    loadTasks: async () => {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const data = await res.json();
                set({ tasks: data });
            }
        } catch (e) {
            console.error(e);
        }
    },
    createTask: async (data) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                get().loadTasks();
            }
        } catch (e) {
            console.error(e);
        }
    },
    updateTask: async (id, data) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                get().loadTasks();
            }
        } catch (e) {
            console.error(e);
        }
    },
    deleteTask: async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                get().loadTasks();
            }
        } catch (e) {
            console.error(e);
        }
    }
}));

import { create } from 'zustand';

export type Project = {
    id: string;
    title: string;
    priority: string;
    lead: string | null;
    dueDate: string | null;
    createdAt: string;
};

type ProjectState = {
    projects: Project[];
    loadProjects: () => Promise<void>;
    createProject: (data: Partial<Project>) => Promise<void>;
    updateProject: (id: string, data: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
};

const API_URL = 'http://localhost:3001/projects';

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    loadProjects: async () => {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const data = await res.json();
                set({ projects: data });
            }
        } catch (e) {
            console.error(e);
        }
    },
    createProject: async (data) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                get().loadProjects();
            }
        } catch (e) {
            console.error(e);
        }
    },
    updateProject: async (id, data) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                get().loadProjects();
            }
        } catch (e) {
            console.error(e);
        }
    },
    deleteProject: async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                get().loadProjects();
            }
        } catch (e) {
            console.error(e);
        }
    }
}));

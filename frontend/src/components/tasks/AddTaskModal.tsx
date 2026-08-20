'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { X, Calendar } from 'lucide-react';

export function AddTaskModal({ onClose, defaultStatus = 'To Do', projectId, parentTaskId }: { onClose: () => void, defaultStatus?: string, projectId?: string, parentTaskId?: string }) {
    const { createTask } = useTaskStore();
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [status, setStatus] = useState(defaultStatus);
    const [dueDate, setDueDate] = useState('');
    const [tagsInput, setTagsInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        await createTask({
            title,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            assignee: 'Dexter',
            tags: tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
            projectId: projectId || undefined,
            parentTaskId: parentTaskId || undefined
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-border">
                <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-muted">
                    <h3 className="font-bold text-foreground">Create New Task</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Task Title</label>
                        <input
                            autoFocus
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Write API Documentation"
                            className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-primary focus:ring-[#111827]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Status</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-primary focus:ring-[#111827]"
                            >
                                <option value="To Do">To Do</option>
                                <option value="Doing">Doing</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Priority</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-primary focus:ring-[#111827]"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-primary focus:ring-[#111827]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-1">Labels (comma separated)</label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={e => setTagsInput(e.target.value)}
                                placeholder="e.g. Design, Frontend"
                                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-primary focus:ring-[#111827]"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2 border-t border-border mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-border rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary rounded-lg text-sm font-semibold text-primary-foreground hover:bg-black transition-colors"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

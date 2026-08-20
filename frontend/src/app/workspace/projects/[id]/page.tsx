'use client';

import { useState, useEffect, use } from 'react';
import { Search, Columns3, Filter, Plus, ChevronDown, MoreHorizontal, PanelLeft } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';

function PriorityIcon({ level }: { level: string }) {
    const bars = level === 'Low' ? 1 : level === 'Medium' ? 2 : level === 'High' ? 3 : 4;
    const color = level === 'Low' ? 'bg-gray-400' : level === 'Medium' ? 'bg-orange-400' : 'bg-red-500';

    return (
        <div className="flex gap-[2px] items-end h-3 mb-0.5">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-[2px] rounded-[1px] ${i <= bars ? color : 'bg-gray-200'} ${i === 1 ? 'h-1' : i === 2 ? 'h-1.5' : i === 3 ? 'h-2' : 'h-3'}`} />
            ))}
        </div>
    );
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [modalStatus, setModalStatus] = useState<string | null>(null);
    const { tasks, loadTasks, createTask } = useTaskStore();
    const { projects, loadProjects } = useProjectStore();

    useEffect(() => {
        loadTasks();
        loadProjects();
    }, [loadTasks, loadProjects]);

    const project = projects.find((p: any) => p.id === projectId);
    const projectTasks = tasks.filter((t: any) => t.projectId === projectId);

    const toggleSection = (section: string) => {
        setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Top Navigation Breadcrumb */}
            <div className="flex items-center gap-4 py-3 px-4 border-b border-border bg-card">
                <PanelLeft className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                <div className="h-4 border-r border-border"></div>
                <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                    <span onClick={() => window.location.href = '/workspace'} className="hover:text-foreground cursor-pointer">Projects</span>
                    <span className="text-gray-300">&gt;</span>
                    <span className="font-semibold text-foreground">{project ? project.title : 'Loading...'}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 hide-scrollbar">
                {/* Top Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[20px] font-extrabold text-foreground">Tasks</h1>
                    <div className="flex gap-2.5 items-center">
                        <button className="w-8 h-8 border border-border rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                            <Search className="w-3.5 h-3.5" />
                        </button>

                        <button className="px-3 h-8 border border-border rounded-lg text-[13px] font-semibold text-foreground hover:bg-muted flex items-center gap-2 bg-card shadow-sm">
                            <Columns3 className="w-3.5 h-3.5 text-muted-foreground" /> Fields
                        </button>

                        <button className="w-8 h-8 border border-border rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>

                        <button onClick={() => setModalStatus('To Do')} className="px-3 h-8 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm ml-1">
                            <Plus className="w-3.5 h-3.5" /> Add Task
                        </button>
                    </div>
                </div>

                {/* Sections */}
                {['To Do', 'Doing', 'Completed'].map(status => (
                    <div key={status} className="mb-6">
                        <div
                            className="flex items-center gap-1.5 font-bold text-foreground text-[14px] mb-3 cursor-pointer select-none w-max"
                            onClick={() => toggleSection(status)}
                        >
                            <ChevronDown className={`w-4 h-4 text-foreground transition-transform ${collapsed[status] ? '-rotate-90' : ''}`} />
                            {status}
                        </div>

                        {!collapsed[status] && (
                            <div className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-muted bg-opacity-50 border-b border-border">
                                        <tr>
                                            <th className="px-4 py-2.5 font-semibold text-foreground text-[13px] w-[30%]">Task</th>
                                            <th className="px-4 py-2.5 font-semibold text-foreground text-[13px] w-[20%]">Priority</th>
                                            <th className="px-4 py-2.5 font-semibold text-foreground text-[13px] w-[20%]">Members</th>
                                            <th className="px-4 py-2.5 font-semibold text-foreground text-[13px] w-[20%]">Due Date</th>
                                            <th className="px-4 py-2.5 font-semibold text-foreground text-[13px] w-[10%] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectTasks.filter((t: any) => t.status === status).map((task: any, idx: number) => (
                                            <tr key={`${status}-${idx}`} className="border-b border-border hover:bg-muted group">
                                                <td className="px-4 py-3 text-[13px] font-semibold text-foreground">{task.title}</td>
                                                <td className="px-4 py-3">
                                                    <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-orange-500' : 'text-gray-400'}`}>
                                                        <PriorityIcon level={task.priority} /> {task.priority}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {task.assignee === 'A' ? (
                                                        <img src="https://i.pravatar.cc/150?u=proj1" className="w-[22px] h-[22px] rounded-full ring-1 ring-border shadow-sm" />
                                                    ) : task.assignee === 'CN' ? (
                                                        <div className="w-[22px] h-[22px] bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-[9px] font-bold ring-1 ring-border shadow-sm">CN</div>
                                                    ) : (
                                                        <div className="w-[22px] h-[22px] bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full flex items-center justify-center text-[12px] font-bold border border-gray-200 cursor-pointer shadow-sm">+</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-[13px] font-semibold text-muted-foreground">{task.dueDate || 'No Date'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <MoreHorizontal className="w-4 h-4 ml-auto text-muted-foreground opacity-20 group-hover:opacity-100 cursor-pointer" />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr onClick={() => createTask({ title: 'New Subtask', status, projectId, priority: 'Medium' })} className="cursor-pointer">
                                            <td colSpan={5} className="px-4 py-3 text-[13px] font-medium text-muted-foreground hover:bg-muted cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <Plus className="w-3.5 h-3.5 text-muted-foreground" /> Add Task
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {modalStatus && <AddTaskModal defaultStatus={modalStatus} projectId={projectId} onClose={() => setModalStatus(null)} />}
        </div>
    );
}

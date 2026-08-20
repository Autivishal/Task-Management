'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore, Task } from '@/store/taskStore';
import { useViewStore } from '@/store/viewStore';
import { MoreHorizontal, Plus, Trash2, Calendar, Tag } from "lucide-react";
import { AddTaskModal } from '../tasks/AddTaskModal';

const statuses = ['To Do', 'Doing', 'Completed', 'On Hold'];

export function ListView() {
    const { tasks, loadTasks, deleteTask } = useTaskStore();
    const { fields } = useViewStore();
    const [modalStatus, setModalStatus] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const showPriority = fields.find(f => f.name === 'Priority')?.checked;
    const showMembers = fields.find(f => f.name === 'Members')?.checked;
    const showDueDate = fields.find(f => f.name === 'Due Date')?.checked;
    const showLabels = fields.find(f => f.name === 'Labels')?.checked;
    const showStatus = fields.find(f => f.name === 'Status')?.checked;
    const showReporter = fields.find(f => f.name === 'Reporter')?.checked;

    return (
        <>
            <div className="w-full h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar space-y-6 pb-20">
                {statuses.map(status => {
                    const columnTasks = tasks.filter(t => t.status === status && !t.parentTaskId);

                    return (
                        <div key={status} className="w-full">
                            <div className="flex items-center gap-3 px-2 py-2 mb-2 group cursor-pointer hover:bg-muted rounded-lg transition-colors">
                                <span className="w-2 h-2 rounded-full border border-current opacity-70"></span>
                                <h3 className="font-bold text-foreground text-[15px] flex items-center gap-2">{status}</h3>
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-muted-foreground rounded-full font-semibold border border-gray-200">{columnTasks.length} items</span>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setModalStatus(status)}>
                                    <Plus className="w-5 h-5 text-muted-foreground hover:text-black" />
                                </div>
                            </div>

                            <div className="w-full border border-border rounded-xl bg-card overflow-hidden shadow-sm flex flex-col text-sm">
                                <div className="flex items-center px-4 py-3 border-b border-border bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <div className="w-[30%] shrink-0">Task Name</div>
                                    {showPriority && <div className="flex-[0.8] min-w-[100px]">Priority</div>}
                                    {showMembers && <div className="flex-1 min-w-[100px]">Members</div>}
                                    {showDueDate && <div className="flex-[1.2] min-w-[100px]">Due Date</div>}
                                    {showLabels && <div className="flex-1 min-w-[120px]">Labels</div>}
                                    {showStatus && <div className="flex-1 min-w-[100px]">Status</div>}
                                    {showReporter && <div className="flex-1 min-w-[100px]">Reporter</div>}
                                    <div className="w-[50px] shrink-0 text-right">Actions</div>
                                </div>

                                {columnTasks.map(task => {
                                    const dateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '-';
                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => router.push('/workspace/tasks/' + task.id)}
                                            className="flex items-center px-4 py-3 border-b border-border hover:bg-muted cursor-pointer text-sm group"
                                        >
                                            <div className="w-[30%] shrink-0 font-semibold flex gap-2 items-center text-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                {task.title}
                                            </div>

                                            {showPriority && (
                                                <div className="flex-[0.8] min-w-[100px] flex items-center gap-2 text-muted-foreground font-medium whitespace-nowrap">
                                                    <span className={`text-[10px] ${task.priority === 'High' || task.priority === 'Urgent' ? 'text-red-500' : task.priority === 'Medium' ? 'text-orange-400' : 'text-muted-foreground'}`}>●●●</span>
                                                    {task.priority || 'Medium'}
                                                </div>
                                            )}

                                            {showMembers && (
                                                <div className="flex-1 min-w-[100px]">
                                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white bg-gray-200" title={task.assignee || 'User'}>
                                                        <img src={"https://i.pravatar.cc/150?u=" + task.id} alt="Avatar" className="w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                            )}

                                            {showDueDate && (
                                                <div className="flex-[1.2] min-w-[100px] text-muted-foreground font-medium text-xs flex items-center gap-1.5 whitespace-nowrap">
                                                    {dateStr !== '-' && <Calendar className="w-3.5 h-3.5 text-muted-foreground" />} {dateStr}
                                                </div>
                                            )}

                                            {showLabels && (
                                                <div className="flex-1 min-w-[120px] flex gap-1 flex-wrap">
                                                    {task.tags && task.tags.map(t => (
                                                        <span key={t} className="px-2 py-0.5 text-[10px] bg-gray-100 text-muted-foreground rounded flex items-center gap-1 border border-gray-200 font-semibold">
                                                            <Tag className="w-3 h-3 text-muted-foreground" /> {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {showStatus && (
                                                <div className="flex-1 min-w-[100px] font-medium text-xs text-muted-foreground whitespace-nowrap">{task.status}</div>
                                            )}

                                            {showReporter && (
                                                <div className="flex-1 min-w-[100px] font-medium text-xs text-muted-foreground whitespace-nowrap">Dexter</div>
                                            )}

                                            <div className="w-[50px] shrink-0 flex justify-end">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                                    className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 transition-colors z-10 relative"
                                                >
                                                    <Trash2 className="w-4 h-4 ml-auto" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}

                                <div onClick={() => setModalStatus(status)} className="px-4 py-3 text-sm text-muted-foreground hover:bg-muted cursor-pointer flex items-center gap-2 font-medium">
                                    <Plus className="w-4 h-4 opacity-70" />
                                    <span>Add Task...</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {modalStatus && <AddTaskModal defaultStatus={modalStatus} onClose={() => setModalStatus(null)} />}
        </>
    );
}

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, Share2, MoreHorizontal, PanelRight, Tag, Paperclip, Calendar, ChevronDown, Plus, Settings, Smile, Send, Check, Trash2 } from 'lucide-react';

function PriorityIcon({ level }: { level: string }) {
    const bars = level === 'Low' ? 1 : level === 'Medium' ? 2 : level === 'High' ? 3 : 4;
    const color = level === 'Low' ? 'bg-gray-400' : level === 'Medium' ? 'bg-orange-400' : 'bg-red-500';

    return (
        <div className="flex gap-[2px] items-end h-3.5 mb-0.5">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-[3px] rounded-[1px] ${i <= bars ? color : 'bg-gray-200'} ${i === 1 ? 'h-1.5' : i === 2 ? 'h-2' : i === 3 ? 'h-3' : 'h-3.5'}`} />
            ))}
        </div>
    );
}
import { useTaskStore } from '@/store/taskStore';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: taskId } = use(params);
    const router = useRouter();
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [activeStatusSubtask, setActiveStatusSubtask] = useState<string | null>(null);
    const [activePrioritySubtask, setActivePrioritySubtask] = useState<string | null>(null);
    const { tasks, loadTasks, updateTask, createTask, deleteTask } = useTaskStore();

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const task = tasks.find((t: any) => t.id === taskId);

    const handleDateSelect = (num: number) => {
        if (!task) return;
        updateTask(task.id, { dueDate: `Jan ${num}` });
        setShowDatePicker(false);
    };

    if (!task) return <div className="p-8">Loading task...</div>;

    return (
        <div className="h-full flex flex-col bg-card overflow-y-auto">
            {/* Top Header */}
            <div className="flex justify-between items-start pb-4 mt-2 px-2 border-b border-border sticky top-0 bg-card z-10 pt-2">
                <div className="flex-1 pr-10">
                    <h1 className="text-[26px] font-bold text-foreground mb-2 leading-tight">{task.title}</h1>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                        Track your tasks explicitly in this nested details pane.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-muted"><Lock className="w-4 h-4" /></button>
                    <button className="px-2.5 h-8 rounded-md border border-border flex items-center gap-1.5 text-muted-foreground hover:bg-muted text-xs font-semibold"><Eye className="w-4 h-4 text-blue-500" /> 1</button>
                    <button className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-muted"><Share2 className="w-4 h-4" /></button>
                    <button className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></button>
                    <button className="w-8 h-8 rounded-md bg-background flex items-center justify-center text-muted-foreground hover:bg-muted"><PanelRight className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Main Content */}
                <div className="flex-1 overflow-y-auto p-4 px-2 lg:px-4 hide-scrollbar">

                    {/* Meta rows */}
                    <div className="grid grid-cols-[120px_1fr] gap-4 mb-4 text-sm items-center">
                        <div className="font-semibold text-foreground">Properties</div>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-2 bg-muted border border-border px-2 py-1 rounded-md text-[13px] font-semibold text-foreground">
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-white shrink-0">A</div> Designer
                            </span>
                            <span className="flex items-center gap-1.5 bg-[#FEF2F2] px-2 py-1 rounded-md text-[13px] font-semibold text-[#EF4444]">
                                <Calendar className="w-3.5 h-3.5" /> 31 Jul
                            </span>
                        </div>

                        <div className="font-semibold text-foreground mt-2">Labels</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(task.tags || []).length > 0 ? task.tags.map((label: string) => (
                                <span key={label} className="flex items-center gap-1.5 bg-muted border border-border px-2.5 py-1 rounded-md text-[12px] font-semibold text-muted-foreground">
                                    <Tag className="w-3 h-3 text-muted-foreground" /> {label}
                                </span>
                            )) : (
                                <span className="text-[12px] font-semibold text-muted-foreground italic">No labels</span>
                            )}
                        </div>

                        <div className="font-semibold text-foreground mt-2">Resources</div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[13px] font-medium mt-2 cursor-pointer hover:text-gray-700">
                            <Paperclip className="w-3.5 h-3.5" /> Add document or link...
                        </div>
                    </div>

                    {/* Subtasks Section Wrapper */}
                    <div className="mt-8">
                        <div className="flex items-center gap-2 font-bold text-foreground mb-3">
                            <ChevronDown className="w-4 h-4" /> Subtasks
                        </div>

                        <div className="border border-border rounded-xl mb-8 relative">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border bg-card">
                                    <tr>
                                        <th className="font-semibold text-muted-foreground px-4 py-2.5 rounded-tl-xl">Task</th>
                                        <th className="font-semibold text-muted-foreground px-4 py-2.5">Status</th>
                                        <th className="font-semibold text-muted-foreground px-4 py-2.5">Priority</th>
                                        <th className="font-semibold text-muted-foreground px-4 py-2.5">Members</th>
                                        <th className="font-semibold text-muted-foreground px-4 py-2.5">Due Date</th>
                                        <th className="font-semibold text-muted-foreground px-4 py-2.5 text-right flex-1 rounded-tr-xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.filter((t: any) => t.parentTaskId === task.id).map((subtask: any) => {
                                        const dateStr = subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Date';
                                        return (
                                            <tr key={subtask.id} className={`border-b border-border group hover:bg-muted cursor-pointer relative ${activeStatusSubtask === subtask.id || activePrioritySubtask === subtask.id ? 'z-20' : 'z-auto'}`} onClick={() => window.location.href = `/workspace/tasks/${subtask.id}`}>
                                                <td className="px-4 py-3 font-semibold text-foreground text-[13px]">{subtask.title}</td>
                                                <td className="px-4 py-3">
                                                    <div className="relative w-max">
                                                        <div onClick={(e) => { e.stopPropagation(); setActiveStatusSubtask(activeStatusSubtask === subtask.id ? null : subtask.id); setActivePrioritySubtask(null); }} className="flex items-center gap-1.5 font-medium text-[12px] text-foreground cursor-pointer hover:bg-muted py-1 px-2 rounded-md -ml-2">
                                                            <div className="w-3 h-3 border border-foreground rounded-full"></div> {subtask.status || 'To Do'}
                                                        </div>
                                                        {activeStatusSubtask === subtask.id && (
                                                            <div className="absolute top-full left-0 mt-1 w-[140px] bg-card border border-border shadow-lg rounded-xl z-50 p-1 py-1">
                                                                {['To Do', 'Doing', 'Completed', 'On Hold'].map(s => (
                                                                    <div key={s} onClick={(e) => { e.stopPropagation(); updateTask(subtask.id, { status: s }); setActiveStatusSubtask(null); }} className="flex items-center justify-between px-3 py-1.5 hover:bg-muted rounded cursor-pointer text-[12px] font-semibold text-foreground">
                                                                        {s} {subtask.status === s && <Check className="w-3.5 h-3.5" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="relative w-max">
                                                        <div onClick={(e) => { e.stopPropagation(); setActivePrioritySubtask(activePrioritySubtask === subtask.id ? null : subtask.id); setActiveStatusSubtask(null); }} className={`flex items-center gap-1.5 font-medium text-[12px] cursor-pointer hover:bg-muted py-1 px-2 rounded-md -ml-2 ${subtask.priority === 'High' || subtask.priority === 'Urgent' ? 'text-red-500' : subtask.priority === 'Medium' ? 'text-orange-500' : 'text-gray-500'}`}>
                                                            <PriorityIcon level={subtask.priority || 'Low'} /> {subtask.priority || 'Low'}
                                                        </div>
                                                        {activePrioritySubtask === subtask.id && (
                                                            <div className="absolute top-full left-0 mt-1 w-[140px] bg-card border border-border shadow-lg rounded-xl z-50 p-1 py-1">
                                                                {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                                                                    <div key={p} onClick={(e) => { e.stopPropagation(); updateTask(subtask.id, { priority: p }); setActivePrioritySubtask(null); }} className={`flex items-center justify-between px-3 py-1.5 hover:bg-muted rounded cursor-pointer text-[12px] font-semibold ${p === 'High' || p === 'Urgent' ? 'text-red-500' : p === 'Medium' ? 'text-orange-500' : 'text-gray-500'}`}>
                                                                        <span className="flex items-center gap-1.5"><PriorityIcon level={p} /> {p}</span>
                                                                        {subtask.priority === p && <Check className="w-3.5 h-3.5 text-foreground" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-foreground font-semibold text-[13px] uppercase">
                                                    <div className="w-[24px] h-[24px] rounded-full overflow-hidden border border-white bg-gray-200">
                                                        {subtask.assignee ? <span className="w-full h-full flex items-center justify-center text-[10px] bg-red-400 text-white font-bold">{subtask.assignee.substring(0, 2)}</span> : <img src={"https://i.pravatar.cc/150?u=" + subtask.id} alt="Avatar" className="w-full h-full object-cover" />}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground text-[13px] font-medium">{dateStr}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); deleteTask(subtask.id); }} />
                                                        <MoreHorizontal className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={(e) => e.stopPropagation()} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div
                                onClick={() => setIsAddTaskModalOpen(true)}
                                className="px-4 py-3 flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Add Subtask
                            </div>
                        </div>

                        <div className="font-bold text-foreground mb-4 text-[15px]">Subtasks</div>

                        {/* Comment Thread */}
                        <div className="border border-border rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <img src="https://i.pravatar.cc/150?u=ankit" className="w-6 h-6 rounded-full" />
                                    <span className="font-semibold text-foreground text-[13px]">Ankit Dutta</span>
                                    <span className="text-muted-foreground text-xs font-medium">just now</span>
                                </div>
                                <div className="flex gap-2 text-muted-foreground">
                                    <Smile className="w-4 h-4 cursor-pointer" />
                                    <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                                </div>
                            </div>
                            <p className="text-foreground text-[13px] font-medium ml-8 mb-6">dsds</p>

                            <div className="flex items-center gap-3 ml-8">
                                <img src="https://i.pravatar.cc/150?u=dexter" className="w-6 h-6 rounded-full" />
                                <div className="flex-1 flex justify-between items-center bg-transparent text-[13px] text-muted-foreground font-medium">
                                    Leave a reply...
                                    <div className="flex gap-3">
                                        <Paperclip className="w-4 h-4 cursor-pointer" />
                                        <Send className="w-4 h-4 cursor-pointer text-foreground" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add Comment Input */}
                        <div className="border border-border rounded-xl p-3 flex justify-between items-center mb-10">
                            <span className="text-muted-foreground text-[13px] font-medium ml-1">Add a comment...</span>
                            <div className="flex gap-3 text-muted-foreground">
                                <Paperclip className="w-4 h-4 cursor-pointer" />
                                <Send className="w-4 h-4 cursor-pointer text-foreground" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Panel */}
                <div className="w-[300px] shrink-0 border-l border-border p-4 hide-scrollbar overflow-y-auto pb-40">
                    {/* Details Card */}
                    <div className="border border-border rounded-xl shadow-sm mb-4 bg-card relative">
                        <div className="flex justify-between items-center p-3 border-b border-border">
                            <div className="flex items-center gap-1.5 font-bold text-foreground text-[14px]">
                                <ChevronDown className="w-4 h-4" /> Details
                            </div>
                            <div className="flex gap-2 text-muted-foreground">
                                <Plus className="w-4 h-4 cursor-pointer hover:text-black" />
                                <Settings className="w-4 h-4 cursor-pointer hover:text-black" />
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-[80px_1fr] items-center text-[12px] font-semibold">
                                <span className="text-muted-foreground">Status</span>
                                <div className="flex items-center gap-1.5 text-orange-400"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Backlog</div>
                            </div>

                            <div className="grid grid-cols-[80px_1fr] flex-start text-[12px] font-semibold relative">
                                <span className="text-muted-foreground">Priority</span>
                                <div
                                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                                    className={`flex items-center gap-1.5 cursor-pointer ${task.priority === 'High' || task.priority === 'Urgent' ? 'text-red-500' : task.priority === 'Medium' ? 'text-orange-500' : 'text-gray-500'}`}
                                >
                                    <PriorityIcon level={task.priority} /> {task.priority} <ChevronDown className="w-3 h-3 text-muted-foreground" />
                                </div>

                                {/* Floating Dropdown inside Details Panel for Priority */}
                                {showPriorityDropdown && (
                                    <div className="absolute top-6 right-0 w-[160px] bg-card border border-border shadow-lg rounded-xl z-50 p-1 py-1.5 left-[80px]">
                                        <div className="text-[11px] font-bold text-muted-foreground px-3 py-1.5">Priority</div>
                                        {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                                            <div key={p} onClick={() => { updateTask(task.id, { priority: p }); setShowPriorityDropdown(false); }} className={`flex items-center justify-between px-3 py-1.5 hover:bg-muted cursor-pointer text-[12px] font-semibold ${p === 'High' || p === 'Urgent' ? 'text-red-500' : p === 'Medium' ? 'text-orange-500' : 'text-gray-500'}`}>
                                                <span className="flex items-center gap-2"><PriorityIcon level={p} /> {p}</span>
                                                {task.priority === p && <Check className="w-3.5 h-3.5 text-black" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-[80px_1fr] items-center text-[12px] font-semibold">
                                <span className="text-muted-foreground">Members</span>
                                <button className="flex items-center gap-1.5 text-foreground hover:bg-muted rounded py-0.5 w-max">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    Add members
                                </button>
                            </div>

                            <div className="grid grid-cols-[80px_1fr] items-center text-[12px] font-semibold relative">
                                <span className="text-muted-foreground">Dates</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { setShowDatePicker(!showDatePicker); setShowPriorityDropdown(false); }} className={`flex items-center gap-1.5 border rounded px-2 py-1 text-xs font-semibold ${showDatePicker ? 'border-gray-500 shadow-sm text-gray-800 bg-gray-50' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                                        <Calendar className={`w-3.5 h-3.5 ${showDatePicker ? 'text-gray-800' : 'text-muted-foreground'}`} />
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Start Date'}
                                    </button>
                                    <span className="text-muted-foreground">→</span>
                                    <button className="flex items-center gap-1.5 border border-border rounded px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> End
                                    </button>
                                </div>

                                {showDatePicker && (
                                    <div className="absolute top-8 left-[80px] w-[260px] bg-card border border-border shadow-2xl rounded-xl z-50 p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <button className="text-muted-foreground hover:bg-muted rounded-md p-1">
                                                <ChevronDown className="w-4 h-4 rotate-90" />
                                            </button>
                                            <div className="font-bold text-[13px] text-foreground">January 2026</div>
                                            <button className="text-muted-foreground hover:bg-muted rounded-md p-1">
                                                <ChevronDown className="w-4 h-4 -rotate-90" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                <div key={day} className="text-[11px] font-medium text-muted-foreground">{day}</div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-[12px] font-medium text-foreground items-center">
                                            <div className="text-gray-300">30</div>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(num => (
                                                <div key={num} onClick={() => handleDateSelect(num)} className={`hover:bg-muted rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer select-none ${task.dueDate === `Jan ${num}` ? 'bg-primary text-primary-foreground font-bold' : ''}`}>
                                                    {num}
                                                </div>
                                            ))}
                                            <div onClick={() => handleDateSelect(24)} className={`bg-gray-100 outline outline-1 outline-border rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer select-none ${task.dueDate === 'Jan 24' ? 'bg-primary text-primary-foreground font-bold outline-none' : ''}`}>24</div>
                                            {[25, 26, 27, 28, 29, 30, 31].map(num => (
                                                <div key={num} onClick={() => handleDateSelect(num)} className={`hover:bg-muted rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer select-none ${task.dueDate === `Jan ${num}` ? 'bg-primary text-primary-foreground font-bold' : ''}`}>
                                                    {num}
                                                </div>
                                            ))}
                                            <div className="text-gray-300">1</div><div className="text-gray-300">2</div><div className="text-gray-300">3</div>
                                        </div>

                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-[80px_1fr] items-center text-[12px] font-semibold">
                                <span className="text-muted-foreground">Labels</span>
                                <div className="flex items-center gap-1.5 text-red-500"><PriorityIcon level="Urgent" /> Urgent</div>
                            </div>

                            <div className="grid grid-cols-[80px_1fr] items-center text-[12px] font-semibold">
                                <span className="text-muted-foreground">Teams</span>
                                <div className="flex items-center gap-1.5 text-orange-400"><PriorityIcon level="High" /> High</div>
                            </div>

                            <div className="grid grid-cols-[80px_1fr] items-center text-[12px] font-semibold">
                                <span className="text-muted-foreground">Reporter</span>
                                <div className="flex items-center gap-1.5 text-yellow-500"><PriorityIcon level="Medium" /> Medium</div>
                            </div>
                        </div>
                    </div>

                    {/* Updates Card */}
                    <div className="border border-border rounded-xl shadow-sm bg-card">
                        <div className="flex items-center gap-1.5 font-bold text-foreground text-[14px] p-3 border-b border-border">
                            <ChevronDown className="w-4 h-4" /> Updates
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex gap-3">
                                <div className="w-[26px] h-[26px] rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                    <PriorityIcon level="Urgent" />
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground text-[12px]">You</div>
                                    <div className="text-[12px] text-muted-foreground font-medium">changed priority from No priority to Ur...</div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <img src="https://i.pravatar.cc/150?u=dexter" className="w-[26px] h-[26px] rounded-full shrink-0" />
                                <div>
                                    <div className="font-semibold text-foreground text-[12px]">You</div>
                                    <div className="text-[12px] text-muted-foreground font-medium">posted an update · Aug 2026</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isAddTaskModalOpen && <AddTaskModal onClose={() => setIsAddTaskModalOpen(false)} parentTaskId={task.id} projectId={task.projectId} />}
            {(activeStatusSubtask || activePrioritySubtask) && <div className="fixed inset-0 z-30" onClick={() => { setActiveStatusSubtask(null); setActivePrioritySubtask(null); }} />}
        </div>
    );
}

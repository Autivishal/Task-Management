'use client';

import { useState, useEffect } from 'react';
import { Search, Columns3, Filter, Plus, ChevronRight, Check } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';

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

export default function ProjectsPage() {
    const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
    const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
    const { tasks, loadTasks, createTask, updateTask } = useTaskStore();

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);


    return (
        <div className="h-full flex flex-col pt-2 bg-background p-4 lg:p-6">
            {/* Top Header */}
            <div className="flex justify-between items-center pb-6">
                <div>
                    <h1 className="text-[22px] font-extrabold text-foreground">Projects</h1>
                </div>
                <div className="flex gap-2.5 items-center">
                    <button className="w-9 h-9 border border-border rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                        <Search className="w-4 h-4" />
                    </button>



                    <button className="w-9 h-9 border border-border rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="px-3 h-9 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm ml-1">
                        <Plus className="w-4 h-4" /> Add Task
                    </button>
                </div>
            </div>

            {/* Projects Table */}
            <div className="border border-border bg-card rounded-xl shadow-sm overflow-visible relative">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted border-b border-border">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-foreground text-[13px] rounded-tl-xl">Tasks</th>
                            <th className="px-4 py-3 font-semibold text-foreground text-[13px]">Priority</th>
                            <th className="px-4 py-3 font-semibold text-foreground text-[13px]">Lead</th>
                            <th className="px-4 py-3 font-semibold text-foreground text-[13px]">Due Date</th>
                            <th className="px-4 py-3 font-semibold text-foreground text-[13px] text-right rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.filter((t: any) => !t.parentTaskId).map((task: any) => {
                            const dateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No Date';
                            return (
                                <tr
                                    key={task.id}
                                    onClick={() => window.location.href = `/workspace/tasks/${task.id}`}
                                    className={`border-b border-border hover:bg-muted group cursor-pointer ${openMenuRowId === task.id ? 'relative z-50' : 'relative z-0'}`}
                                >
                                    <td className="px-4 py-3 text-[13px] font-semibold text-foreground flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        {task.title}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${task.priority === 'High' || task.priority === 'Urgent' ? 'text-red-500' : task.priority === 'Medium' ? 'text-orange-500' : 'text-gray-400'}`}>
                                            <PriorityIcon level={task.priority || 'Low'} /> {task.priority || 'Low'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="w-[24px] h-[24px] rounded-full overflow-hidden border border-white bg-gray-200">
                                            <img src={"https://i.pravatar.cc/150?u=" + task.id} alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[13px] font-semibold text-muted-foreground">{dateStr}</td>
                                    <td className="px-4 py-3 text-right relative">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setOpenMenuRowId(openMenuRowId === task.id ? null : task.id); setActiveSubMenu(null); }}
                                            className="w-4 h-4 ml-auto text-muted-foreground opacity-20 group-hover:opacity-100 cursor-pointer hover:text-foreground transition-colors"
                                        >
                                            <MoreHorizontal className="w-full h-full" />
                                        </button>

                                        {openMenuRowId === task.id && (
                                            <div className="absolute top-10 right-4 w-[180px] bg-card border border-border shadow-xl rounded-xl z-50 p-2 text-left" onClick={(e) => e.stopPropagation()}>
                                                <div className="text-[11px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide border-b border-border mb-2 pt-1 border-opacity-50">Manage Task</div>

                                                {[
                                                    { icon: <div className="w-3.5 h-3.5 border-2 border-foreground rounded-full"></div>, label: 'Status' },
                                                    { icon: <PriorityIcon level={task.priority || 'Low'} />, label: 'Priority' },
                                                    { icon: <span className="text-[12px] font-bold tracking-tighter w-3.5 flex items-center justify-center">👥</span>, label: 'Members' },
                                                    { icon: <span className="text-[12px] font-bold tracking-tighter w-3.5 flex items-center justify-center">🕒</span>, label: 'Due Date' },
                                                    { icon: <span className="text-[12px] font-bold tracking-tighter w-3.5 flex items-center justify-center">🏢</span>, label: 'Teams' },
                                                    { icon: <span className="text-[12px] font-bold tracking-tighter w-3.5 flex items-center justify-center">🏷️</span>, label: 'Labels' },
                                                    { icon: <span className="text-[12px] font-bold tracking-tighter w-3.5 flex items-center justify-center">👤</span>, label: 'Reporter' },
                                                ].map(item => (
                                                    <div
                                                        key={item.label}
                                                        onMouseEnter={() => setActiveSubMenu(item.label)}
                                                        className={`flex justify-between items-center px-3 py-2 cursor-pointer rounded-lg text-[13px] font-semibold text-foreground ${activeSubMenu === item.label ? 'bg-muted' : 'hover:bg-muted'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-muted-foreground flex items-center justify-center w-4 h-4 shrink-0">{item.icon}</div>
                                                            {item.label}
                                                        </div>
                                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                                    </div>
                                                ))}

                                                {/* Nested Flyouts for specific row */}
                                                {activeSubMenu === 'Priority' && (
                                                    <div
                                                        className="absolute top-6 right-[185px] w-[180px] bg-card border border-border shadow-xl rounded-xl z-50 p-2 py-3"
                                                        onMouseLeave={() => setActiveSubMenu(null)}
                                                    >
                                                        <div className="text-[11px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide">Set Priority</div>
                                                        {['Urgent', 'High', 'Medium', 'Low'].map(p => (
                                                            <div key={p} onClick={() => { updateTask(task.id, { priority: p }); setOpenMenuRowId(null); setActiveSubMenu(null); }} className={`flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer text-[13px] font-semibold rounded-lg ${p === 'Urgent' ? 'text-red-600' : p === 'High' ? 'text-orange-500' : p === 'Medium' ? 'text-yellow-600' : 'text-gray-500'}`}>
                                                                <PriorityIcon level={p} /> {p} {task.priority === p && <Check className="w-4 h-4 ml-auto" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {activeSubMenu === 'Status' && (
                                                    <div
                                                        className="absolute top-6 right-[185px] w-[180px] bg-card border border-border shadow-xl rounded-xl z-50 p-2 py-3"
                                                        onMouseLeave={() => setActiveSubMenu(null)}
                                                    >
                                                        <div className="text-[11px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide">Set Status</div>
                                                        {['To Do', 'Doing', 'Completed', 'On Hold'].map(s => (
                                                            <div key={s} onClick={() => { updateTask(task.id, { status: s }); setOpenMenuRowId(null); setActiveSubMenu(null); }} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer text-[13px] font-semibold text-foreground rounded-lg">
                                                                {s} {task.status === s && <Check className="w-4 h-4 ml-auto" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {activeSubMenu === 'Members' && (
                                                    <div
                                                        className="absolute top-[70px] right-[185px] w-[180px] bg-card border border-border shadow-xl rounded-xl z-50 p-2 py-3"
                                                        onMouseLeave={() => setActiveSubMenu(null)}
                                                    >
                                                        <div className="text-[11px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide">Assign Member</div>
                                                        {['Dexter', 'A', 'CN'].map(m => (
                                                            <div key={m} onClick={() => { updateTask(task.id, { assignee: m }); setOpenMenuRowId(null); setActiveSubMenu(null); }} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer text-[13px] font-semibold text-foreground rounded-lg">
                                                                {m} {task.assignee === m && <Check className="w-4 h-4 ml-auto" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {activeSubMenu === 'Due Date' && (
                                                    <div
                                                        className="absolute top-[80px] right-[185px] w-[180px] bg-card border border-border shadow-xl rounded-xl z-50 p-2 py-3"
                                                        onMouseLeave={() => setActiveSubMenu(null)}
                                                    >
                                                        <div className="text-[11px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide">Set Due Date</div>
                                                        {['Today', 'Tomorrow', 'Next Week', 'No Date'].map(d => (
                                                            <div key={d} onClick={() => {
                                                                let newDate = null;
                                                                if (d === 'Today') newDate = new Date().toISOString();
                                                                if (d === 'Tomorrow') { const dt = new Date(); dt.setDate(dt.getDate() + 1); newDate = dt.toISOString(); }
                                                                if (d === 'Next Week') { const dt = new Date(); dt.setDate(dt.getDate() + 7); newDate = dt.toISOString(); }
                                                                updateTask(task.id, { dueDate: newDate });
                                                                setOpenMenuRowId(null); setActiveSubMenu(null);
                                                            }} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer text-[13px] font-semibold text-foreground rounded-lg">
                                                                {d}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {activeSubMenu === 'Labels' && (
                                                    <div
                                                        className="absolute top-[130px] right-[185px] w-[180px] bg-card border border-border shadow-xl rounded-xl z-50 p-2 py-3"
                                                        onMouseLeave={() => setActiveSubMenu(null)}
                                                    >
                                                        <div className="text-[11px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide">Toggle Labels</div>
                                                        {['Design', 'Frontend', 'Backend', 'Bug'].map(l => {
                                                            const hasTag = task.tags?.includes(l);
                                                            return (
                                                                <div key={l} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newTags = hasTag ? (task.tags || []).filter((t: string) => t !== l) : [...(task.tags || []), l];
                                                                    updateTask(task.id, { tags: newTags });
                                                                }} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer text-[13px] font-semibold text-foreground rounded-lg">
                                                                    {l} {hasTag && <Check className="w-4 h-4 ml-auto" />}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}

                                                {(activeSubMenu === 'Teams' || activeSubMenu === 'Reporter') && (
                                                    <div
                                                        className="absolute top-[120px] right-[185px] w-[180px] bg-card border border-border shadow-xl rounded-xl z-50 p-2 py-3"
                                                        onMouseLeave={() => setActiveSubMenu(null)}
                                                    >
                                                        <div className="text-[11px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide">Not Setup</div>
                                                        <div className="px-3 py-2 text-[12px] font-semibold text-muted-foreground">This workspace config does not utilize {activeSubMenu}.</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        <tr onClick={() => createTask({ title: 'New Task', status: 'To Do', priority: 'Medium' })} className="cursor-pointer">
                            <td colSpan={5} className="px-4 py-3 text-[13px] font-semibold text-muted-foreground hover:bg-muted font-medium flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Task
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {openMenuRowId !== null && <div className="fixed inset-0 z-40" onClick={() => { setOpenMenuRowId(null); setActiveSubMenu(null); }} />}
        </div>
    );
}

import { MoreHorizontal } from 'lucide-react';

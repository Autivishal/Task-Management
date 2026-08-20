'use client';

import { useEffect, useState } from 'react';
import { KanbanBoard } from '@/components/boards/KanbanBoard';
import { ListView } from '@/components/boards/ListView';
import { Search, Columns3, Filter, Plus, List, LayoutGrid, Check } from 'lucide-react';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { useViewStore } from '@/store/viewStore';

export default function WorkspacePage() {
    const [showFields, setShowFields] = useState(false);
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [showAddModal, setShowAddModal] = useState(false);
    const { fields, toggleField } = useViewStore();

    return (
        <div className="h-full flex flex-col pt-2 bg-card">
            {/* View Switcher / Top Tools */}
            <div className="flex justify-between items-center pb-4 mb-2 pr-2">
                <div>
                    <h1 className="text-[22px] font-extrabold text-foreground">
                        Tasks
                    </h1>
                </div>
                <div className="flex gap-2.5 items-center">
                    <button className="w-9 h-9 border border-border rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                        <Search className="w-4 h-4" />
                    </button>

                    {/* Fields Dropdown Container */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFields(!showFields)}
                            className={`px-3 h-9 border ${showFields ? 'border-[#111827] ring-primary ring-[#111827]' : 'border-border'} rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted flex items-center gap-2 bg-card shadow-sm`}
                        >
                            <Columns3 className="w-4 h-4 text-muted-foreground" /> Fields
                        </button>

                        {showFields && (
                            <div className="absolute top-11 right-0 w-[240px] bg-card border border-border shadow-xl rounded-xl z-50 p-2 pt-3">
                                {/* Segmented Control */}
                                <div className="flex w-full bg-background p-1 rounded-lg mb-3">
                                    <button
                                        onClick={() => { setView('list'); setShowFields(false); }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[13px] font-semibold rounded-md ${view === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <List className={`w-4 h-4 ${view === 'list' ? 'text-foreground' : 'text-muted-foreground'}`} /> List
                                    </button>
                                    <button
                                        onClick={() => { setView('kanban'); setShowFields(false); }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[13px] font-semibold rounded-md ${view === 'kanban' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                                    >
                                        <LayoutGrid className={`w-4 h-4 ${view === 'kanban' ? 'text-foreground' : 'text-muted-foreground'}`} /> Board
                                    </button>
                                </div>

                                {/* Field Items */}
                                <div className="flex flex-col gap-1 px-1">
                                    {fields.map((item, idx) => (
                                        <div key={idx} onClick={() => toggleField(item.name)} className="flex justify-between items-center py-1.5 cursor-pointer group">
                                            <span className="text-[13px] text-foreground font-medium">{item.name}</span>
                                            <div className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-colors ${item.checked ? 'bg-primary' : 'bg-[#E5E7EB] group-hover:bg-[#D1D5DB]'}`}>
                                                {item.checked && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="w-9 h-9 border border-border rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 h-9 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2 shadow-sm ml-1"
                    >
                        <Plus className="w-4 h-4" /> Add Task
                    </button>
                </div>
            </div>

            {/* Board Loaders */}
            <div className="flex-1 overflow-hidden relative">
                {view === 'kanban' ? <KanbanBoard /> : <ListView />}
            </div>

            {/* Global Add Task */}
            {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
        </div>
    );
}

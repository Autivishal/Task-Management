'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Plus, GripVertical, Calendar, Tag, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useTaskStore, Task } from "@/store/taskStore";
import { useViewStore } from "@/store/viewStore";
import { AddTaskModal } from "../tasks/AddTaskModal";

const statuses = ['To Do', 'Doing', 'Completed', 'On Hold'];

function TaskCard({ task, index, onDelete, onUpdateStatus, showPriority, showMembers, showDueDate, showLabels, onClick }: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No date';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          onClick={onClick}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-card w-full rounded-xl shadow-sm border ${snapshot.isDragging ? 'border-[#111827] ring-primary ring-[#111827]' : 'border-border'} p-4 flex flex-col gap-3.5 cursor-pointer hover:border-gray-300 transition-all group relative`}
        >
          {showPriority && (
            <div className={`absolute top-0 left-0 w-1.5 h-[50%] opacity-80 rounded-br-sm ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-orange-400' : 'bg-gray-400'}`} />
          )}

          <div className="flex justify-between items-start gap-2 relative">
            <h4 className="font-semibold text-sm leading-snug text-foreground pr-8">{task.title}</h4>
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shrink-0">
              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="text-muted-foreground hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {menuOpen && (
              <div className="absolute top-6 right-0 bg-card border border-border shadow-lg rounded-xl z-50 w-[140px] opacity-100 py-1" onClick={(e) => e.stopPropagation()}>
                <div className="text-[10px] font-bold text-muted-foreground px-3 py-1.5 uppercase tracking-wider">Move to</div>
                {['To Do', 'Doing', 'Completed', 'On Hold'].filter((s: string) => s !== task.status).map((s: string) => (
                  <button
                    key={s}
                    onClick={() => { setMenuOpen(false); onUpdateStatus(task.id, s); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-muted text-[13px] font-semibold text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(showMembers || showDueDate) && (
            <div className="flex justify-between items-center">
              {showMembers ? (
                <div className="flex items-center gap-2">
                  <img src={"https://i.pravatar.cc/150?u=" + task.id} alt={task.assignee || 'User'} className="w-[22px] h-[22px] rounded-full object-cover" />
                  <span className="text-[13px] font-semibold text-muted-foreground">{task.assignee || 'User'}</span>
                </div>
              ) : <div></div>}
              {showDueDate && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-50 text-red-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold tracking-tight">{dateStr}</span>
                </div>
              )}
            </div>
          )}

          {showLabels && task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {task.tags.map((t: string, idx: number) => (
                <span key={idx} className="px-2 py-[3px] text-[11px] font-semibold bg-muted text-muted-foreground rounded border border-border flex items-center gap-1.5 shadow-sm">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export function KanbanBoard() {
  const { tasks, loadTasks, updateTask, deleteTask } = useTaskStore();
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

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId;
    await updateTask(draggableId, { status: newStatus });
  };

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/workspace/tasks/' + id);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex items-start w-full h-[calc(100vh-140px)] pb-4 overflow-x-auto gap-4 hide-scrollbar">
          {statuses.map(status => {
            const columnTasks = tasks.filter(t => t.status === status && !t.parentTaskId);
            return (
              <div key={status} className="w-[300px] shrink-0 flex flex-col h-max max-h-full bg-background rounded-xl border border-border">
                <div className="flex justify-between items-center px-3 py-3 border-b border-border mb-2 bg-muted rounded-t-xl shrink-0">
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-bold text-foreground text-sm">{status}</h3>
                    <div className="ml-1 px-1.5 py-0.5 bg-[#E5E7EB] rounded-full text-xs font-semibold text-muted-foreground">{columnTasks.length}</div>
                  </div>
                  <div className="flex gap-2 text-muted-foreground">
                    <button onClick={() => setModalStatus(status)} className="hover:text-gray-700 transition-colors"><Plus className="w-4 h-4" /></button>
                    <button className="hover:text-gray-700 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                </div>
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 overflow-y-auto flex flex-col gap-3 px-3 pb-4 ${snapshot.isDraggingOver ? 'bg-gray-200/50 rounded-b-xl' : ''}`}
                    >
                      {columnTasks.map((task, idx) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={idx}
                          onDelete={deleteTask}
                          onUpdateStatus={(id: string, s: string) => updateTask(id, { status: s })}
                          showPriority={showPriority}
                          showMembers={showMembers}
                          showDueDate={showDueDate}
                          showLabels={showLabels}
                          onClick={(e: React.MouseEvent) => handleCardClick(task.id, e)}
                        />
                      ))}
                      {provided.placeholder}
                      <button onClick={() => setModalStatus(status)} className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground mt-1 pl-1 py-1 rounded hover:bg-muted transition-colors">
                        <Plus className="w-4 h-4" /> Add Task
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      {modalStatus && <AddTaskModal defaultStatus={modalStatus} onClose={() => setModalStatus(null)} />}
    </>
  );
}

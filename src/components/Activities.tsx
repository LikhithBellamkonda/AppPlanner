import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Search, Check, MoreVertical, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

export default function Activities() {
  const { tasks, toggleTask, addTask } = useFirebase();
  const [filter, setFilter] = useState<'In Progress' | 'Completed'>('In Progress');
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'Work', duration: '1h', priority: 'Normal' as Task['priority'], time: '09:00' });

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'Completed' ? t.completed : !t.completed;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const morningTasks = filteredTasks.filter(t => t.time && parseInt(t.time.split(':')[0]) < 12);
  const afternoonTasks = filteredTasks.filter(t => t.time && parseInt(t.time.split(':')[0]) >= 12 && parseInt(t.time.split(':')[0]) < 17);
  const eveningTasks = filteredTasks.filter(t => t.time && parseInt(t.time.split(':')[0]) >= 17);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    await addTask({
      ...newTask,
      completed: false
    });
    setNewTask({ title: '', category: 'Work', duration: '1h', priority: 'Normal', time: '09:00' });
    setIsAdding(false);
  };

  return (
    <div className="max-w-3xl mx-auto pb-32">
      {/* Search & Filter */}
      <section className="mb-12 space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
          <input 
            type="text" 
            placeholder="Search rituals..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-low border-b border-on-surface-variant/15 focus:border-primary focus:ring-0 text-on-surface py-4 pl-12 pr-4 transition-all duration-300 rounded-xl outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['In Progress', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all active:scale-95",
                filter === f ? "bg-primary-container text-on-primary-container" : "bg-surface-high text-on-surface-variant hover:text-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Task List */}
      <div className="space-y-16">
        <TaskSection title="Morning" timeRange="06:00 — 11:59" tasks={morningTasks} onToggle={toggleTask} />
        <TaskSection title="Afternoon" timeRange="12:00 — 16:59" tasks={afternoonTasks} onToggle={toggleTask} />
        <TaskSection title="Evening" timeRange="17:00 — 23:59" tasks={eveningTasks} onToggle={toggleTask} />
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-high w-full max-w-md rounded-3xl p-8 shadow-2xl border border-on-surface-variant/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">New Architecture Task</h3>
                <button onClick={() => setIsAdding(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Task Title</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-surface-low border border-on-surface-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                    placeholder="e.g. Design System Audit"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                    <input 
                      type="text" 
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full bg-surface-low border border-on-surface-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Time</label>
                    <input 
                      type="time" 
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                      className="w-full bg-surface-low border border-on-surface-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Duration</label>
                    <input 
                      type="text" 
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                      className="w-full bg-surface-low border border-on-surface-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Priority</label>
                    <select 
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full bg-surface-low border border-on-surface-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="High">High</option>
                      <option value="Normal">Normal</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Routine">Routine</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
                  Create Task
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button 
        onClick={() => setIsAdding(true)}
        className="fixed right-6 bottom-28 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-2xl flex items-center justify-center active:scale-90 transition-transform duration-200 z-40"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}

function TaskSection({ title, timeRange, tasks, onToggle }: { title: string, timeRange: string, tasks: Task[], onToggle: (id: string) => void }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">{title}</h2>
        <span className="text-[10px] text-primary/60 font-medium">{timeRange}</span>
      </div>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-xs text-on-surface-variant/50 italic">No tasks scheduled for this period.</p>
        ) : (
          tasks.map((task) => (
            <motion.div 
              key={task.id}
              whileHover={{ x: 4 }}
              className={cn(
                "group flex items-center justify-between p-5 rounded-2xl transition-all duration-300",
                task.progress ? "bg-surface-high relative overflow-hidden" : "bg-surface-low border border-transparent hover:border-on-surface-variant/10"
              )}
            >
              {task.progress && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>}
              <div className="flex items-center gap-6 relative z-10">
                <div className="relative flex items-center justify-center">
                  {task.progress && <div className="absolute w-8 h-8 bg-primary/20 blur-xl rounded-full animate-pulse"></div>}
                  <button 
                    onClick={() => onToggle(task.id)}
                    className={cn(
                      "appearance-none w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center",
                      task.completed ? "bg-primary border-primary" : "border-on-surface-variant/30",
                      task.progress && "border-primary/40"
                    )}
                  >
                    {task.completed && <Check size={14} className="text-on-primary" />}
                  </button>
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-lg font-medium transition-colors",
                    task.completed ? "text-on-surface-variant line-through" : "text-on-surface group-hover:text-primary",
                    task.progress && "font-bold text-primary"
                  )}>
                    {task.title}
                  </span>
                  <span className={cn("text-xs text-on-surface-variant", task.progress && "text-primary/60")}>
                    {task.category} — {task.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                {task.progress ? (
                  <span className="text-xs font-bold text-primary">{task.progress}%</span>
                ) : (
                  task.priority === 'Urgent' ? (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/20 border border-tertiary/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Priority</span>
                    </div>
                  ) : (
                    <MoreVertical size={18} className="text-on-surface-variant/30" />
                  )
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

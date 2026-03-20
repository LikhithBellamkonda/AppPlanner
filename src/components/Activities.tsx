import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Search, Check, MoreVertical, Plus, X, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

const SUGGESTED_RITUALS = [
  { title: 'Deep Work Sprint', category: 'Focus', duration: '90m', priority: 'High', time: '09:00' },
  { title: 'Design Review', category: 'Collaboration', duration: '45m', priority: 'Normal', time: '11:00' },
  { title: 'Digital Meditation', category: 'Routine', duration: '15m', priority: 'Routine', time: '08:30' },
  { title: 'Code Refactor', category: 'Technical', duration: '2h', priority: 'High', time: '14:00' },
  { title: 'Architecture Planning', category: 'Strategy', duration: '1h', priority: 'Urgent', time: '10:00' },
  { title: 'Inbox Zero Ritual', category: 'Admin', duration: '20m', priority: 'Normal', time: '16:30' },
];

export default function Activities() {
  const { tasks, toggleTask, addTask, deleteTask } = useFirebase();
  const [filter, setFilter] = useState<'In Progress' | 'Completed'>('In Progress');
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'Work', duration: '1h', priority: 'Normal' as Task['priority'], time: '09:00' });

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'Completed' ? t.completed : !t.completed;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddSuggested = async (ritual: typeof SUGGESTED_RITUALS[0]) => {
    await addTask({
      ...ritual,
      completed: false
    });
  };

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

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearAll = async () => {
    for (const t of filteredTasks) {
      await deleteTask(t.id);
    }
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-16">
      {/* Header */}
      <section className="space-y-2">
        <h2 className="text-4xl font-black tracking-tight font-display">Rituals & Activities</h2>
        <p className="text-on-surface-variant">Select from suggested blueprints or create your own custom flow.</p>
      </section>

      {/* Suggested Rituals */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles size={18} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Suggested Blueprints</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUGGESTED_RITUALS.map((ritual, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-surface-low p-6 rounded-2xl border border-on-surface-variant/5 hover:border-primary/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-surface-high rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{ritual.category}</span>
                <span className="text-xs text-on-surface-variant font-medium">{ritual.duration}</span>
              </div>
              <h4 className="font-bold text-on-surface mb-4">{ritual.title}</h4>
              <button 
                onClick={() => handleAddSuggested(ritual)}
                className="w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                Add to Schedule
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="h-px bg-on-surface-variant/10"></div>

      {/* Search & Filter */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Active Schedule</h3>
            {filteredTasks.length > 0 && (
              <div className="flex items-center gap-2">
                {!showClearConfirm ? (
                  <button 
                    onClick={() => setShowClearConfirm(true)}
                    className="text-[10px] font-bold text-error uppercase tracking-widest hover:underline"
                  >
                    Clear All
                  </button>
                ) : (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sure?</span>
                    <button onClick={handleClearAll} className="text-[10px] font-bold text-error uppercase tracking-widest hover:underline">Yes</button>
                    <button onClick={() => setShowClearConfirm(false)} className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hover:underline">No</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {['In Progress', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95",
                  filter === f ? "bg-primary-container text-on-primary-container" : "bg-surface-high text-on-surface-variant hover:text-primary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
          <input 
            type="text" 
            placeholder="Search active rituals..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-low border border-on-surface-variant/10 focus:border-primary focus:ring-0 text-on-surface py-3 pl-12 pr-4 transition-all duration-300 rounded-xl outline-none"
          />
        </div>
      </section>

      {/* Task List */}
      <div className="space-y-12">
        <TaskSection title="Morning" timeRange="06:00 — 11:59" tasks={filteredTasks.filter(t => t.time && parseInt(t.time.split(':')[0]) < 12)} onToggle={toggleTask} onDelete={deleteTask} />
        <TaskSection title="Afternoon" timeRange="12:00 — 16:59" tasks={filteredTasks.filter(t => t.time && parseInt(t.time.split(':')[0]) >= 12 && parseInt(t.time.split(':')[0]) < 17)} onToggle={toggleTask} onDelete={deleteTask} />
        <TaskSection title="Evening" timeRange="17:00 — 23:59" tasks={filteredTasks.filter(t => t.time && parseInt(t.time.split(':')[0]) >= 17)} onToggle={toggleTask} onDelete={deleteTask} />
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

function TaskSection({ title, timeRange, tasks, onToggle, onDelete }: { title: string, timeRange: string, tasks: Task[], onToggle: (id: string) => void, onDelete: (id: string) => void }) {
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
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
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
                        "appearance-none w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center active:scale-90",
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
                <div className="flex items-center gap-4 relative z-10">
                  {task.progress ? (
                    <span className="text-xs font-bold text-primary">{task.progress}%</span>
                  ) : (
                    task.priority === 'Urgent' ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/20 border border-tertiary/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                        <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider">Priority</span>
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-surface-container rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{task.priority}</div>
                    )
                  )}
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

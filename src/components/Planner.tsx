import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ChevronLeft, ChevronRight, Calendar, GripVertical, Pin, ChevronDown, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Planner() {
  const { tasks, addTask } = useFirebase();
  const [view, setView] = useState<'monthly' | 'weekly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 20)); // March 20, 2026
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'General', priority: 'Normal' as const, time: '09:00' });
  
  const unassignedTasks = tasks.filter(t => !t.completed);
  const todayTasks = tasks.filter(t => !t.completed && t.time);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    await addTask({
      ...newTask,
      duration: '1h',
      completed: false
    });
    setIsAddingTask(false);
    setNewTask({ title: '', category: 'General', priority: 'Normal', time: '09:00' });
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4 font-display">Planning Flow</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">Map your trajectory. Align your daily execution with your long-term architectural vision.</p>
        </div>
        <div className="flex bg-surface-low p-1.5 rounded-2xl self-start">
          <button 
            onClick={() => setView('monthly')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              view === 'monthly' ? "bg-surface-highest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Monthly
          </button>
          <button 
            onClick={() => setView('weekly')}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-bold transition-all",
              view === 'weekly' ? "bg-surface-highest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Weekly
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Unassigned Tasks */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-low p-6 rounded-3xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-on-surface">Unassigned Tasks</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-high px-2 py-1 rounded">{unassignedTasks.length} Pending</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {unassignedTasks.length > 0 ? (
                unassignedTasks.map(task => (
                  <div key={task.id}>
                    <UnassignedTaskCard 
                      category={task.category} 
                      title={task.title} 
                      date={task.time || "No time"} 
                      color={task.priority === 'High' ? 'primary' : task.priority === 'Routine' ? 'secondary' : 'tertiary'} 
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant text-center py-4">No unassigned tasks</p>
              )}
              
              <button 
                onClick={() => setIsAddingTask(true)}
                className="w-full py-4 border-2 border-dashed border-on-surface-variant/20 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-surface-high hover:border-primary transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Create Assignment
              </button>
            </div>
          </div>

          <div className="bg-primary-container p-6 rounded-3xl text-on-primary overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Flow Optimization</h3>
              <p className="text-on-primary/80 text-sm leading-relaxed mb-6">You have {unassignedTasks.length * 2} hours of focused work remaining this week. 85% of your energy is currently directed at high-impact pillars.</p>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%] rounded-full"></div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary rounded-full blur-3xl opacity-50"></div>
          </div>
        </aside>

        {/* Main Calendar */}
        <section className="lg:col-span-8 bg-surface-low rounded-3xl p-6 lg:p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">{monthName} {year}</h2>
              <div className="flex gap-1">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-surface-high rounded-lg transition-all active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-surface-high rounded-lg transition-all active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              <Calendar size={16} />
              Today
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {view === 'monthly' ? (
              <>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{day}</div>
                ))}
                {Array.from({ length: 14 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "aspect-square p-2 rounded-2xl m-1 transition-all cursor-pointer flex flex-col items-center justify-center relative group",
                      i === 9 ? "bg-primary text-on-primary" : "bg-surface-high/30 hover:bg-surface-high",
                      i < 7 && "opacity-40"
                    )}
                  >
                    <span className="text-xs font-bold">{i + 19 > 31 ? i - 12 : i + 19}</span>
                    {i === 11 && (
                      <div className="mt-1 flex gap-0.5">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <div className="w-1 h-1 bg-tertiary rounded-full"></div>
                      </div>
                    )}
                    {i === 9 && <Pin size={10} className="absolute bottom-2 right-2 opacity-50" />}
                  </div>
                ))}
              </>
            ) : (
              <>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="flex flex-col gap-4 p-4 bg-surface-high/20 rounded-2xl min-h-[300px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">{day}</span>
                    <div className="flex flex-col gap-2">
                      {day === 'Fri' && todayTasks.map(task => (
                        <div key={task.id} className="p-2 bg-primary/10 border-l-2 border-primary rounded text-[10px] font-bold text-primary">
                          {task.title}
                        </div>
                      ))}
                      <button className="w-full py-2 border border-dashed border-on-surface-variant/20 rounded-lg text-[10px] font-bold text-on-surface-variant hover:border-primary transition-all">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
            {view === 'monthly' && (
              <div className="col-span-7 flex items-center justify-center py-8">
                <button className="text-on-surface-variant/50 hover:text-primary transition-all flex flex-col items-center gap-2">
                  <ChevronDown size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Show More</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-on-surface-variant/10 pt-8">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">Today's Timeline</h4>
            <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-on-surface-variant/10">
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <div key={task.id} className="flex gap-6 relative">
                    <div className="z-10 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-surface-high/50 p-4 rounded-2xl">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-bold text-sm text-on-surface">{task.title}</h5>
                        <span className="text-xs text-on-surface-variant">{task.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">{task.category}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-6 relative group">
                  <div className="z-10 w-6 h-6 rounded-full bg-surface-low flex items-center justify-center border-2 border-dashed border-on-surface-variant/30 group-hover:bg-primary/10 group-hover:border-primary transition-all">
                    <Plus size={10} className="text-on-surface-variant group-hover:text-primary" />
                  </div>
                  <div className="flex-1 border-2 border-dashed border-on-surface-variant/10 rounded-2xl p-4 flex items-center justify-center text-on-surface-variant/40 text-xs font-bold uppercase tracking-widest group-hover:bg-primary/5 group-hover:border-primary/20 transition-all cursor-pointer">
                    No tasks scheduled for today
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingTask(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-low rounded-3xl p-8 shadow-2xl border border-on-surface-variant/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">New Assignment</h3>
                <button onClick={() => setIsAddingTask(false)} className="p-2 hover:bg-surface-high rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Task Title</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newTask.title}
                    onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What needs to be built?"
                    className="w-full bg-surface-high border-none rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                    <select 
                      value={newTask.category}
                      onChange={e => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-surface-high border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option>General</option>
                      <option>Design</option>
                      <option>Development</option>
                      <option>Focus</option>
                      <option>Routine</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Priority</label>
                    <select 
                      value={newTask.priority}
                      onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full bg-surface-high border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Routine">Routine</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Scheduled Time</label>
                  <input 
                    type="time" 
                    value={newTask.time}
                    onChange={e => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-surface-high border-none rounded-2xl p-4 text-on-surface focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  Create Assignment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UnassignedTaskCard({ category, title, date, color }: { category: string, title: string, date: string, color: string }) {
  const colorClass = color === 'primary' ? 'border-primary' : color === 'secondary' ? 'border-secondary' : 'border-tertiary';
  const textClass = color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-tertiary';

  return (
    <div className={cn("bg-background p-5 rounded-2xl border-l-4 group cursor-grab active:scale-[0.98] transition-all", colorClass)}>
      <div className="flex justify-between items-start mb-2">
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", textClass)}>{category}</span>
        <GripVertical size={14} className="text-on-surface-variant/30" />
      </div>
      <h3 className="font-bold text-on-surface mb-1">{title}</h3>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-on-surface-variant">
        <Calendar size={12} />
        {date}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

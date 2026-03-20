import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Timer, TrendingUp, Check, PlayCircle, Brain, AlertTriangle, Plus, Trash2, Clock as ClockIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Insight } from '../types';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tighter text-on-surface font-mono">
          {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">24H ARCHITECTURE</span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-medium">System Synchronized</p>
    </div>
  );
}

export default function Dashboard() {
  const { user, tasks, insights, toggleTask, addTask, deleteTask } = useFirebase();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeFocusMode, setActiveFocusMode] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remainingTasks = totalTasks - completedTasks;

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask({
      title: newTaskTitle,
      category: 'Quick Task',
      duration: '15m',
      priority: 'Normal',
      completed: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-medium">{today}</p>
            <h2 className="text-[3.5rem] font-extrabold leading-none tracking-tight text-on-surface font-display">Hello, {user?.displayName?.split(' ')[0] || 'User'}.</h2>
          </div>
          <Clock />
        </div>
        <div className="hidden md:block text-right pb-2">
          <p className="text-on-surface-variant text-sm max-w-xs italic">"The path to clarity begins with a single focused hour."</p>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Progress */}
        <div className="md:col-span-2 relative overflow-hidden bg-surface-low rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute -top-24 -left-24 w-64 h-64 aurora-glow opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold text-on-surface">Daily Progress</h3>
            <p className="text-on-surface-variant max-w-xs">
              {totalTasks > 0 
                ? `You've completed ${progress}% of your planned architecture sprint for today.`
                : "Start your day by adding some tasks to your focus list."}
            </p>
            <div className="flex gap-4 pt-2">
              <div className="px-4 py-2 bg-surface-high rounded-full text-xs font-semibold tracking-wider text-primary">{completedTasks}/{totalTasks} TASKS</div>
              <div className="px-4 py-2 bg-surface-high rounded-full text-xs font-semibold tracking-wider text-on-surface-variant">{remainingTasks} REMAINING</div>
            </div>
          </div>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-highest" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" strokeWidth="8"></circle>
              <motion.circle 
                initial={{ strokeDashoffset: 527 }}
                animate={{ strokeDashoffset: 527 - (527 * progress) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96" cy="96" fill="transparent" r="84" stroke="url(#gradient)" strokeDasharray="527" strokeLinecap="round" strokeWidth="12"
              ></motion.circle>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#83d5c5" />
                  <stop offset="100%" stopColor="#006b5e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-on-surface">{progress}%</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Flow State</span>
            </div>
          </div>
        </div>

        {/* Focus Time Card */}
        <div className="bg-surface-container rounded-3xl p-8 flex flex-col justify-between border-b-2 border-primary/20">
          <div className="space-y-1">
            <Timer className="text-primary" size={24} />
            <h4 className="text-on-surface-variant font-medium text-sm pt-2">Focus Time</h4>
          </div>
          <div className="space-y-1">
            <p className="text-5xl font-extrabold text-on-surface tracking-tighter">
              {(completedTasks * 0.75).toFixed(1)}
              <span className="text-xl text-on-surface-variant font-normal ml-1">h</span>
            </p>
            <p className="text-xs text-primary font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              Estimated based on tasks
            </p>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Today's Focus */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">Today's Focus</h3>
            <form onSubmit={handleQuickAdd} className="flex-1 max-w-xs ml-4 relative">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Quick add task..."
                className="w-full bg-surface-low border border-on-surface-variant/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                <Plus size={18} />
              </button>
            </form>
          </div>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="p-12 text-center bg-surface-low rounded-3xl border-2 border-dashed border-on-surface-variant/10">
                <p className="text-on-surface-variant">No tasks for today. Add one above!</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {tasks.slice(0, 5).map((task) => (
                  <motion.div 
                    key={task.id} 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "group transition-all p-6 rounded-2xl flex items-center gap-6 bg-surface-low hover:bg-surface-high border border-transparent hover:border-primary/10",
                      task.completed && "opacity-60"
                    )}
                  >
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all active:scale-90",
                        task.completed ? "bg-primary border-primary" : "border-on-surface-variant/30 group-hover:border-primary"
                      )}
                    >
                      {task.completed ? <Check size={14} className="text-on-primary" /> : <Check size={14} className="text-transparent group-hover:text-primary" />}
                    </button>
                    <div className="flex-1 relative z-10">
                      <h5 className={cn("text-on-surface font-semibold transition-all", task.completed && "line-through")}>{task.title}</h5>
                      <p className="text-on-surface-variant text-sm">
                        {task.category} • {task.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-surface-container rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{task.priority}</div>
                      <button 
                        onClick={() => deleteTask(task.id)}
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
        </div>

        {/* Insights Sidebar */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-low rounded-3xl p-8 space-y-6">
            <h3 className="text-lg font-bold">Insights</h3>
            <div className="space-y-4">
              {insights.length === 0 ? (
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
                    <Brain size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Getting Started</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Complete more tasks to see personalized productivity insights.</p>
                  </div>
                </div>
              ) : (
                insights.map((insight, idx) => (
                  <button 
                    key={insight.id} 
                    onClick={() => setSelectedInsight(insight)}
                    className={cn(
                      "w-full text-left flex items-start gap-4 group/insight transition-all hover:bg-surface-high p-2 -m-2 rounded-xl", 
                      idx > 0 && "pt-4 mt-2 border-t border-on-surface-variant/10"
                    )}
                  >
                    <div className={cn(
                      "mt-1 w-8 h-8 rounded flex items-center justify-center shrink-0 transition-transform group-hover/insight:scale-110",
                      insight.type === 'productivity' ? "bg-primary-container/20 text-primary" : "bg-tertiary-container/20 text-tertiary"
                    )}>
                      {insight.type === 'productivity' ? <Brain size={18} /> : <AlertTriangle size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover/insight:text-primary transition-colors">{insight.title}</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{insight.description}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="relative group rounded-3xl overflow-hidden aspect-video cursor-pointer" onClick={() => setActiveFocusMode('Coffee Shop Ambient')}>
            <img 
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                activeFocusMode === 'Coffee Shop Ambient' ? "scale-110 grayscale-0 opacity-80" : "grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60"
              )} 
              src="https://picsum.photos/seed/office/600/400" 
              alt="Workspace"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Recommended Setting</p>
                <h4 className="text-sm font-bold">Deep Work: Coffee Shop Ambient</h4>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                activeFocusMode === 'Coffee Shop Ambient' ? "bg-primary text-on-primary scale-110" : "bg-surface-high text-primary group-hover:scale-110"
              )}>
                {activeFocusMode === 'Coffee Shop Ambient' ? <Check size={20} /> : <PlayCircle size={20} />}
              </div>
            </div>
            {activeFocusMode === 'Coffee Shop Ambient' && (
              <div className="absolute top-4 right-4 px-2 py-1 bg-primary text-on-primary text-[8px] font-bold uppercase tracking-widest rounded animate-pulse">
                Active Session
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Insight Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInsight(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface-low rounded-[2rem] p-10 border border-on-surface-variant/10 shadow-2xl"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-8",
                selectedInsight.type === 'productivity' ? "bg-primary-container/20 text-primary" : "bg-tertiary-container/20 text-tertiary"
              )}>
                {selectedInsight.type === 'productivity' ? <Brain size={32} /> : <AlertTriangle size={32} />}
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-4">{selectedInsight.title}</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">{selectedInsight.description}</p>
              <button 
                onClick={() => setSelectedInsight(null)}
                className="w-full py-4 bg-primary text-on-primary font-bold rounded-2xl active:scale-95 transition-all"
              >
                Acknowledge Blueprint
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

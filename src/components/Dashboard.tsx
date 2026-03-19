import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Timer, TrendingUp, Check, PlayCircle, Brain, AlertTriangle, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, tasks, insights, toggleTask, addTask } = useFirebase();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
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
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-medium">{today}</p>
          <h2 className="text-[3.5rem] font-extrabold leading-none tracking-tight text-on-surface font-display">Hello, {user?.displayName?.split(' ')[0] || 'User'}.</h2>
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
              tasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "group transition-all p-6 rounded-2xl flex items-center gap-6 bg-surface-low hover:bg-surface-high",
                    task.completed && "opacity-60"
                  )}
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      task.completed ? "bg-primary border-primary" : "border-on-surface-variant/30 group-hover:border-primary"
                    )}
                  >
                    {task.completed ? <Check size={14} className="text-on-primary" /> : <Check size={14} className="text-transparent group-hover:text-primary" />}
                  </button>
                  <div className="flex-1 relative z-10">
                    <h5 className={cn("text-on-surface font-semibold", task.completed && "line-through")}>{task.title}</h5>
                    <p className="text-on-surface-variant text-sm">
                      {task.category} • {task.duration}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-surface-container rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{task.priority}</div>
                </div>
              ))
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
                  <div key={insight.id} className={cn("flex items-start gap-4", idx > 0 && "pt-4 border-t border-on-surface-variant/10")}>
                    <div className={cn(
                      "mt-1 w-8 h-8 rounded flex items-center justify-center",
                      insight.type === 'productivity' ? "bg-primary-container/20 text-primary" : "bg-tertiary-container/20 text-tertiary"
                    )}>
                      {insight.type === 'productivity' ? <Brain size={18} /> : <AlertTriangle size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{insight.title}</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="relative group rounded-3xl overflow-hidden aspect-video">
            <img 
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-500" 
              src="https://picsum.photos/seed/office/600/400" 
              alt="Workspace"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Recommended Setting</p>
              <h4 className="text-sm font-bold">Deep Work: Coffee Shop Ambient</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

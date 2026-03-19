import React from 'react';
import { INITIAL_TASKS, INSIGHTS } from '../constants';
import { Timer, TrendingUp, Check, PlayCircle, Brain, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const progress = 72;

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-medium">{today}</p>
          <h2 className="text-[3.5rem] font-extrabold leading-none tracking-tight text-on-surface font-display">Hello, Julian.</h2>
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
            <p className="text-on-surface-variant max-w-xs">You've completed 72% of your planned architecture sprint for today.</p>
            <div className="flex gap-4 pt-2">
              <div className="px-4 py-2 bg-surface-high rounded-full text-xs font-semibold tracking-wider text-primary">8/11 TASKS</div>
              <div className="px-4 py-2 bg-surface-high rounded-full text-xs font-semibold tracking-wider text-on-surface-variant">3 REMAINING</div>
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
              <span className="text-4xl font-extrabold text-on-surface">72%</span>
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
            <p className="text-5xl font-extrabold text-on-surface tracking-tighter">5.4<span className="text-xl text-on-surface-variant font-normal ml-1">h</span></p>
            <p className="text-xs text-primary font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              12% from yesterday
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
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {INITIAL_TASKS.slice(0, 3).map((task, index) => (
              <div 
                key={task.id} 
                className={cn(
                  "group transition-all p-6 rounded-2xl flex items-center gap-6",
                  index === 1 ? "bg-surface-high border-l-4 border-primary shadow-xl relative overflow-hidden" : "bg-surface-low hover:bg-surface-high"
                )}
              >
                {index === 1 && <div className="absolute -right-8 -top-8 w-24 h-24 aurora-glow opacity-30"></div>}
                <button className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  index === 1 ? "border-primary" : "border-on-surface-variant/30 group-hover:border-primary"
                )}>
                  {index === 1 ? <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div> : <Check size={14} className="text-transparent group-hover:text-primary" />}
                </button>
                <div className="flex-1 relative z-10">
                  <h5 className={cn("text-on-surface font-semibold", index === 1 && "text-lg font-bold")}>{task.title}</h5>
                  <p className={cn("text-on-surface-variant text-sm", index === 1 && "text-primary font-medium")}>
                    {index === 1 ? `Currently Focusing • ${task.duration}` : `${task.category} • ${task.duration}`}
                  </p>
                </div>
                {index === 1 ? <PlayCircle className="text-primary" fill="currentColor" size={24} /> : <div className="px-3 py-1 bg-surface-container rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{task.priority}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-low rounded-3xl p-8 space-y-6">
            <h3 className="text-lg font-bold">Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
                  <Brain size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Peak Productivity</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">You are most focused between 9:00 AM and 11:30 AM. Try scheduling deep work then.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pt-4 border-t border-on-surface-variant/10">
                <div className="mt-1 w-8 h-8 rounded bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Burnout Alert</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">You've exceeded your daily focus goal by 2 hours. Consider a short walk.</p>
                </div>
              </div>
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

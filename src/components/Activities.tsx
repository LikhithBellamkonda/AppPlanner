import React, { useState } from 'react';
import { INITIAL_TASKS } from '../constants';
import { Search, Check, MoreVertical, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function Activities() {
  const [filter, setFilter] = useState<'In Progress' | 'Completed'>('In Progress');

  const morningTasks = INITIAL_TASKS.filter(t => t.time && parseInt(t.time.split(':')[0]) < 12);
  const afternoonTasks = INITIAL_TASKS.filter(t => t.time && parseInt(t.time.split(':')[0]) >= 12 && parseInt(t.time.split(':')[0]) < 17);
  const eveningTasks = INITIAL_TASKS.filter(t => t.time && parseInt(t.time.split(':')[0]) >= 17);

  return (
    <div className="max-w-3xl mx-auto pb-32">
      {/* Search & Filter */}
      <section className="mb-12 space-y-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={20} />
          <input 
            type="text" 
            placeholder="Search rituals..." 
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
        <TaskSection title="Morning" timeRange="06:00 — 11:59" tasks={morningTasks} />
        <TaskSection title="Afternoon" timeRange="12:00 — 16:59" tasks={afternoonTasks} />
        <TaskSection title="Evening" timeRange="17:00 — 23:59" tasks={eveningTasks} />
      </div>

      {/* FAB */}
      <button className="fixed right-6 bottom-28 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-2xl flex items-center justify-center active:scale-90 transition-transform duration-200 z-40">
        <Plus size={28} />
      </button>
    </div>
  );
}

function TaskSection({ title, timeRange, tasks }: { title: string, timeRange: string, tasks: typeof INITIAL_TASKS }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">{title}</h2>
        <span className="text-[10px] text-primary/60 font-medium">{timeRange}</span>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
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
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  readOnly
                  className={cn(
                    "appearance-none w-6 h-6 rounded-full border transition-all cursor-pointer",
                    task.completed ? "bg-primary border-primary" : "border-on-surface-variant/30",
                    task.progress && "border-primary/40"
                  )}
                />
                {task.completed && <Check size={14} className="absolute text-on-primary" />}
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
        ))}
      </div>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

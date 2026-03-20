import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Bolt, ArrowRight, Lightbulb, TimerOff, Coffee, Repeat, Brain, Activity, Check, X, TrendingUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Insights() {
  const { performance, insights, addTask } = useFirebase();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [synced, setSynced] = React.useState(false);
  const [showDetailedLog, setShowDetailedLog] = useState(false);
  
  // Sort performance data by day if needed, or just use it as is
  const performanceData = performance.length > 0 ? performance : [
    { day: 'Mon', value: 40, type: 'routine' },
    { day: 'Tue', value: 55, type: 'routine' },
    { day: 'Wed', value: 45, type: 'routine' },
    { day: 'Thu', value: 75, type: 'routine' },
    { day: 'Fri', value: 90, type: 'deep' },
    { day: 'Sat', value: 60, type: 'routine' },
    { day: 'Sun', value: 65, type: 'routine' },
  ];

  const avgPerformance = performanceData.reduce((acc, curr) => acc + curr.value, 0) / performanceData.length;

  const handleSyncSchedule = async () => {
    setIsSyncing(true);
    const recommendations = insights.filter(i => i.type === 'recommendation');
    
    const tasksToSync = recommendations.length > 0 
      ? recommendations.map(r => ({
          title: r.title,
          category: 'AI Recommendation',
          duration: '45m',
          priority: 'Normal' as const,
          completed: false,
          time: r.action || '08:00'
        }))
      : [
          { title: "Review Q3 Blueprints", category: "Priority One", duration: "1h", priority: "High" as const, completed: false, time: "08:00" },
          { title: "System Logic Audit", category: "Deep Work", duration: "2h", priority: "High" as const, completed: false, time: "10:30" },
          { title: "Mandatory 15min Walk", category: "Recovery", duration: "15m", priority: "Routine" as const, completed: false, time: "13:00" }
        ];

    try {
      for (const task of tasksToSync) {
        await addTask(task);
      }
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    } catch (error) {
      console.error("Failed to sync schedule:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const improvementInsights = insights.filter(i => i.type === 'insight' || i.type === 'motivation').slice(0, 2);

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary mb-2 block">Intelligence Report</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight font-display">
            Optimizing your <br/> <span className="text-primary">Cognitive Momentum.</span>
          </h1>
        </div>
        <div className="bg-surface-low p-6 rounded-3xl border border-on-surface-variant/15 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
            <Bolt fill="currentColor" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface-variant">Performance Index</p>
            <p className="text-2xl font-bold text-on-surface">{avgPerformance.toFixed(1)}%</p>
          </div>
        </div>
      </section>

      {/* Bento Grid Insights */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Performance Trends */}
        <div className="md:col-span-8 bg-surface-low rounded-3xl p-8 flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="text-xl font-bold mb-1">Performance Trends</h3>
            <p className="text-on-surface-variant text-sm">Focus depth vs. Output over the last 7 days</p>
          </div>
          
          <div className="flex-grow mt-8 mb-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="day" hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1c211f', border: 'none', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'deep' ? '#83d5c5' : 'rgba(173, 205, 197, 0.3)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-on-surface-variant/10">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Deep Focus</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary/30"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Routine</span>
              </div>
            </div>
            <button 
              onClick={() => setShowDetailedLog(true)}
              className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
            >
              View Detailed Log <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Actionable Tip */}
        <div className="md:col-span-4 bg-tertiary text-on-primary rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <Lightbulb className="mb-4" size={32} fill="currentColor" />
            <h3 className="text-2xl font-bold leading-tight mb-4 text-on-primary">
              {insights.length > 0 ? insights[0].title : "Ready for peak focus?"}
            </h3>
            <p className="opacity-90 leading-relaxed text-sm text-on-primary">
              {insights.length > 0 ? insights[0].description : "Complete your daily tasks to generate cognitive momentum analysis."}
            </p>
          </div>
          <button 
            onClick={() => navigate('/planner')}
            className="mt-8 bg-background/20 hover:bg-background/30 text-on-primary font-bold py-3 px-6 rounded-xl active:scale-95 transition-transform text-center"
          >
            Adjust Calendar
          </button>
        </div>

        {/* Improvement Areas */}
        <div className="md:col-span-12 lg:col-span-7 bg-surface-low rounded-3xl p-8 border border-on-surface-variant/10">
          <h3 className="text-xl font-bold mb-6">Where you can improve</h3>
          <div className="space-y-6">
            {improvementInsights.length > 0 ? (
              improvementInsights.map((insight, idx) => (
                <div key={insight.id} className="flex items-start gap-5 p-4 rounded-2xl bg-background/30">
                  <div className={cn(
                    "mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    idx === 0 ? "bg-tertiary-container/20 text-tertiary" : "bg-secondary-container/20 text-secondary"
                  )}>
                    {idx === 0 ? <TrendingUp size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{insight.title}</h4>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{insight.description}</p>
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                      Action: {insight.action || "Optimize workflow"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-start gap-5 p-4 rounded-2xl bg-background/30">
                  <div className="mt-1 w-10 h-10 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center shrink-0">
                    <TimerOff size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Task Switching Fatigue</h4>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">You switched between multiple context categories. This increases your mental load.</p>
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                      Action: Batch similar tasks
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-4 rounded-2xl bg-background/30">
                  <div className="mt-1 w-10 h-10 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                    <Coffee size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Rest Interval Discipline</h4>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">Your focus blocks are exceeding optimal limits. Research shows concentration drops after 90 minutes.</p>
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                      Action: Set break reminders
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recommended for Tomorrow */}
        <div className="md:col-span-12 lg:col-span-5 bg-primary-container text-on-primary rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-20 blur-3xl -mr-10 -mt-10"></div>
          <div className="p-8 relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-6">Recommended for Tomorrow</h3>
              <div className="space-y-4">
                {insights.filter(i => i.type === 'recommendation').length > 0 ? (
                  insights.filter(i => i.type === 'recommendation').map(rec => (
                    <div key={rec.id}>
                      <RecommendationItem icon={Repeat} label="Recommendation" title={rec.title} time={rec.action || "08:00 AM"} />
                    </div>
                  ))
                ) : (
                  <>
                    <RecommendationItem icon={Repeat} label="Priority One" title="Review Q3 Blueprints" time="08:00 AM" />
                    <RecommendationItem icon={Brain} label="Deep Work" title="System Logic Audit" time="10:30 AM" />
                    <RecommendationItem icon={Activity} label="Recovery" title="Mandatory 15min Walk" time="01:00 PM" />
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={handleSyncSchedule}
              disabled={isSyncing || synced}
              className={cn(
                "mt-8 w-full font-bold py-4 rounded-xl shadow-xl shadow-black/20 active:scale-95 transition-all flex items-center justify-center gap-2",
                synced ? "bg-primary text-on-primary" : "bg-primary text-on-primary hover:opacity-90",
                isSyncing && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSyncing ? (
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              ) : synced ? (
                <>
                  <Check size={18} />
                  Synced to Schedule
                </>
              ) : (
                "Sync Schedule"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Log Modal */}
      <AnimatePresence>
        {showDetailedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailedLog(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-low rounded-3xl p-8 shadow-2xl border border-on-surface-variant/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Detailed Performance Log</h3>
                <button onClick={() => setShowDetailedLog(false)} className="p-2 hover:bg-surface-high rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
                {performanceData.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-high/30 border border-on-surface-variant/5">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                        entry.type === 'deep' ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                      )}>
                        {entry.day}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{entry.type === 'deep' ? 'Deep Focus Session' : 'Routine Maintenance'}</p>
                        <p className="text-xs text-on-surface-variant">March {16 + i}, 2026</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-on-surface">{entry.value}%</p>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Efficiency</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowDetailedLog(false)}
                className="mt-8 w-full py-4 bg-surface-high text-on-surface rounded-2xl font-bold hover:bg-surface-highest transition-all"
              >
                Close Log
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecommendationItem({ icon: Icon, label, title, time }: { icon: any, label: string, title: string, time: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5">
      <div className="flex items-center gap-3">
        <Icon className="text-primary" size={20} />
        <div>
          <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">{label}</p>
          <p className="font-semibold text-sm">{title}</p>
        </div>
      </div>
      <span className="text-xs font-bold">{time}</span>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

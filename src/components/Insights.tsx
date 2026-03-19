import React from 'react';
import { PERFORMANCE_TRENDS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Bolt, ArrowRight, Lightbulb, TimerOff, Coffee, Repeat, Brain, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function Insights() {
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
            <p className="text-2xl font-bold text-on-surface">92.4%</p>
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
              <BarChart data={PERFORMANCE_TRENDS}>
                <XAxis dataKey="day" hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1c211f', border: 'none', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {PERFORMANCE_TRENDS.map((entry, index) => (
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
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              View Detailed Log <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Actionable Tip */}
        <div className="md:col-span-4 bg-tertiary text-on-primary rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <Lightbulb className="mb-4" size={32} fill="currentColor" />
            <h3 className="text-2xl font-bold leading-tight mb-4 text-on-primary">You hit your peak at 10:15 AM yesterday.</h3>
            <p className="opacity-90 leading-relaxed text-sm text-on-primary">AI analysis suggests moving your "Heavy Architecture" tasks 45 minutes earlier to capitalize on your natural cortisol spike.</p>
          </div>
          <button className="mt-8 bg-background/20 hover:bg-background/30 text-on-primary font-bold py-3 px-6 rounded-xl active:scale-95 transition-transform text-center">
            Adjust Calendar
          </button>
        </div>

        {/* Improvement Areas */}
        <div className="md:col-span-12 lg:col-span-7 bg-surface-low rounded-3xl p-8 border border-on-surface-variant/10">
          <h3 className="text-xl font-bold mb-6">Where you can improve</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-5 p-4 rounded-2xl bg-background/30">
              <div className="mt-1 w-10 h-10 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center shrink-0">
                <TimerOff size={20} />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Task Switching Fatigue</h4>
                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">You switched between 4 different context categories in 60 minutes. This increased your mental load by 22%.</p>
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
                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">Your 2nd focus block exceeded 110 minutes. Research shows concentration drops significantly after 90 minutes.</p>
                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                  Action: Set break reminders
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended for Tomorrow */}
        <div className="md:col-span-12 lg:col-span-5 bg-primary-container text-on-primary rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-20 blur-3xl -mr-10 -mt-10"></div>
          <div className="p-8 relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-6">Recommended for Tomorrow</h3>
              <div className="space-y-4">
                <RecommendationItem icon={Repeat} label="Priority One" title="Review Q3 Blueprints" time="08:00 AM" />
                <RecommendationItem icon={Brain} label="Deep Work" title="System Logic Audit" time="10:30 AM" />
                <RecommendationItem icon={Activity} label="Recovery" title="Mandatory 15min Walk" time="01:00 PM" />
              </div>
            </div>
            <button className="mt-8 w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-xl shadow-black/20 active:scale-95 transition-all">
              Sync Schedule
            </button>
          </div>
        </div>
      </div>
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

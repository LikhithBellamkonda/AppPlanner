import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Lightbulb, CalendarDays, Bell, Menu, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TopBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-3">
        <button className="text-primary hover:bg-white/5 p-2 rounded-lg active:scale-95 transition-all md:hidden">
          <Menu size={20} />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-high border border-primary/10">
          <img 
            className="w-full h-full object-cover" 
            src="https://picsum.photos/seed/user/100/100" 
            alt="User avatar"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-xl font-bold tracking-tighter text-primary font-display">Luminance</h1>
      </div>
      
      <div className="hidden md:flex items-center gap-8 mr-8">
        <NavLink to="/" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Dashboard</NavLink>
        <NavLink to="/activities" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Activities</NavLink>
        <NavLink to="/insights" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Insights</NavLink>
        <NavLink to="/planner" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Planner</NavLink>
        <NavLink to="/frames-to-video" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Video</NavLink>
      </div>

      <button className="text-primary hover:opacity-80 transition-opacity active:scale-95">
        <Bell size={20} />
      </button>
    </header>
  );
}

export function BottomNav() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/activities', icon: ListTodo, label: 'Activities' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
    { to: '/planner', icon: CalendarDays, label: 'Planner' },
    { to: '/frames-to-video', icon: Video, label: 'Video' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 glass-nav md:hidden">
      <div className="flex justify-around items-center px-4 pb-8 pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 active:scale-90",
              isActive ? "bg-primary-container text-primary" : "text-on-surface-variant hover:text-primary"
            )}
          >
            <item.icon size={20} />
            <span className="font-display text-[10px] font-medium uppercase tracking-widest mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-32 md:pb-0 md:pl-0">
      <TopBar />
      <main className="pt-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}

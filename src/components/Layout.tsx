import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Lightbulb, CalendarDays, Bell, BellOff, Menu, LogOut, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useFirebase } from '../context/FirebaseContext';
import { useTheme } from '../context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TopBar() {
  const { notificationsEnabled, toggleNotifications, signOut } = useFirebase();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-on-surface-variant/5">
      <div className="flex items-center gap-3">
        <button className="text-primary hover:bg-white/5 p-2 rounded-lg active:scale-95 transition-all md:hidden">
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-high border border-primary/10 group-hover:border-primary/40 transition-all">
            <img 
              className="w-full h-full object-cover" 
              src="https://picsum.photos/seed/user/100/100" 
              alt="User avatar"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-primary font-display group-hover:scale-105 transition-transform">Luminance</h1>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-8 mr-8">
        <NavLink to="/" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Dashboard</NavLink>
        <NavLink to="/activities" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Activities</NavLink>
        <NavLink to="/insights" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Insights</NavLink>
        <NavLink to="/planner" className={({ isActive }) => cn("text-sm font-medium transition-colors", isActive ? "text-primary" : "text-on-surface-variant hover:text-primary")}>Planner</NavLink>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="text-on-surface-variant hover:text-primary hover:bg-white/5 p-2 rounded-full transition-all active:scale-95"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={toggleNotifications}
          className={cn(
            "transition-all active:scale-95 p-2 rounded-full",
            notificationsEnabled ? "text-primary bg-primary/10" : "text-on-surface-variant hover:bg-white/5"
          )}
          title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
        >
          {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
        </button>
        
        <button 
          onClick={signOut}
          className="text-on-surface-variant hover:text-error hover:bg-error/10 p-2 rounded-full transition-all active:scale-95"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export function BottomNav() {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/activities', icon: ListTodo, label: 'Activities' },
    { to: '/insights', icon: Lightbulb, label: 'Insights' },
    { to: '/planner', icon: CalendarDays, label: 'Planner' },
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

import { Task, Insight, PerformanceData } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Refactor Navigation Logic',
    category: 'Design System Module',
    duration: '45m',
    priority: 'High',
    completed: false,
    time: '09:00',
  },
  {
    id: '2',
    title: 'Luminance UI Implementation',
    category: 'Currently Focusing',
    duration: '2h 15m',
    priority: 'High',
    completed: false,
    time: '11:30',
    progress: 72,
  },
  {
    id: '3',
    title: 'Review Stakeholder Feedback',
    category: 'Project Sanctuary',
    duration: '1h',
    priority: 'Normal',
    completed: false,
    time: '14:00',
  },
  {
    id: '4',
    title: 'Digital Meditation',
    category: 'Focus',
    duration: '20m',
    priority: 'Routine',
    completed: false,
    time: '07:30',
  },
  {
    id: '5',
    title: 'Deep Hydration Ritual',
    category: 'Habit',
    duration: '5m',
    priority: 'Routine',
    completed: true,
    time: '08:00',
  },
  {
    id: '6',
    title: 'Strategic Design Sprint',
    category: 'Work',
    duration: '1h 45m remaining',
    priority: 'High',
    completed: false,
    time: '13:00',
    progress: 64,
  },
  {
    id: '7',
    title: 'Reflection & Log',
    category: 'Journaling',
    duration: '15m',
    priority: 'Urgent',
    completed: false,
    time: '19:00',
  }
];

export const INSIGHTS: Insight[] = [
  {
    id: '1',
    title: 'Peak Productivity',
    description: 'You are most focused between 9:00 AM and 11:30 AM. Try scheduling deep work then.',
    type: 'productivity',
  },
  {
    id: '2',
    title: 'Burnout Alert',
    description: "You've exceeded your daily focus goal by 2 hours. Consider a short walk.",
    type: 'alert',
  }
];

export const PERFORMANCE_TRENDS: PerformanceData[] = [
  { day: 'Mon', value: 40, type: 'routine' },
  { day: 'Tue', value: 55, type: 'routine' },
  { day: 'Wed', value: 45, type: 'routine' },
  { day: 'Thu', value: 75, type: 'routine' },
  { day: 'Fri', value: 90, type: 'deep' },
  { day: 'Sat', value: 60, type: 'routine' },
  { day: 'Sun', value: 65, type: 'routine' },
];

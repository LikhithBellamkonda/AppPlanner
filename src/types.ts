export interface Task {
  id: string;
  title: string;
  category: string;
  duration: string;
  priority: 'High' | 'Normal' | 'Urgent' | 'Routine';
  completed: boolean;
  time?: string;
  progress?: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'productivity' | 'alert' | 'recommendation';
  action?: string;
}

export interface PerformanceData {
  day: string;
  value: number;
  type: 'deep' | 'routine';
}

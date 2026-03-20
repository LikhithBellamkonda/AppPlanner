import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from '../firebase';
import { Task, Insight, PerformanceData } from '../types';
import { generateDynamicInsights } from '../services/geminiService';

interface FirebaseContextType {
  user: FirebaseUser | null;
  loading: boolean;
  tasks: Task[];
  insights: Insight[];
  performance: PerformanceData[];
  login: () => Promise<void>;
  signOut: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('luminance_notifications');
    return saved ? JSON.parse(saved) : true;
  });

  const playNotificationSound = () => {
    if (!notificationsEnabled) return;
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Error playing notification sound:', err));
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('luminance_notifications', JSON.stringify(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Ensure user document exists
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          // New user, seed initial data
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: Timestamp.now(),
            isNewUser: true
          });

          // Seed Performance Data
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          for (const day of days) {
            await addDoc(collection(db, 'performance'), {
              userId: user.uid,
              day,
              value: Math.floor(Math.random() * 60) + 30,
              type: Math.random() > 0.5 ? 'deep' : 'routine',
              createdAt: Timestamp.now()
            });
          }

          // Seed Initial Insight
          await addDoc(collection(db, 'insights'), {
            userId: user.uid,
            title: 'Welcome to Luminance',
            description: 'Your architectural journey begins. Select a blueprint from Activities to start your first sprint.',
            type: 'productivity',
            createdAt: Timestamp.now()
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for tasks
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      // Check for new tasks to play sound
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // Only play sound if it's not the initial load
          // We can check if the task was created very recently
          const data = change.doc.data();
          const createdAt = data.createdAt as Timestamp;
          if (createdAt && (Date.now() - createdAt.toMillis() < 5000)) {
            playNotificationSound();
          }
        }
      });

      setTasks(taskList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });

    return () => unsubscribe();
  }, [user]);

  // Dynamic Insights Effect
  useEffect(() => {
    if (!user || tasks.length === 0 || isGeneratingInsights) return;

    const refreshInsights = async () => {
      setIsGeneratingInsights(true);
      try {
        const newInsights = await generateDynamicInsights(tasks);
        
        // Clear old insights and add new ones
        const q = query(collection(db, 'insights'), where('userId', '==', user.uid));
        const snapshot = await onSnapshot(q, (s) => {
           // This is just to get the current ones to delete, but better to just overwrite or add
        });
        
        // For simplicity in this demo, we'll just add one new one if it's been a while
        // or if the task list changed significantly. 
        // Real implementation would be more sophisticated.
        if (newInsights[0]) {
          await addDoc(collection(db, 'insights'), {
            ...newInsights[0],
            userId: user.uid,
            createdAt: Timestamp.now()
          });
        }
      } catch (error) {
        console.error("Failed to refresh insights:", error);
      } finally {
        setIsGeneratingInsights(false);
      }
    };

    const timer = setTimeout(refreshInsights, 30000); // Refresh every 30s if tasks change
    return () => clearTimeout(timer);
  }, [tasks.length, user]);

  // Listen for insights
  useEffect(() => {
    if (!user) {
      setInsights([]);
      return;
    }

    const q = query(collection(db, 'insights'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const insightList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Insight[];
      setInsights(insightList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'insights');
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for performance
  useEffect(() => {
    if (!user) {
      setPerformance([]);
      return;
    }

    const q = query(collection(db, 'performance'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const perfList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as PerformanceData[];
      setPerformance(perfList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'performance');
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tasks');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${id}`);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${id}`);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  return (
    <FirebaseContext.Provider value={{ 
      user, 
      loading, 
      tasks, 
      insights, 
      performance, 
      login: signInWithGoogle, 
      signOut: logout,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      notificationsEnabled,
      toggleNotifications
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from '../firebase';
import { Task, Insight, PerformanceData } from '../types';

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
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);

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

          // Seed Tasks
          const initialTasks = [
            { title: 'Refactor Navigation Logic', category: 'Design System', duration: '45m', priority: 'High', completed: false, time: '09:00' },
            { title: 'Luminance UI Implementation', category: 'Currently Focusing', duration: '2h 15m', priority: 'High', completed: false, time: '11:30', progress: 72 },
            { title: 'Digital Meditation', category: 'Focus', duration: '20m', priority: 'Routine', completed: false, time: '07:30' },
          ];

          for (const task of initialTasks) {
            await addDoc(collection(db, 'tasks'), { ...task, userId: user.uid, createdAt: Timestamp.now() });
          }

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

          // Seed Insights
          await addDoc(collection(db, 'insights'), {
            userId: user.uid,
            title: 'Peak Productivity',
            description: 'You are most focused between 9:00 AM and 11:30 AM. Try scheduling deep work then.',
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
      setTasks(taskList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });

    return () => unsubscribe();
  }, [user]);

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
      toggleTask
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

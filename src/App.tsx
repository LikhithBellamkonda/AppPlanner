import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Insights from './components/Insights';
import Planner from './components/Planner';
import FramesToVideo from './components/FramesToVideo';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { LogIn } from 'lucide-react';

function AppContent() {
  const { user, loading, login } = useFirebase();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <LogIn size={48} className="text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-on-surface mb-4">Welcome to Luminance</h1>
        <p className="text-on-surface-variant max-w-md mb-12">
          Your architectural space for deep work and cognitive tracking. Sign in to start your journey.
        </p>
        <button
          onClick={login}
          className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/frames-to-video" element={<FramesToVideo />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </Router>
  );
}

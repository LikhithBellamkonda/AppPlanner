import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Insights from './components/Insights';
import Planner from './components/Planner';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </Layout>
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Drivers = lazy(() => import('./pages/Drivers.jsx'));
const Teams = lazy(() => import('./pages/Teams.jsx'));
const Races = lazy(() => import('./pages/Races.jsx'));
const Standings = lazy(() => import('./pages/Standings.jsx'));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Suspense fallback={<div/>}><Dashboard /></Suspense>} />
          <Route path="drivers" element={<Suspense fallback={<div/>}><Drivers /></Suspense>} />
          <Route path="teams" element={<Suspense fallback={<div/>}><Teams /></Suspense>} />
          <Route path="races" element={<Suspense fallback={<div/>}><Races /></Suspense>} />
          <Route path="standings" element={<Suspense fallback={<div/>}><Standings /></Suspense>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
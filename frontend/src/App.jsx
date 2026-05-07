import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Drivers from './pages/Drivers.jsx';
import Teams from './pages/Teams.jsx';
import Races from './pages/Races.jsx';
import Standings from './pages/Standings.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="teams" element={<Teams />} />
          <Route path="races" element={<Races />} />
          <Route path="standings" element={<Standings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
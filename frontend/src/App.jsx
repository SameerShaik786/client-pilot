import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { ClientDetail } from './pages/ClientDetail';
import { ProjectDetail } from './pages/ProjectDetail';
import { LandingPage } from './pages/LandingPage';
import { AuthLayout } from './pages/AuthLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

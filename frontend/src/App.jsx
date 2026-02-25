import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { ClientDetail } from './pages/ClientDetail';
import { Clients } from './pages/Clients';
import { ProjectDetail } from './pages/ProjectDetail';
import { AuthLayout } from './pages/AuthLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function ProtectedLayout() {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected Routes — nested under AppLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
            <Route path="/clients/:clientId/projects/:projectId" element={<ProjectDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#171717',
            color: '#fff',
            border: '1px solid #262626',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;

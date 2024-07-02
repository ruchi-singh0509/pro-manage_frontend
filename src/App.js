import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import SideNav from './pages/SideNav';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Analytics from './pages/analytics';
import TaskPage from './pages/TaskPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/taskmanager" element={<SideNav />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/task/:id" element={<TaskPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
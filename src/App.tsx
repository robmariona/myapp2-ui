import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ClaimForm from './components/ClaimForm';
import Auth from './pages/Auth'; // Add this import
// We will create the LoginPage next
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FileClaim from './pages/FileClaim';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file-claim" element={<ClaimForm />} />
          <Route path="/login" element={<Auth />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/file-claim" element={<FileClaim />} />
        </Routes>
        
        <footer className="bg-gray-900 text-white py-12 text-center mt-20">
          <p>© 2026 Almacen Insurance Group. Trusted Worldwide.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
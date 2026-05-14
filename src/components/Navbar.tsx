import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, FileText, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <ShieldCheck className="text-praxent-blue" size={32} />
          <span className="text-xl font-bold tracking-tight text-gray-800">
            ALMACEN <span className="text-praxent-blue">INSURANCE</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-praxent-blue no-underline text-gray-600">Home</Link>
          
          {/* Dashboard only visible if logged in */}
          {token && (
            <Link to="/dashboard" className="flex items-center gap-1 hover:text-praxent-blue no-underline text-gray-600">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}

          <Link to="/file-claim" className="bg-praxent-blue/10 text-praxent-blue px-4 py-2 rounded-full flex items-center gap-2 hover:bg-praxent-blue hover:text-white transition-all no-underline">
            <FileText size={16} /> File a Claim
          </Link>
        </div>

        <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
          {!token ? (
            <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-praxent-blue font-semibold no-underline">
              <User size={20} />
              <span>Client Login</span>
            </Link>
          ) : (
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold border-none bg-transparent cursor-pointer">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
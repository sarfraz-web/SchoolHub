import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBasedLinks = () => {
    if (!user) return [];
    
    const baseLinks = [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/notices', label: 'Notices' }
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseLinks,
          { to: '/students', label: 'Students' },
          { to: '/attendance', label: 'Attendance' },
          { to: '/exams', label: 'Exams' },
          { to: '/fees', label: 'Fees' }
        ];
      case 'teacher':
        return [
          ...baseLinks,
          { to: '/students', label: 'Students' },
          { to: '/attendance', label: 'Attendance' },
          { to: '/exams', label: 'Exams' }
        ];
      case 'student':
        return [
          ...baseLinks,
          { to: '/profile', label: 'My Profile' },
          { to: '/attendance', label: 'My Attendance' },
          { to: '/marks', label: 'My Marks' },
          { to: '/fees', label: 'My Fees' }
        ];
      case 'parent':
        return [
          ...baseLinks,
          { to: '/profile', label: 'Student Profile' },
          { to: '/attendance', label: 'Attendance' },
          { to: '/marks', label: 'Marks' },
          { to: '/fees', label: 'Fees' }
        ];
      default:
        return baseLinks;
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold">SchoolHub</span>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                {getRoleBasedLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="hover:text-blue-200 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* User Info & Logout - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-xs sm:text-sm">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {user && isMobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-500">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {getRoleBasedLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-blue-500 pt-2 mt-2">
                <div className="px-3 py-2 text-sm text-blue-200">
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

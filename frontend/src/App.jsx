import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Installation from './pages/Installation';
import Settings from './pages/Settings';
import Demo from './pages/Demo';
import CampaignLanding from './pages/CampaignLanding';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center space-x-8">
              <NavLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#FF492C' }}>
                  <svg viewBox="0 0 32 32" fill="white" className="w-full h-full p-1">
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="bold">G2</text>
                  </svg>
                </div>
                <h1 className="text-xl font-bold" style={{ color: '#FF492C' }}>
                  Pulse
                </h1>
              </NavLink>

              {/* Center: Navigation Tabs */}
              <div className="flex space-x-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/demo"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  Demo
                </NavLink>
                <NavLink
                  to="/installation"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  Installation
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  Settings
                </NavLink>
              </div>
            </div>

            {/* Right: myG2 label */}
            <div className="text-sm text-gray-500 font-medium">
              myG2
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/installation" element={<Installation />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/campaign/:campaignId" element={<CampaignLanding />} />
      </Routes>
    </div>
  );
}

export default App;

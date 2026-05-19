import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
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
              <h1 className="text-xl font-bold" style={{ color: '#FF492C' }}>
                G2 Pulse
              </h1>

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
                  to="/settings"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  Campaign Settings
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
        <Route path="/settings" element={<Settings />} />
        <Route path="/campaign/:campaignId" element={<CampaignLanding />} />
      </Routes>
    </div>
  );
}

export default App;

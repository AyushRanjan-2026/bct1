import { useState } from 'react';
import PatientDashboard from './PatientDashboard';
import InsurerDashboard from './InsurerDashboard';
import ProviderDashboard from './ProviderDashboard';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('patient');

  const tabs = [
    { id: 'patient', label: 'Patient', icon: '👤' },
    { id: 'insurer', label: 'Insurer', icon: '🏢' },
    { id: 'provider', label: 'Provider', icon: '🏥' },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">MPA</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Medical Policy Automation
              </h1>
            </div>
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {activeTab === 'patient' && <PatientDashboard />}
        {activeTab === 'insurer' && <InsurerDashboard />}
        {activeTab === 'provider' && <ProviderDashboard />}
      </main>
    </div>
  );
}

export default App;


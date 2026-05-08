import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import MapView from './components/MapView';
import Analytics from './components/Analytics';
import AIChat from './components/AIChat';
import { Package, Map as MapIcon, Activity, MessageSquare } from 'lucide-react';

const socket = io('http://localhost:5000');

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchDrivers();
    fetchOrders();

    socket.on('driverLocationUpdate', (data) => {
      setDrivers(prevDrivers => 
        prevDrivers.map(d => 
          d._id === data.driverId ? { ...d, location: data.location } : d
        )
      );
    });

    return () => {
      socket.off('driverLocationUpdate');
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/analytics');
      setAnalyticsData(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Package size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            LogiTrack AI
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("map")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "map" ? "bg-green-700 shadow-lg shadow-blue-500/30 text-white" : "hover:bg-slate-700 text-slate-300 border-2"}`}
          >
            <MapIcon size={20} />
            <span className="font-bold">Live Map</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "analytics" ? "bg-blue-600 shadow-lg shadow-blue-500/30 text-white" : "hover:bg-slate-700 text-slate-300 border-2"}`}
          >
            <Activity size={20} />
            <span className="font-bold shadow-amber-900">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "ai" ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white" : "hover:bg-slate-700 text-slate-300 border-2"}`}
          >
            <MessageSquare size={20} />
            <span className="font-bold shadow-2xl">AI Insights</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 relative bg-slate-900 z-10">
        {activeTab === "map" && <MapView drivers={drivers} orders={orders} />}
        {activeTab === "analytics" && (
          <Analytics data={analyticsData} drivers={drivers} orders={orders} />
        )}
        {activeTab === "ai" && <AIChat />}
      </div>
    </div>
  );
}

export default App;

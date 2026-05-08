import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden group hover:border-slate-600 transition-colors">
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 ${colorClass}`} />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-slate-400 font-medium mb-1">{title}</p>
        <h3 className="text-4xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass.replace('bg-', 'bg-opacity-20 text-').replace('500', '400')}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Analytics = ({ data, drivers, orders }) => {
  if (!data) return <div className="p-8 text-center text-slate-400">Loading analytics...</div>;

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-white">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Orders" 
            value={data.totalOrders} 
            icon={Package} 
            colorClass="bg-blue-500" 
          />
          <StatCard 
            title="Active Drivers" 
            value={data.activeDrivers} 
            icon={Truck} 
            colorClass="bg-emerald-500" 
          />
          <StatCard 
            title="Delivered" 
            value={data.deliveredOrders} 
            icon={CheckCircle} 
            colorClass="bg-purple-500" 
          />
          <StatCard 
            title="Pending/In-Transit" 
            value={data.pendingOrders} 
            icon={Clock} 
            colorClass="bg-amber-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Truck className="text-blue-400" size={20} /> Driver Status
            </h3>
            <div className="space-y-4">
              {drivers.map(driver => (
                <div key={driver._id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{driver.name}</p>
                      <p className="text-sm text-slate-400">Lat: {driver.location?.lat?.toFixed(4) || 'N/A'}, Lng: {driver.location?.lng?.toFixed(4) || 'N/A'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                    driver.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    driver.status === 'on_delivery' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {driver.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
              ))}
              {drivers.length === 0 && <p className="text-slate-500 text-center py-4">No drivers found.</p>}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Package className="text-indigo-400" size={20} /> Recent Orders
            </h3>
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <div>
                    <p className="font-semibold text-slate-200">{order.id} - {order.customerName}</p>
                    <p className="text-sm text-slate-400">Driver: {order.assignedDriver?.name || 'Unassigned'}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                    order.status === 'delivered' ? 'bg-purple-500/20 text-purple-400' :
                    order.status === 'out_for_delivery' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {order.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
              ))}
              {orders.length === 0 && <p className="text-slate-500 text-center py-4">No orders found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2933/2933939.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const orderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/685/685388.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

const MapView = ({ drivers, orders }) => {
  const defaultCenter = [28.6139, 77.209];

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={15} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />


        {drivers.map(driver => (
          driver.location && driver.location.lat && driver.location.lng && (
            <Marker 
              key={driver._id} 
              position={[driver.location.lat, driver.location.lng]}
              icon={driverIcon}
            >
              <Popup>
                <div className="text-slate-800 font-sans">
                  <h3 className="font-bold">{driver.name}</h3>
                  <p className="text-sm">Status: <span className="font-medium text-blue-600 capitalize">{driver.status?.replace('_', ' ') || 'Unknown'}</span></p>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {orders.map(order => {
          const assignedDriver = order.assignedDriver ? drivers.find(d => d._id === order.assignedDriver._id || d._id === order.assignedDriver) : null;

          return order.deliveryLocation && order.deliveryLocation.lat && order.deliveryLocation.lng && (
            <React.Fragment key={order._id}>
              <Marker 
                position={[order.deliveryLocation.lat, order.deliveryLocation.lng]}
                icon={orderIcon}
              >
                <Popup>
                  <div className="text-slate-800 font-sans">
                    <h3 className="font-bold">Order: {order.id}</h3>
                    <p className="text-sm">Customer: {order.customerName}</p>
                    <p className="text-sm">Status: <span className="font-medium text-amber-600 capitalize">{order.status?.replace('_', ' ') || 'Unknown'}</span></p>
                  </div>
                </Popup>
              </Marker>
              
              {assignedDriver && assignedDriver.location && assignedDriver.location.lat && assignedDriver.location.lng && (
                <Polyline 
                  positions={[
                    [assignedDriver.location.lat, assignedDriver.location.lng],
                    [order.deliveryLocation.lat, order.deliveryLocation.lng]
                  ]}
                  color="#3b82f6"
                  weight={3}
                  dashArray="5, 10"
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
      
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 text-slate-800 z-[1000]">
        <h3 className="font-bold mb-2">Legend</h3>
        <div className="flex items-center gap-2 mb-2">
          <img src="https://cdn-icons-png.flaticon.com/512/2933/2933939.png" className="w-5 h-5" alt="Driver" />
          <span className="text-sm font-medium">Active Driver</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/685/685388.png" className="w-5 h-5" alt="Order" />
          <span className="text-sm font-medium">Delivery Destination</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;

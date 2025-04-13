
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BluetoothDeviceList from '@/components/BluetoothDeviceList';

const ConnectPage: React.FC = () => {
  const navigate = useNavigate();

  const handleConnect = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-agribot-background">
      <Header title="Connect to Device" />
      
      <main className="flex-1 container py-6 space-y-6 max-w-lg mx-auto">
        <div className="p-4 bg-white rounded-lg shadow">
          <BluetoothDeviceList onConnect={handleConnect} />
        </div>
        
        <div className="p-4 bg-muted/50 rounded-lg border border-muted">
          <h3 className="font-semibold mb-2">Connection Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Make sure Bluetooth is enabled on your device</li>
            <li>AgriBot should be powered on and within range</li>
            <li>If the device doesn't appear, try refreshing the list</li>
            <li>For HC-05 modules, the default PIN is usually "1234" or "0000"</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ConnectPage;

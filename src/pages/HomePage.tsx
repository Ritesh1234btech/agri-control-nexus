
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bluetooth, History, Settings, Tractor } from 'lucide-react';
import Header from '@/components/Header';
import SensorDisplay from '@/components/SensorDisplay';
import ControlPanel from '@/components/ControlPanel';
import { Button } from '@/components/ui/button';
import { bluetoothService } from '@/services/BluetoothService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(bluetoothService.isConnected());

  React.useEffect(() => {
    const connectionListener = (connected: boolean) => {
      setIsConnected(connected);
    };

    bluetoothService.addConnectionListener(connectionListener);

    return () => {
      bluetoothService.removeConnectionListener(connectionListener);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-agribot-background">
      <Header />
      
      <main className="flex-1 container py-6 max-w-lg mx-auto space-y-6">
        <div className="flex flex-col items-center justify-center gap-6 mb-6">
          <div className="bg-white rounded-full p-3 shadow-md">
            <Tractor size={48} className="text-agribot-green" />
          </div>
          <h1 className="text-2xl font-bold text-center">AgriBot Controller</h1>
        </div>
        
        {!isConnected && (
          <Button 
            onClick={() => navigate('/connect')}
            className="w-full py-6 text-lg flex items-center gap-2 bg-agribot-green hover:bg-agribot-green/90"
          >
            <Bluetooth size={20} />
            Connect to AgriBot
          </Button>
        )}
        
        <section>
          <SensorDisplay />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Control Panel</h2>
          <ControlPanel />
        </section>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button 
            variant="outline" 
            className="py-6 h-auto flex flex-col items-center gap-2"
            onClick={() => navigate('/history')}
          >
            <History size={24} />
            <span>Data History</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="py-6 h-auto flex flex-col items-center gap-2"
            onClick={() => navigate('/settings')}
          >
            <Settings size={24} />
            <span>Settings</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

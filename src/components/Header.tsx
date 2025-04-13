
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Menu, Bluetooth, BluetoothOff, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bluetoothService } from '@/services/BluetoothService';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'AgriBot Controller' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConnected, setIsConnected] = React.useState(bluetoothService.isConnected());

  React.useEffect(() => {
    const connectionListener = (connected: boolean) => {
      setIsConnected(connected);
    };

    bluetoothService.addConnectionListener(connectionListener);

    return () => {
      bluetoothService.removeConnectionListener(connectionListener);
    };
  }, []);

  const handleBackButton = () => {
    navigate(-1);
  };

  const handleMenuButton = () => {
    navigate('/settings');
  };

  const showBackButton = location.pathname !== '/';

  return (
    <header className="sticky top-0 bg-agribot-green text-white p-4 flex items-center justify-between shadow-md z-10">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-agribot-green/80"
            onClick={handleBackButton}
          >
            <ArrowLeft size={24} />
          </Button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Bluetooth size={22} className="text-white animate-pulse-slow" />
        ) : (
          <BluetoothOff size={22} className="text-white/70" />
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-agribot-green/80"
          onClick={handleMenuButton}
        >
          <MoreVertical size={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;

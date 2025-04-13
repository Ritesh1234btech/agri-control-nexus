
import React, { useState, useEffect } from 'react';
import { Bluetooth, Check, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bluetoothService, BluetoothDevice } from '@/services/BluetoothService';
import { toast } from '@/components/ui/use-toast';

interface BluetoothDeviceListProps {
  onConnect?: () => void;
}

const BluetoothDeviceList: React.FC<BluetoothDeviceListProps> = ({ onConnect }) => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const foundDevices = await bluetoothService.scanForDevices();
      setDevices(foundDevices);
    } catch (error) {
      toast({
        title: "Scanning Failed",
        description: "Could not scan for Bluetooth devices. Please check your permissions.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    handleScan();
  }, []);

  const handleConnect = async (device: BluetoothDevice) => {
    setSelectedDevice(device);
    setIsConnecting(true);
    
    if (!device.isTrusted) {
      toast({
        title: "Untrusted Device",
        description: "Warning: You are connecting to an untrusted device.",
        variant: "destructive"
      });
    }
    
    try {
      const success = await bluetoothService.connectToDevice(device.id);
      
      if (success) {
        toast({
          title: "Connected",
          description: `Successfully connected to ${device.name}`,
        });
        
        if (onConnect) {
          onConnect();
        }
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to the device. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to the device.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
      setSelectedDevice(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await handleScan();
    setIsRefreshing(false);
  };

  const connectedDevice = bluetoothService.getConnectedDevice();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bluetooth /> Available Devices
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing || isScanning}
          className="flex items-center gap-1"
        >
          <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>
      
      {isScanning && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-agribot-green border-r-transparent"></div>
          <p className="mt-2">Scanning for devices...</p>
        </div>
      )}
      
      {!isScanning && devices.length === 0 && (
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <p>No Bluetooth devices found.</p>
          <Button onClick={handleScan} className="mt-2">Scan Again</Button>
        </div>
      )}
      
      <div className="space-y-2">
        {devices.map(device => (
          <div 
            key={device.id} 
            className={`
              p-3 rounded-md flex justify-between items-center border
              ${connectedDevice?.id === device.id ? 'bg-muted border-agribot-green' : 'bg-card border-border'}
              ${selectedDevice?.id === device.id && isConnecting ? 'animate-pulse' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <Bluetooth 
                size={20} 
                className={connectedDevice?.id === device.id ? "text-agribot-green" : "text-muted-foreground"} 
              />
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-xs text-muted-foreground">{device.id}</p>
              </div>
              {!device.isTrusted && (
                <AlertTriangle size={16} className="text-amber-500" aria-label="Untrusted Device" />
              )}
            </div>
            
            <div>
              {connectedDevice?.id === device.id ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => bluetoothService.disconnect()}
                  className="min-w-20"
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleConnect(device)}
                  disabled={isConnecting}
                  className="min-w-20"
                >
                  {isConnecting && selectedDevice?.id === device.id ? (
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      Connecting
                    </span>
                  ) : (
                    'Connect'
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BluetoothDeviceList;

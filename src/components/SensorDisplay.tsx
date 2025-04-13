
import React, { useState, useEffect } from 'react';
import { Droplets, Battery, AlertTriangle } from 'lucide-react';
import { bluetoothService, SensorData } from '@/services/BluetoothService';
import { Progress } from '@/components/ui/progress';

const SensorDisplay: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    soilMoisture: 0,
    batteryLevel: 100,
    timestamp: new Date()
  });
  
  const [isConnected, setIsConnected] = useState(bluetoothService.isConnected());

  useEffect(() => {
    const sensorDataListener = (data: SensorData) => {
      setSensorData(data);
    };
    
    const connectionListener = (connected: boolean) => {
      setIsConnected(connected);
    };
    
    bluetoothService.addSensorDataListener(sensorDataListener);
    bluetoothService.addConnectionListener(connectionListener);
    
    return () => {
      bluetoothService.removeSensorDataListener(sensorDataListener);
      bluetoothService.removeConnectionListener(connectionListener);
    };
  }, []);

  const getBatteryColor = (level: number) => {
    if (level <= 20) return 'bg-red-500';
    if (level <= 50) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const getMoistureColor = (level: number) => {
    if (level <= 30) return 'bg-amber-500';
    if (level >= 70) return 'bg-blue-500';
    return 'bg-agribot-blue';
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-muted/30 border border-muted rounded-lg flex items-center justify-center gap-2 text-muted-foreground">
        <AlertTriangle size={18} />
        <p>Connect to AgriBot to view sensor data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="sensor-card">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Droplets className="text-agribot-blue" size={24} />
            <h3 className="text-lg font-medium">Soil Moisture</h3>
          </div>
          <span className="text-xl font-bold">{Math.round(sensorData.soilMoisture)}%</span>
        </div>
        <Progress 
          value={sensorData.soilMoisture} 
          className="h-2"
          indicatorClassName={getMoistureColor(sensorData.soilMoisture)}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {sensorData.timestamp.toLocaleTimeString()}
        </p>
      </div>
      
      <div className="sensor-card">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Battery className="text-green-600" size={24} />
            <h3 className="text-lg font-medium">Battery Level</h3>
          </div>
          <span className="text-xl font-bold">{Math.round(sensorData.batteryLevel)}%</span>
        </div>
        <Progress 
          value={sensorData.batteryLevel} 
          className="h-2"
          indicatorClassName={getBatteryColor(sensorData.batteryLevel)}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {sensorData.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default SensorDisplay;

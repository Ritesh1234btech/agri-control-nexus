
import React from 'react';
import { Shovel, Leaf, Droplets, XCircle } from 'lucide-react';
import { bluetoothService } from '@/services/BluetoothService';
import { dataService } from '@/services/DataService';
import { toast } from '@/components/ui/use-toast';

const ControlPanel: React.FC = () => {
  const isConnected = bluetoothService.isConnected();

  const handleCommand = async (command: 'P' | 'S' | 'I' | 'X') => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to an AgriBot device first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await bluetoothService.sendCommand(command);
      
      if (success) {
        let actionName;
        switch (command) {
          case 'P': actionName = 'Ploughing'; break;
          case 'S': actionName = 'Seeding'; break;
          case 'I': actionName = 'Irrigation'; break;
          case 'X': actionName = 'Stop All'; break;
        }
        
        toast({
          title: command === 'X' ? "Stopped All Operations" : `Started ${actionName}`,
          description: command === 'X' 
            ? "All robot operations have been stopped." 
            : `The robot has started the ${actionName.toLowerCase()} operation.`,
        });
        
        // Log the operation
        const currentSensorData = {
          soilMoisture: Math.floor(Math.random() * 30) + 40, // Mock data
          batteryLevel: Math.floor(Math.random() * 30) + 70, // Mock data
          timestamp: new Date()
        };
        
        dataService.logOperation(command, currentSensorData);
        
      } else {
        toast({
          title: "Command Failed",
          description: "Failed to send command to the robot. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Command Error",
        description: "An error occurred while sending the command.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button 
        className={`agri-btn agri-btn-green ${!isConnected && 'opacity-50 cursor-not-allowed'}`}
        onClick={() => handleCommand('P')}
        disabled={!isConnected}
      >
        <Shovel size={28} />
        <span>Plough</span>
      </button>
      
      <button 
        className={`agri-btn agri-btn-blue ${!isConnected && 'opacity-50 cursor-not-allowed'}`}
        onClick={() => handleCommand('S')}
        disabled={!isConnected}
      >
        <Leaf size={28} />
        <span>Seed</span>
      </button>
      
      <button 
        className={`agri-btn agri-btn-teal ${!isConnected && 'opacity-50 cursor-not-allowed'}`}
        onClick={() => handleCommand('I')}
        disabled={!isConnected}
      >
        <Droplets size={28} />
        <span>Irrigate</span>
      </button>
      
      <button 
        className={`agri-btn agri-btn-red ${!isConnected && 'opacity-50 cursor-not-allowed'}`}
        onClick={() => handleCommand('X')}
        disabled={!isConnected}
      >
        <XCircle size={28} />
        <span>Stop All</span>
      </button>
    </div>
  );
};

export default ControlPanel;

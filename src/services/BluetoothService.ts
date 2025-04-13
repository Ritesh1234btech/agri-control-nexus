
// This is a mock implementation that will be replaced with actual Bluetooth functionality
// when running on a real device with the Capacitor Bluetooth plugin

export interface BluetoothDevice {
  id: string;
  name: string;
  isConnected: boolean;
  isTrusted: boolean;
}

export interface SensorData {
  soilMoisture: number;
  batteryLevel: number;
  timestamp: Date;
}

class BluetoothService {
  private devices: BluetoothDevice[] = [];
  private connectedDevice: BluetoothDevice | null = null;
  private listeners: Array<(data: SensorData) => void> = [];
  private connectionListeners: Array<(connected: boolean) => void> = [];
  private mockDataInterval: number | null = null;

  // Scan for nearby bluetooth devices
  async scanForDevices(): Promise<BluetoothDevice[]> {
    console.log('Scanning for Bluetooth devices...');
    
    // In a real implementation, we would use the Capacitor Bluetooth plugin
    // For now, we'll return mock data
    this.devices = [
      { id: '00:11:22:33:44:55', name: 'AgriBot-001', isConnected: false, isTrusted: true },
      { id: '11:22:33:44:55:66', name: 'HC-05', isConnected: false, isTrusted: false },
      { id: '22:33:44:55:66:77', name: 'Unknown Device', isConnected: false, isTrusted: false },
      { id: '33:44:55:66:77:88', name: 'AgriBot-002', isConnected: false, isTrusted: true },
      { id: '44:55:66:77:88:99', name: 'BT Device', isConnected: false, isTrusted: false },
    ];
    
    return this.devices;
  }

  // Connect to a device
  async connectToDevice(deviceId: string): Promise<boolean> {
    console.log(`Connecting to device: ${deviceId}`);
    
    const device = this.devices.find(d => d.id === deviceId);
    
    if (!device) {
      console.error(`Device not found: ${deviceId}`);
      return false;
    }

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    device.isConnected = true;
    this.connectedDevice = device;
    
    this.notifyConnectionListeners(true);
    
    // Start sending mock sensor data
    this.startMockDataTransmission();
    
    return true;
  }

  // Disconnect from current device
  async disconnect(): Promise<boolean> {
    if (!this.connectedDevice) {
      console.log('No device connected');
      return false;
    }
    
    console.log(`Disconnecting from device: ${this.connectedDevice.id}`);
    
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.connectedDevice.isConnected = false;
    this.connectedDevice = null;
    this.notifyConnectionListeners(false);
    
    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
      this.mockDataInterval = null;
    }
    
    return true;
  }

  // Send command to the connected device
  async sendCommand(command: 'P' | 'S' | 'I' | 'X'): Promise<boolean> {
    if (!this.connectedDevice) {
      console.error('No device connected');
      return false;
    }
    
    console.log(`Sending command: ${command} to device: ${this.connectedDevice.name}`);
    
    // In a real implementation, we would use the Capacitor Bluetooth plugin to send the command
    // For now, we'll just log it
    
    return true;
  }

  // Get the current connection status
  isConnected(): boolean {
    return this.connectedDevice !== null && this.connectedDevice.isConnected;
  }

  // Get the currently connected device
  getConnectedDevice(): BluetoothDevice | null {
    return this.connectedDevice;
  }

  // Register a listener for sensor data
  addSensorDataListener(listener: (data: SensorData) => void): void {
    this.listeners.push(listener);
  }

  // Remove a sensor data listener
  removeSensorDataListener(listener: (data: SensorData) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Register a listener for connection state changes
  addConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners.push(listener);
  }

  // Remove a connection state listener
  removeConnectionListener(listener: (connected: boolean) => void): void {
    const index = this.connectionListeners.indexOf(listener);
    if (index !== -1) {
      this.connectionListeners.splice(index, 1);
    }
  }

  // Notify all registered listeners of new sensor data
  private notifySensorDataListeners(data: SensorData): void {
    this.listeners.forEach(listener => listener(data));
  }

  // Notify all registered listeners of connection state changes
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(listener => listener(connected));
  }

  // Generate and send mock sensor data at regular intervals
  private startMockDataTransmission(): void {
    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
    }
    
    let soilMoisture = Math.floor(Math.random() * 30) + 40; // 40-70%
    let batteryLevel = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    this.notifySensorDataListeners({
      soilMoisture,
      batteryLevel,
      timestamp: new Date()
    });
    
    this.mockDataInterval = setInterval(() => {
      // Slightly change the values to simulate real-time changes
      soilMoisture += (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
      soilMoisture = Math.max(0, Math.min(100, soilMoisture));
      
      batteryLevel -= Math.random() * 0.2; // Battery slowly drains
      batteryLevel = Math.max(0, Math.min(100, batteryLevel));
      
      this.notifySensorDataListeners({
        soilMoisture,
        batteryLevel,
        timestamp: new Date()
      });
    }, 5000) as unknown as number;
  }
}

// Export a singleton instance
export const bluetoothService = new BluetoothService();

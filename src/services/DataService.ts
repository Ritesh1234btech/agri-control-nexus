
import { SensorData } from './BluetoothService';

export interface LogEntry extends SensorData {
  operation?: 'P' | 'S' | 'I' | 'X';
  operationName?: string;
}

const STORAGE_KEY = 'agribot_logs';

const getOperationName = (operation: 'P' | 'S' | 'I' | 'X'): string => {
  switch (operation) {
    case 'P': return 'Ploughing';
    case 'S': return 'Seeding';
    case 'I': return 'Irrigation';
    case 'X': return 'Stop All';
    default: return 'Unknown';
  }
};

class DataService {
  private logs: LogEntry[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // Add a sensor data entry to the logs
  addSensorData(data: SensorData): void {
    this.logs.push({
      ...data,
      timestamp: new Date()
    });
    this.saveToStorage();
  }

  // Log an operation with the current sensor data
  logOperation(operation: 'P' | 'S' | 'I' | 'X', data: SensorData): void {
    this.logs.push({
      ...data,
      operation,
      operationName: getOperationName(operation),
      timestamp: new Date()
    });
    this.saveToStorage();
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Get logs for a specific date range
  getLogsForDateRange(startDate: Date, endDate: Date): LogEntry[] {
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    }).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Clear all logs
  clearLogs(): void {
    this.logs = [];
    this.saveToStorage();
  }

  // Get average soil moisture for a date range
  getAverageSoilMoisture(startDate: Date, endDate: Date): number {
    const logs = this.getLogsForDateRange(startDate, endDate);
    
    if (logs.length === 0) return 0;
    
    const sum = logs.reduce((acc, log) => acc + log.soilMoisture, 0);
    return sum / logs.length;
  }

  // Save logs to local storage
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save logs to storage:', error);
    }
  }

  // Load logs from local storage
  private loadFromStorage(): void {
    try {
      const storedLogs = localStorage.getItem(STORAGE_KEY);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
        // Convert string dates to Date objects
        this.logs = this.logs.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load logs from storage:', error);
    }
  }
}

// Export a singleton instance
export const dataService = new DataService();

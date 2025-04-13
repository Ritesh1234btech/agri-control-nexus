
import React, { useState, useEffect } from 'react';
import { dataService, LogEntry } from '@/services/DataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';

const formatDate = (date: Date): string => {
  return format(new Date(date), 'MMM dd, HH:mm');
};

const DataHistory: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchLogs = () => {
      // Get logs for the selected date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const fetchedLogs = dataService.getLogsForDateRange(startOfDay, endOfDay);
      setLogs(fetchedLogs);
      
      // Prepare data for the chart
      const formattedData = fetchedLogs.map(log => ({
        time: formatDate(log.timestamp),
        soilMoisture: log.soilMoisture,
        batteryLevel: log.batteryLevel,
        operation: log.operation
      })).reverse(); // Reverse to show chronological order
      
      setChartData(formattedData);
    };
    
    fetchLogs();
    
    // Refresh data when logs change
    const intervalId = setInterval(fetchLogs, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [date]);

  const getOperationEmoji = (operation?: 'P' | 'S' | 'I' | 'X'): string => {
    switch (operation) {
      case 'P': return '🚜'; // Plough
      case 'S': return '🌱'; // Seed
      case 'I': return '💧'; // Irrigate
      case 'X': return '⏹️'; // Stop
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data History</h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(date, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {chartData.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Soil Moisture & Battery Levels</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="soilMoisture" 
                  name="Soil Moisture (%)" 
                  stroke="#2196f3" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="batteryLevel" 
                  name="Battery Level (%)" 
                  stroke="#4caf50" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Operation Log</h3>
            <div className="max-h-64 overflow-y-auto border rounded-md">
              {logs.filter(log => log.operation).map((log, index) => (
                <div 
                  key={index} 
                  className="p-2 border-b text-sm flex items-center gap-2 hover:bg-muted/30"
                >
                  <span className="text-lg">{getOperationEmoji(log.operation)}</span>
                  <div>
                    <p className="font-medium">{log.operationName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs">
                    <span>Soil: {log.soilMoisture}%</span>
                    <span>Battery: {log.batteryLevel}%</span>
                  </div>
                </div>
              ))}
              
              {logs.filter(log => log.operation).length === 0 && (
                <p className="p-4 text-center text-muted-foreground">No operations logged on this date.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 p-8 rounded-lg border border-muted text-center">
          <p className="text-muted-foreground">No data available for this date.</p>
        </div>
      )}
    </div>
  );
};

export default DataHistory;

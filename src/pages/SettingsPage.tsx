
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Wrench, Eye, Shield, Camera, Cpu } from 'lucide-react';
import { dataService } from '@/services/DataService';
import { toast } from '@/components/ui/use-toast';

const SettingsPage: React.FC = () => {
  const [trustedOnly, setTrustedOnly] = useState(true);

  const handleClearData = () => {
    dataService.clearLogs();
    toast({
      title: "Data Cleared",
      description: "All historical data has been cleared."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-agribot-background">
      <Header title="Settings" />
      
      <main className="flex-1 container py-6 space-y-6 max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-agribot-green" />
                <div>
                  <p className="font-medium">Connect to Trusted Devices Only</p>
                  <p className="text-sm text-muted-foreground">Only allow connection to known devices</p>
                </div>
              </div>
              <Switch checked={trustedOnly} onCheckedChange={setTrustedOnly} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Trash2 size={18} className="text-destructive" />
                  Clear Historical Data
                </span>
                <span>→</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete all your historical data and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Future Features</h2>
          
          <div className="space-y-2">
            <div className="p-3 rounded-md border border-dashed flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-muted-foreground" />
                <p className="text-muted-foreground">AI Crop Recommendations</p>
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
            </div>
            
            <div className="p-3 rounded-md border border-dashed flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-muted-foreground" />
                <p className="text-muted-foreground">Live Camera Feed</p>
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-6">
          <p>AgriBot Controller v1.0.0</p>
          <p>© 2023-2025 AgriBot Technologies</p>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;


import React from 'react';
import Header from '@/components/Header';
import DataHistory from '@/components/DataHistory';

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-agribot-background">
      <Header title="Data History" />
      
      <main className="flex-1 container py-6 space-y-6">
        <DataHistory />
      </main>
    </div>
  );
};

export default HistoryPage;

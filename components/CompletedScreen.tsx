import React from 'react';
import { Trophy, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface CompletedScreenProps {
  onRestart: () => void;
}

export const CompletedScreen: React.FC<CompletedScreenProps> = ({ onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <div className="mb-6 p-6 bg-yellow-100 rounded-full border-4 border-yellow-400 animate-bounce-short">
        <Trophy size={64} className="text-yellow-600" />
      </div>
      <h2 className="text-4xl font-bold text-blue-900 mb-2">Lesson Completed!</h2>
      <p className="text-gray-600 text-lg mb-8">Great job! You've learned all the animals.</p>
      
      <Button onClick={onRestart} variant="primary">
        <div className="flex items-center justify-center gap-2">
          <RefreshCcw size={20} />
          <span>Play Again</span>
        </div>
      </Button>
    </div>
  );
};
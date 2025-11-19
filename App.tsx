import React, { useState, useEffect, useRef } from 'react';
import { ANIMAL_LEVELS, FALLBACK_IMAGE } from './constants';
import { GameState } from './types';
import { generateAnimalCartoon } from './services/geminiService';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { CompletedScreen } from './components/CompletedScreen';
import { Sparkles, Volume2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING_IMAGE);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentAnimal = ANIMAL_LEVELS[currentIndex];
  const isLastLevel = currentIndex === ANIMAL_LEVELS.length - 1;
  const totalLevels = ANIMAL_LEVELS.length;

  // Effect to load image when the animal changes
  useEffect(() => {
    let isMounted = true;

    const loadLevel = async () => {
      if (currentIndex >= totalLevels) {
        setGameState(GameState.COMPLETED);
        return;
      }

      setGameState(GameState.LOADING_IMAGE);
      setInputValue('');
      setErrorMessage(null);
      setCurrentImage(null);

      // Attempt to generate a unique cartoon image for this animal
      const generatedUrl = await generateAnimalCartoon(currentAnimal.englishName);
      
      if (isMounted) {
        // If API generation fails (no key or error), fallback to a visual placeholder or simple picsum
        setCurrentImage(generatedUrl || FALLBACK_IMAGE);
        setGameState(GameState.PLAYING);
        
        // Auto focus input when ready
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
      }
    };

    loadLevel();

    return () => {
      isMounted = false;
    };
  }, [currentIndex, currentAnimal, totalLevels]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  const checkAnswer = () => {
    if (!inputValue.trim()) return;

    const normalizedInput = inputValue.trim().toLowerCase();
    const correctAnswer = currentAnimal.englishName.toLowerCase();

    if (normalizedInput === correctAnswer) {
      setGameState(GameState.CORRECT);
      // Play a simple success sound effect (optional, browser constraints apply)
    } else {
      setErrorMessage("Wrong spelling, please try again!");
      // Shake animation logic could go here
      inputRef.current?.focus();
    }
  };

  const handleNext = () => {
    if (isLastLevel) {
      setGameState(GameState.COMPLETED);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (gameState === GameState.PLAYING) {
        checkAnswer();
      } else if (gameState === GameState.CORRECT) {
        handleNext();
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setGameState(GameState.LOADING_IMAGE);
  };

  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50">
        
        {/* Header */}
        <div className="bg-blue-500 p-4 flex items-center justify-center relative">
          <h1 className="text-white font-bold text-2xl flex items-center gap-2">
            <Sparkles className="text-yellow-300" />
            Spelling Zoo
          </h1>
        </div>

        {/* Main Content */}
        <div className="p-6">
          
          {gameState === GameState.COMPLETED ? (
            <CompletedScreen onRestart={handleRestart} />
          ) : (
            <>
              <ProgressBar current={currentIndex} total={totalLevels} />

              {/* Card Content */}
              <div className="flex flex-col items-center space-y-6">
                
                {/* Image Area */}
                <div className="relative w-64 h-64 bg-gray-100 rounded-2xl overflow-hidden border-4 border-blue-100 shadow-inner flex items-center justify-center group">
                  {gameState === GameState.LOADING_IMAGE ? (
                    <div className="flex flex-col items-center gap-2">
                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                       <span className="text-sm text-gray-400">Painting {currentAnimal.englishName}...</span>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                        <img 
                            src={currentImage || FALLBACK_IMAGE} 
                            alt={currentAnimal.englishName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* If it's a fallback image, show the emoji as an overlay to ensure it's playable without API Key */}
                        {!currentImage && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-6xl">
                                {currentAnimal.emoji}
                             </div>
                        )}
                    </div>
                  )}
                </div>

                {/* Question / Prompt */}
                <div className="text-center">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">What is this animal?</p>
                  <h2 className="text-4xl font-bold text-gray-800">{currentAnimal.thaiName}</h2>
                </div>

                {/* Input Area */}
                <div className="w-full relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        disabled={gameState === GameState.CORRECT || gameState === GameState.LOADING_IMAGE}
                        placeholder="Type answer..."
                        className={`w-full text-center text-2xl font-bold py-4 px-4 rounded-xl border-2 outline-none transition-all
                            ${errorMessage ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-300' : 'border-gray-200 focus:border-blue-400 text-gray-800'}
                            ${gameState === GameState.CORRECT ? 'border-green-500 bg-green-50 text-green-800' : ''}
                        `}
                        autoComplete="off"
                    />
                    
                    {/* Feedback Icons inside input */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {gameState === GameState.CORRECT && <CheckCircle2 className="text-green-500 w-8 h-8" />}
                        {errorMessage && <AlertCircle className="text-red-500 w-6 h-6" />}
                    </div>
                </div>

                {/* Feedback Text */}
                <div className="h-6 text-center">
                    {errorMessage && (
                        <p className="text-red-500 font-bold text-sm animate-bounce">{errorMessage}</p>
                    )}
                    {gameState === GameState.CORRECT && (
                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                             <span>Correct! It's a {currentAnimal.englishName}.</span>
                             <button 
                                onClick={() => speakWord(currentAnimal.englishName)}
                                className="p-1 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                             >
                                 <Volume2 size={16} />
                             </button>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="w-full pt-2">
                    {gameState === GameState.CORRECT ? (
                         <Button onClick={handleNext} variant="success" autoFocus>
                            <div className="flex items-center justify-center gap-2">
                                <span>Next Animal</span>
                                <ArrowRight size={20} />
                            </div>
                         </Button>
                    ) : (
                        <Button 
                            onClick={checkAnswer} 
                            disabled={gameState === GameState.LOADING_IMAGE || !inputValue}
                            variant="primary"
                        >
                            Submit Answer
                        </Button>
                    )}
                </div>

              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-400">
                Learn English • Animals • {currentIndex + 1} / {totalLevels}
            </p>
        </div>

      </div>
    </div>
  );
};

export default App;
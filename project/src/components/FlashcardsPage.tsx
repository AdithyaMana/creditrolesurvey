import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen, CheckCircle } from 'lucide-react';
import { creditDefinitions } from '../data/creditDefinitions';

interface FlashcardsPageProps {
  onNext: () => void;
  onBack: () => void;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({ onNext, onBack }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [viewedAllCards, setViewedAllCards] = useState(false);

  const handleCardFlip = (cardIndex: number) => {
    const newFlippedCards = new Set(flippedCards);
    if (newFlippedCards.has(cardIndex)) {
      newFlippedCards.delete(cardIndex);
    } else {
      newFlippedCards.add(cardIndex);
    }
    setFlippedCards(newFlippedCards);
  };

  const handleNext = () => {
    if (currentCard < creditDefinitions.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      setViewedAllCards(true);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const resetCards = () => {
    setFlippedCards(new Set());
    setCurrentCard(0);
    setViewedAllCards(false);
  };

  const currentRole = creditDefinitions[currentCard];
  const isFlipped = flippedCards.has(currentCard);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <div className="flex justify-center items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Learn CRediT Roles
                </h1>
              </div>
              <p className="text-gray-600">
                Familiarize yourself with the 14 contributor roles before the survey
              </p>
            </div>

            <button
              onClick={resetCards}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">User Info</span>
            </div>
            <div className="w-12 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Learn CRediT</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Survey</span>
            </div>
          </div>
        </div>

        {/* Card Counter */}
        <div className="text-center mb-6">
          <span className="text-lg font-medium text-gray-700">
            Card {currentCard + 1} of {creditDefinitions.length}
          </span>
        </div>

        {/* Main Flashcard */}
        <div className="max-w-2xl mx-auto mb-8">
          <div 
            className="relative w-full h-80 cursor-pointer perspective-1000"
            onClick={() => handleCardFlip(currentCard)}
          >
            <div className={`
              absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d
              ${isFlipped ? 'rotate-y-180' : ''}
            `}>
              {/* Front of card */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col items-center justify-center border border-gray-200 hover:shadow-2xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                    {currentRole.title}
                  </h2>
                  <p className="text-gray-500 text-center">
                    Click to see definition
                  </p>
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 h-full flex flex-col justify-center border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {currentRole.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-center">
                    {currentRole.description}
                  </p>
                  <p className="text-gray-500 text-center mt-4 text-sm">
                    Click to flip back
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
              ${currentCard === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <span className="text-gray-500 text-sm">
            {currentCard + 1} / {creditDefinitions.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentCard === creditDefinitions.length - 1}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all
              ${currentCard === creditDefinitions.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }
            `}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* All Cards Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            All CRediT Roles Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creditDefinitions.map((role, index) => (
              <div
                key={role.id}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${index === currentCard 
                    ? 'border-blue-500 bg-blue-50' 
                    : flippedCards.has(index)
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }
                `}
                onClick={() => setCurrentCard(index)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {role.title}
                  </h4>
                  {flippedCards.has(index) && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ready Button - Always visible after viewing at least one card */}
        <div className="text-center">
          {viewedAllCards ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Great! You've viewed all CRediT roles
              </h3>
              <p className="text-green-700">
                You're now ready to start the icon matching survey
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Learn About CRediT Roles
              </h3>
              <p className="text-blue-700">
                Review the contributor roles below, then proceed to the survey when ready
              </p>
            </div>
          )}
          
          <button
            onClick={onNext}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
          >
            <span>Continue to Survey</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <p className="text-sm text-gray-500 mt-3">
            You can return to this page anytime during the survey
          </p>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
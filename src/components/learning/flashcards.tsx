"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface FlashcardProps {
  cards: Array<{
    front: string;
    back: string;
  }>;
}

export function Flashcards({ cards }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return <div className="text-center py-8">No flashcards available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <Button variant="outline" size="sm" onClick={() => setCurrentIndex(0)}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="relative h-64 cursor-pointer" onClick={handleFlip}>
        <Card className="absolute inset-0 transition-all duration-500 transform-gpu">
          <CardContent className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <p className="text-lg font-medium">
                {isFlipped ? cards[currentIndex].back : cards[currentIndex].front}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Click to flip
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
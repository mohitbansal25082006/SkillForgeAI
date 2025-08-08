"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
}

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (currentQuestion >= questions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-2xl font-bold mb-4">
              Your Score: {score}/{questions.length}
            </p>
            <p className="text-gray-600">
              {score === questions.length
                ? "Perfect! You've mastered this topic!"
                : score >= questions.length / 2
                ? "Good job! Keep practicing to improve."
                : "Keep studying and try again!"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{questions[currentQuestion].question}</p>
        
        <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value: string) => handleAnswerSelect(parseInt(value))}>
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showResult && (
          <div className={`p-4 rounded-lg ${
            selectedAnswer === questions[currentQuestion].correctAnswer
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className="font-medium">
                {selectedAnswer === questions[currentQuestion].correctAnswer
                  ? 'Correct!'
                  : 'Incorrect'}
              </span>
            </div>
            <p className="text-sm">{questions[currentQuestion].explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          {currentQuestion > 0 && (
            <Button variant="outline" onClick={() => setCurrentQuestion(currentQuestion - 1)}>
              Previous
            </Button>
          )}
          
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
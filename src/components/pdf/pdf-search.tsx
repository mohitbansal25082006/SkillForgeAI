// src/components/pdf/pdf-search.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchResult {
  content: string;
  metadata: Record<string, unknown>;
  score: number;
}

export function PDFSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSearch = async () => {
    if (!query) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/search-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results);
      toast.success('Search completed!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to search documents');
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      toast.success(`PDF processed successfully! ${data.documentCount} chunks created.`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* PDF Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
          <CardDescription>
            Upload a PDF document to enable semantic search capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <div className="text-center">
                  {isUploading ? (
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                  ) : (
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  )}
                  <span className="mt-2 text-sm text-gray-600">
                    {isUploading ? 'Processing...' : 'Click to upload PDF'}
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Documents</CardTitle>
          <CardDescription>
            Search through your uploaded PDFs using natural language queries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="What would you like to know?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results Section */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center mb-2">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {(result.metadata.source as string) || 'Document'}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    Score: {result.score.toFixed(3)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {result.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
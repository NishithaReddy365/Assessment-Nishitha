import { useState, useCallback, useRef } from 'react';
import type { Generation, GenerationRequest } from '../types';
import { GenerationService } from '../services/GenerationService';

interface UseGenerationResult {
  generations: Generation[];
  isLoading: boolean;
  error: string | null;
  generate: (request: GenerationRequest) => Promise<void>;
  abortGeneration: () => void;
  setSelectedGeneration: (generation: Generation) => void;
  selectedGeneration: Generation | null;
}

const MAX_HISTORY = 5;

export function useGeneration(): UseGenerationResult {
  const [generations, setGenerations] = useState<Generation[]>(() => {
    const saved = localStorage.getItem('generations');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
  
  const generationService = useRef(new GenerationService());

  const saveToLocalStorage = useCallback((gens: Generation[]) => {
    localStorage.setItem('generations', JSON.stringify(gens));
  }, []);

  const generate = useCallback(async (request: GenerationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generationService.current.generate(request);
      
      setGenerations(prev => {
        const updated = [result, ...prev].slice(0, MAX_HISTORY);
        saveToLocalStorage(updated);
        return updated;
      });
      
      setSelectedGeneration(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsLoading(false);
    }
  }, [saveToLocalStorage]);

  const abortGeneration = useCallback(() => {
    generationService.current.abort();
    setIsLoading(false);
  }, []);

  return {
    generations,
    isLoading,
    error,
    generate,
    abortGeneration,
    setSelectedGeneration,
    selectedGeneration,
  };
}

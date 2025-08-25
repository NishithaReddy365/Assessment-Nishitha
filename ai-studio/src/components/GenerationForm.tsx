import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ChangeEvent } from 'react';
import type { StyleOption } from '../types';

interface GenerationFormProps {
  onSubmit: (prompt: string, style: StyleOption) => void;
  isLoading: boolean;
  onAbort: () => void;
}

const STYLE_OPTIONS: StyleOption[] = ['Editorial', 'Streetwear', 'Vintage', 'Minimal', 'Artistic'];

export function GenerationForm({ onSubmit, isLoading, onAbort }: GenerationFormProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<StyleOption>('Editorial');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(prompt, style);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          Prompt
        </label>
        <input
          type="text"
          id="prompt"
          className="input mt-1"
          value={prompt}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="style" className="block text-sm font-medium text-gray-700">
          Style
        </label>
        <select
          id="style"
          className="input mt-1"
          value={style}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setStyle(e.target.value as StyleOption)}
          disabled={isLoading}
        >
          {STYLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        {isLoading ? (
          <button
            type="button"
            onClick={onAbort}
            className="btn btn-primary bg-red-600 hover:bg-red-700"
          >
            Abort
          </button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            Generate
          </button>
        )}
      </div>
    </form>
  );
}

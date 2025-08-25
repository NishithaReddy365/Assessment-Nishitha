import type { Generation } from '../types';

interface GenerationHistoryProps {
  generations: Generation[];
  onSelect: (generation: Generation) => void;
  selectedId: string | null;
}

export function GenerationHistory({ generations, onSelect, selectedId }: GenerationHistoryProps) {
  if (generations.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No generations yet. Start by uploading an image and entering a prompt!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">History</h2>
      <div className="grid grid-cols-2 gap-4">
        {generations.map((generation) => (
          <button
            key={generation.id}
            onClick={() => onSelect(generation)}
            className={`p-2 rounded-lg transition-all ${
              selectedId === generation.id
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2'
            }`}
            aria-pressed={selectedId === generation.id}
          >
            <img
              src={generation.imageUrl}
              alt={generation.prompt}
              className="w-full h-32 object-cover rounded-md"
            />
            <div className="mt-2 text-sm text-left">
              <p className="font-medium truncate">{generation.prompt}</p>
              <p className="text-gray-500">{generation.style}</p>
              <p className="text-gray-400 text-xs">
                {new Date(generation.createdAt).toLocaleString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useImageUpload } from './hooks/useImageUpload';
import { useGeneration } from './hooks/useGeneration';
import { ImageUpload } from './components/ImageUpload';
import { GenerationForm } from './components/GenerationForm';
import { GenerationHistory } from './components/GenerationHistory';
import type { StyleOption } from './types';

function App() {
  const { imageUrl, handleImageUpload, error: uploadError } = useImageUpload();
  const {
    generations,
    isLoading,
    error: generationError,
    generate,
    abortGeneration,
    selectedGeneration,
    setSelectedGeneration,
  } = useGeneration();

  const handleGenerate = async (prompt: string, style: StyleOption) => {
    if (!imageUrl) return;

    await generate({
      imageDataUrl: imageUrl,
      prompt,
      style,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Studio</h1>
          <p className="text-gray-600">Transform your images with AI-powered style transfer</p>
        </header>

        <main className="bg-white rounded-xl shadow-sm p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-lg font-semibold mb-4">1. Upload Image</h2>
              <ImageUpload
                onImageUpload={handleImageUpload}
                imageUrl={selectedGeneration?.imageUrl || imageUrl}
                error={uploadError}
              />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">2. Generate</h2>
              <GenerationForm
                onSubmit={handleGenerate}
                isLoading={isLoading}
                onAbort={abortGeneration}
              />
              {generationError && (
                <p className="mt-2 text-red-500 text-sm" role="alert">
                  {generationError}
                </p>
              )}
            </section>
          </div>

          <section className="pt-6 border-t border-gray-200">
            <GenerationHistory
              generations={generations}
              onSelect={setSelectedGeneration}
              selectedId={selectedGeneration?.id ?? null}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;

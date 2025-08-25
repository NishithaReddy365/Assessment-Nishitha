import { useRef } from 'react';
import type { ChangeEvent } from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  imageUrl: string | null;
  error: string | null;
}

export function ImageUpload({ onImageUpload, imageUrl, error }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png"
          onChange={handleChange}
          aria-label="Image upload"
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="max-w-full max-h-[400px] mx-auto"
          />
        ) : (
          <div className="text-gray-500">
            Click or drag to upload an image (PNG/JPG, max 10MB)
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

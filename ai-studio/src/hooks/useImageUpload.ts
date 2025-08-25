import { useState, useCallback } from 'react';

interface UseImageUploadResult {
  imageUrl: string | null;
  handleImageUpload: (file: File) => Promise<void>;
  error: string | null;
}

export function useImageUpload(): UseImageUploadResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        throw new Error('Only JPEG and PNG images are supported');
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size must be less than 10MB');
      }

      const reader = new FileReader();
      
      const imageUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = async () => {
          const img = new Image();
          img.src = reader.result as string;
          
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          // Check if image needs to be downscaled
          if (img.width > 1920 || img.height > 1920) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Calculate new dimensions
            const scale = 1920 / Math.max(img.width, img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            // Draw scaled image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL(file.type));
          } else {
            resolve(reader.result as string);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setImageUrl(imageUrl);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
      setImageUrl(null);
    }
  }, []);

  return { imageUrl, handleImageUpload, error };
}

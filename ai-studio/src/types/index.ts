export type StyleOption = 'Editorial' | 'Streetwear' | 'Vintage' | 'Minimal' | 'Artistic';

export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: StyleOption;
}

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: StyleOption;
  createdAt: string;
}

export interface APIError {
  message: string;
}

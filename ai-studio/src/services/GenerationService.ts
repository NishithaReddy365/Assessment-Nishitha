import type { GenerationRequest, Generation, APIError } from '../types';

const SIMULATED_ERROR_RATE = 0.2; // 20% chance of error
const SIMULATED_DELAY = 1500; // 1.5 seconds

export class GenerationService {
  private controller: AbortController | null = null;

  private async simulateAPICall(
    request: GenerationRequest,
    attempt: number = 1
  ): Promise<Generation> {
    this.controller = new AbortController();
    
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (Math.random() < SIMULATED_ERROR_RATE) {
            reject(new Error('Model overloaded'));
          } else {
            resolve(void 0);
          }
        }, SIMULATED_DELAY);

        this.controller?.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Generation aborted'));
        });
      });

      return {
        id: crypto.randomUUID(),
        imageUrl: request.imageDataUrl, // In a real app, this would be a processed image URL
        prompt: request.prompt,
        style: request.style,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      if (attempt < 3) {
        const backoffDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return this.simulateAPICall(request, attempt + 1);
      }
      throw error;
    }
  }

  async generate(request: GenerationRequest): Promise<Generation> {
    try {
      return await this.simulateAPICall(request);
    } catch (error) {
      const apiError: APIError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      throw apiError;
    }
  }

  abort(): void {
    this.controller?.abort();
    this.controller = null;
  }
}

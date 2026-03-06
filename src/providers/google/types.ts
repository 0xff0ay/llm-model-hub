/**
 * Google API types
 */

export interface GoogleMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface GoogleRequest {
  contents: GoogleMessage[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    stopSequences?: string[];
  };
}

export interface GoogleResponse {
  candidates: Array<{
    content: {
      role: string;
      parts: Array<{ text: string }>;
    };
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
  };
}

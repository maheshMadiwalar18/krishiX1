import { GoogleGenerativeAI } from '@google/generative-ai';

export type GeminiErrorKind = 'missing_key' | 'auth' | 'quota' | 'network' | 'bad_request' | 'unknown';

export class GeminiError extends Error {
  kind: GeminiErrorKind;
  status?: number;

  constructor(kind: GeminiErrorKind, message: string, status?: number) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

function extractHttpStatus(error: unknown): number | undefined {
  const anyErr = error as any;
  if (typeof anyErr?.status === 'number') return anyErr.status;
  if (typeof anyErr?.statusCode === 'number') return anyErr.statusCode;
  if (typeof anyErr?.response?.status === 'number') return anyErr.response.status;
  if (typeof anyErr?.error?.code === 'number') return anyErr.error.code;
  return undefined;
}

function extractErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  const anyErr = error as any;
  return (
    anyErr?.message ||
    anyErr?.error?.message ||
    anyErr?.response?.data?.error?.message ||
    'Unknown error'
  );
}

export function toGeminiError(error: unknown): GeminiError {
  const status = extractHttpStatus(error);
  const message = extractErrorMessage(error);
  const anyErr = error as any;
  const code = String(anyErr?.code || anyErr?.error?.status || '').toUpperCase();

  if (status === 401 || status === 403) return new GeminiError('auth', message, status);
  if (status === 429) return new GeminiError('quota', message, status);
  if (status === 400) return new GeminiError('bad_request', message, status);

  if (code.includes('ENOTFOUND') || code.includes('ECONN') || code.includes('ETIMEDOUT')) {
    return new GeminiError('network', message, status);
  }

  return new GeminiError('unknown', message, status);
}

let cachedClient: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError('missing_key', 'GEMINI_API_KEY is not set');
  }

  cachedClient = new GoogleGenerativeAI(apiKey);
  return cachedClient;
}

export async function generateGeminiText(prompt: string, model = 'gemini-1.5-flash'): Promise<string> {
  try {
    const client = getClient();
    const gm = client.getGenerativeModel({ model });
    const result = await gm.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response', { model, chars: text.length });

    return text;
  } catch (err) {
    if (err instanceof GeminiError) throw err;
    throw toGeminiError(err);
  }
}

export async function generateGeminiTextFromContent(
  content: Parameters<ReturnType<GoogleGenerativeAI['getGenerativeModel']>['generateContent']>[0],
  model = 'gemini-1.5-flash'
): Promise<string> {
  try {
    const client = getClient();
    const gm = client.getGenerativeModel({ model });
    const result = await gm.generateContent(content as any);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response', { model, chars: text.length });

    return text;
  } catch (err) {
    if (err instanceof GeminiError) throw err;
    throw toGeminiError(err);
  }
}

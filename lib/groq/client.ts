// ============================================
// Mahjoom — Groq Client (safe init)
// ============================================

import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder',
});

export const GROQ_MODEL = 'llama3-8b-8192';

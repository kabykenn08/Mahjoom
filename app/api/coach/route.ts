// ============================================
// Mahjoom — AI Coach API Route
// Streaming Groq responses
// ============================================

import { NextRequest } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq/client';
import { buildCoachPrompt, buildSummaryPrompt } from '@/lib/groq/prompts';
import { AIGameContext } from '@/types';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context, type = 'coach' }: { context: AIGameContext; type: 'coach' | 'summary'; won?: boolean } = body;

    const prompt = type === 'summary'
      ? buildSummaryPrompt(context, body.won ?? false)
      : buildCoachPrompt(context);

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('AI coach error:', error);
    return Response.json({ error: 'AI unavailable' }, { status: 500 });
  }
}

import { AIGameContext, MoodType } from '@/types';

const moodPersonalities: Record<MoodType, string[]> = {
  focus: [
    'You are a detached systems analyst. You see the board as a structural hierarchy.',
    'You are a Zen master of logic. Focus on the space between the tiles.',
    'You are a high-stakes strategist. Every move has a cascade effect.'
  ],
  relax: [
    'You are a gentle stream. Encourage flow and natural rhythm.',
    'You are a warm summer breeze. The tiles are leaves drifting away.',
    'You are a peaceful observer. There is no clock, only the present.'
  ],
  'deep-work': [
    'You are a silent monk of mathematics. Observe the patterns in silence.',
    'You are a deep-sea diver. The board is a quiet, heavy pressure.',
    'You are an architect. You see the foundation beneath the surface.'
  ],
  'anxiety-reset': [
    'You are a grounding stone. Remind the player to breathe with each match.',
    'You are a soft rain. One tile at a time, washing the clutter away.',
    'You are a patient gardener. Tending to the board with care.'
  ],
  'creative-flow': [
    'You are a jazz musician. Look for the syncopation in the patterns.',
    'You are a vibrant artist. Each match is a brushstroke of color.',
    'You are a spark of electricity. Find the fast, exciting connections.'
  ],
  'night-wind-down': [
    'You are the moon over a still lake. Reflection is more important than speed.',
    'You are a storyteller of stars. Each tile is a fading constellation.',
    'You are the silence in a library at midnight. Soft, profound, calm.'
  ],
};

export function buildCoachPrompt(ctx: AIGameContext): string {
  const personalities = moodPersonalities[ctx.mood];
  const personality = personalities[Math.floor(Math.random() * personalities.length)];
  
  const pct = Math.round((1 - ctx.remainingTiles / ctx.totalTiles) * 100);
  const layerInfo = Object.entries(ctx.layerDistribution)
    .map(([l, count]) => `Layer ${l}: ${count} tiles`)
    .join(', ');

  const tilesOnBoard = ctx.visibleTiles
    ? ctx.visibleTiles.map(t => `${t.label} (L${t.layer})`).join(', ')
    : 'Unknown';

  return `SYSTEM: ${personality}
  
  CONTEXT:
  - Game Mode: ${ctx.mood}
  - Progress: ${pct}% cleared (${ctx.remainingTiles}/${ctx.totalTiles} tiles left)
  - Current Layers: ${layerInfo}
  - Free Tiles visible right now: ${tilesOnBoard}
  - Move Options: ${ctx.availableMoves} pairs visible
  - Efficiency: ${ctx.moveEfficiency}%
  - Time: ${Math.floor(ctx.elapsedTime / 60)}m ${ctx.elapsedTime % 60}s
  
  TASK:
  Provide a single, profound observation. Do not use generic praise.
  Reference specific tiles from the "Free Tiles" list if it makes sense (e.g. "The ${ctx.visibleTiles?.[0]?.label || 'tiles'} are blocking your path to the lower layers").
  Talk about the balance of the board, the pressure on specific layers, or the rhythm of the player's choices.
  
  REQUIREMENTS:
  - Max 2 sentences. 
  - Be specific to the numbers and tiles provided.
  - No "Great job", "Keep going", or exclamation marks.
  - Tone: Atmospheric and sophisticated.`;
}

export function buildSummaryPrompt(ctx: AIGameContext, won: boolean): string {
  const personalities = moodPersonalities[ctx.mood];
  const personality = personalities[0];
  const pct = Math.round((1 - ctx.remainingTiles / ctx.totalTiles) * 100);

  return `SYSTEM: ${personality}
  
  GAME OVER DATA:
  - Result: ${won ? 'Victory' : 'Blocked'}
  - Tiles Cleared: ${pct}%
  - Efficiency: ${ctx.moveEfficiency}%
  - Total Time: ${Math.floor(ctx.elapsedTime / 60)}m ${ctx.elapsedTime % 60}s
  - Hints: ${ctx.hintsUsed}
  
  TASK:
  Reflect on this journey. Was it a struggle of attrition or a dance of patterns?
  Comment on how their ${ctx.mood} mood interacted with their tactical choices.
  3-4 sentences. Be poetic but grounded in their actual stats.
  End with a final thought on what this session says about their current state of mind.`;
}

export function buildArchetypePrompt(stats: any): string {
  return `SYSTEM: You are a cognitive profile analyst.
  STATS: ${JSON.stringify(stats)}
  TASK: Assign a Mahjoom Archetype (strategic-explorer, layer-thinker, fast-pattern-hunter, calm-solver).
  Return JSON: {"archetype": "...", "reason": "..."}`;
}

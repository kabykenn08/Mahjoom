'use client';

// ============================================
// Mahjoom — Login / Signup Page
// Premium cinematic auth experience
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useMoodStore } from '@/store/moodStore';
import AmbientBackground from '@/components/effects/AmbientBackground';
import { useSound } from '@/hooks/useSound';

export default function LoginPage() {
  const router = useRouter();
  const { currentMood, theme } = useMoodStore();
  const { playSound } = useSound();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    playSound('click', 0.4);

    try {
      if (isSignUp) {
        // STRICT SIGN UP
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        
        if (signUpError) {
          if (signUpError.message.includes('User already registered')) {
            setError('Этот аккаунт уже создан. Просто войдите в него.');
            setIsSignUp(false);
          } else {
            throw signUpError;
          }
        } else {
          // Success - clear fields or show specific success state
          setError('Аккаунт успешно создан! Теперь введите данные для входа.');
          setIsSignUp(false);
          setPassword(''); // Clear password for security and clarity
        }
      } else {
        // STRICT LOGIN
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Неверный пароль или аккаунт еще не подтвержден. Проверьте почту, если вы только что создали его.');
          } else {
            throw signInError;
          }
        } else {
          router.push('/profile');
        }
      }
    } catch (err: any) {
      setError(err.message);
      playSound('lose', 0.3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden flex items-center justify-center">
      <AmbientBackground mood={currentMood} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl" style={{ borderColor: `${theme.colors.primary}30` }}>
          {/* Logo */}
          <div className="text-center mb-10">
            <motion.button
              onClick={() => router.push('/')}
              className="font-display text-3xl font-bold tracking-tight mb-2"
              style={{ color: theme.colors.text }}
            >
              Mahj<span style={{ color: theme.colors.primary }}>oom</span>
            </motion.button>
            <p className="text-sm" style={{ color: theme.colors.textMuted }}>
              Your mindful journey continues
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 px-1" style={{ color: theme.colors.textMuted }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ color: theme.colors.text }}
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 px-1" style={{ color: theme.colors.textMuted }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ color: theme.colors.text }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-xs text-center px-4 py-3 rounded-xl border transition-colors ${
                    error.includes('успешно') || error.includes('уже создан')
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-display font-semibold text-base transition-all relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                color: '#fff',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                isSignUp ? 'Create Experience' : 'Enter the Void'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                playSound('click', 0.2);
              }}
              className="text-sm transition-colors"
              style={{ color: theme.colors.accent }}
            >
              {isSignUp ? 'Already have a session? Sign In' : 'New here? Create a session'}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: theme.colors.textMuted }}
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

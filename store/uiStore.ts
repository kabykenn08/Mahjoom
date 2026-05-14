// ============================================
// Mahjoom — UI Store (Zustand)
// ============================================

'use client';

import { create } from 'zustand';
import { UIState } from '@/types';

interface UIStore extends UIState {
  setSidebarOpen: (open: boolean) => void;
  setCoachVisible: (visible: boolean) => void;
  openModal: (type: UIState['modal']['type']) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isSidebarOpen: false,
  isCoachVisible: true,
  modal: { isOpen: false, type: null },
  isLoading: false,
  reducedMotion: false,

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setCoachVisible: (visible) => set({ isCoachVisible: visible }),
  openModal: (type) => set({ modal: { isOpen: true, type } }),
  closeModal: () => set({ modal: { isOpen: false, type: null } }),
  setLoading: (loading) => set({ isLoading: loading }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
}));

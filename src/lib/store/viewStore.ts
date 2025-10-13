import { writable } from 'svelte/store';

export type ViewMode = 'developer' | 'designer' | 'artist';

export const currentView = writable<ViewMode>('developer');

export function setView(view: ViewMode) {
  currentView.set(view);
}

export function initViewStore() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pigmenta_view');
    if (saved && ['developer', 'designer', 'artist'].includes(saved)) {
      currentView.set(saved as ViewMode);
    }
    
    currentView.subscribe(view => {
      localStorage.setItem('pigmenta_view', view);
    });
  }
}
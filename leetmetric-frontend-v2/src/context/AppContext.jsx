import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../services/firebase';

const AppContext = createContext();

const initialState = {
  theme: 'dark', // We are enforcing dark mode in the new design
  searchHistory: [],
  favorites: [],
  currentUser: null,
  authLoading: true,
  leaderboard: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH_USER':
      return { ...state, currentUser: action.payload, authLoading: false };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ADD_TO_HISTORY': {
      const newHistory = [
        action.payload,
        ...state.searchHistory.filter((u) => u !== action.payload),
      ];
      return { ...state, searchHistory: newHistory.slice(0, 10) };
    }
    case 'ADD_TO_FAVORITES':
      if (state.favorites.includes(action.payload)) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter((u) => u !== action.payload),
      };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('leetmetric-state-v2');
      if (saved) {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load state', e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('leetmetric-state-v2', JSON.stringify({
      theme: state.theme,
      searchHistory: state.searchHistory,
      favorites: state.favorites,
    }));
  }, [state.theme, state.searchHistory, state.favorites]);

  // Handle Firebase Auth
  useEffect(() => {
    const unsubscribe = authApi.onAuthStateChanged((user) => {
      dispatch({ type: 'SET_AUTH_USER', payload: user });
    });
    return () => unsubscribe();
  }, []);

  // Enforce dark mode on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../services/storage';

const AppContext = createContext();

const initialState = {
  theme: 'light',
  searchHistory: [],
  favorites: [],
  currentUser: null,
  leaderboard: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ADD_TO_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory.filter(u => u !== action.payload)];
      return { ...state, searchHistory: newHistory.slice(0, 10) };
    case 'ADD_TO_FAVORITES':
      if (state.favorites.includes(action.payload)) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FROM_FAVORITES':
      return { ...state, favorites: state.favorites.filter(u => u !== action.payload) };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
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

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = getFromStorage('leetmetric-state');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [state.theme]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveToStorage('leetmetric-state', {
      theme: state.theme,
      searchHistory: state.searchHistory,
      favorites: state.favorites,
    });
  }, [state.theme, state.searchHistory, state.favorites]);

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

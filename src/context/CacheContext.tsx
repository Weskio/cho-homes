import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface CacheState {
  messages: {
    data: any[];
    lastFetched: number | null;
  };
  properties: {
    data: any[];
    lastFetched: number | null;
  };
  users: {
    data: any[];
    lastFetched: number | null;
  };
}

type CacheAction = 
  | { type: 'SET_MESSAGES'; payload: any[] }
  | { type: 'SET_PROPERTIES'; payload: any[] }
  | { type: 'SET_USERS'; payload: any[] }
  | { type: 'CLEAR_CACHE' };

const initialState: CacheState = {
  messages: { data: [], lastFetched: null },
  properties: { data: [], lastFetched: null },
  users: { data: [], lastFetched: null },
};

const CacheContext = createContext<{
  state: CacheState;
  dispatch: React.Dispatch<CacheAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function cacheReducer(state: CacheState, action: CacheAction): CacheState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          data: action.payload,
          lastFetched: Date.now(),
        },
      };
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: {
          data: action.payload,
          lastFetched: Date.now(),
        },
      };
    case 'SET_USERS':
      return {
        ...state,
        users: {
          data: action.payload,
          lastFetched: Date.now(),
        },
      };
    case 'CLEAR_CACHE':
      return initialState;
    default:
      return state;
  }
}

export function CacheProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cacheReducer, initialState);

  return (
    <CacheContext.Provider value={{ state, dispatch }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}

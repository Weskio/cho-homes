import { useCache } from '../context/CacheContext';

const CACHE_DURATION = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

export function useDataCache() {
  const { state, dispatch } = useCache();

  const isCacheValid = (lastFetched: number | null) => {
    if (!lastFetched) return false;
    return Date.now() - lastFetched < CACHE_DURATION;
  };

  const getMessages = () => {
    return {
      data: state.messages.data,
      isValid: isCacheValid(state.messages.lastFetched),
    };
  };

  const setMessages = (data: any[]) => {
    dispatch({ type: 'SET_MESSAGES', payload: data });
  };

  const getProperties = () => {
    return {
      data: state.properties.data,
      isValid: isCacheValid(state.properties.lastFetched),
    };
  };

  const setProperties = (data: any[]) => {
    dispatch({ type: 'SET_PROPERTIES', payload: data });
  };

  const getUsers = () => {
    return {
      data: state.users.data,
      isValid: isCacheValid(state.users.lastFetched),
    };
  };

  const setUsers = (data: any[]) => {
    dispatch({ type: 'SET_USERS', payload: data });
  };

  const clearCache = () => {
    dispatch({ type: 'CLEAR_CACHE' });
  };

  return {
    getMessages,
    setMessages,
    getProperties,
    setProperties,
    getUsers,
    setUsers,
    clearCache,
  };
}

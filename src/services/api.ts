import axios from 'axios';

const baseUrl = 'https://bayut.p.rapidapi.com';

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'bayut.p.rapidapi.com'
  }
});

// interface Location {
//   id: number;
//   level: number;
//   externalID: string;
//   name: string;
//   name_l1: string;
//   name_l2: string;
//   name_l3: string;
//   slug: string;
//   slug_l1: string;
//   slug_l2: string;
//   slug_l3: string;
//   type: string;
// }

export interface Property {
  id: string;
  externalID: string;
  title: string;
  price: number;
  rentFrequency: string;
  rooms: number;
  baths: number;
  area: number;
  coverPhoto: {
    url: string;
  };
  photos: string[];
  phoneNumber: {
    mobile: string;
    phone: string;
  };
  location: any;
  description: string;
  contactInfo?: any;
  purpose?: any;
  propertyType?: any
}

export interface SearchParams {
  locationExternalIDs?: string;
  purpose: 'for-rent' | 'for-sale';
  priceMin?: string;
  priceMax?: string;
  roomsMin?: string;
  sort?: string;
  hitsPerPage?: string;
  page?: string;
}

export interface LocationSuggestion {
  externalID: string;
  name: string;
  geography: {
    lat: number;
    lng: number;
  };
}

const CACHE_KEY_PREFIX = 'propertyCache_';
const CACHE_DURATION = 1000 * 60 * 1200;

interface CacheItem<T> {
  data: T;
  timestamp: number;
  params?: any;
}

const getCachedData = <T>(key: string, params?: any): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp, params: cachedParams }: CacheItem<T> = JSON.parse(cached);
  const isExpired = Date.now() - timestamp > CACHE_DURATION;
  const isSameParams = params ? JSON.stringify(params) === JSON.stringify(cachedParams) : true;

  if (isExpired || !isSameParams) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
};

const setCachedData = <T>(key: string, data: T, params?: any) => {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
    params
  };
  localStorage.setItem(key, JSON.stringify(cacheItem));
};

export const fetchProperties = async (params: SearchParams): Promise<Property[]> => {
  const cacheKey = `${CACHE_KEY_PREFIX}properties`;
  const cachedData = getCachedData<Property[]>(cacheKey, params);
  if (cachedData) return cachedData;

  try {
    const { data } = await api.get('/properties/list', {
      params: {
        hitsPerPage: '25',
        page: '0',
        lang: 'en',
        ...params
      }
    });
    const properties = data?.hits || [];
    setCachedData(cacheKey, properties, params);
    return properties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchPropertyDetails = async (externalID: string): Promise<Property> => {
  const cacheKey = `${CACHE_KEY_PREFIX}property_${externalID}`;
  const cachedData = getCachedData<Property>(cacheKey);
  if (cachedData) return cachedData;

  try {
    const { data } = await api.get('/properties/detail', {
      params: { externalID }
    });
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};

export const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
  const cacheKey = `${CACHE_KEY_PREFIX}locations_${query}`;
  const cachedData = getCachedData<LocationSuggestion[]>(cacheKey);
  if (cachedData) return cachedData;

  try {
    const { data } = await api.get('/auto-complete', {
      params: {
        query,
        hitsPerPage: '5',
        page: '0',
        lang: 'en'
      }
    });
    const locations = data?.hits || [];
    setCachedData(cacheKey, locations);
    return locations;
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

export const fetchLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  const cacheKey = `location_suggestions_${query}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    // Cache for 5 minutes
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
    localStorage.removeItem(cacheKey);
  }

  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://bayut.p.rapidapi.com/auto-complete',
      params: { query, hitsPerPage: '5', page: '0', lang: 'en' },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'bayut.p.rapidapi.com'
      }
    });

    const suggestions = response.data.hits.map((hit: any) => ({
      externalID: hit.externalID,
      name: hit.name,
      geography: hit.geography
    }));

    // Cache the results
    localStorage.setItem(cacheKey, JSON.stringify({
      data: suggestions,
      timestamp: Date.now()
    }));

    return suggestions;
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    return [];
  }
};

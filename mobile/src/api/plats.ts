import api from './axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPlats = async () => {
  try {
    const { data } = await api.get('/plats');
    // Save to cache
    await AsyncStorage.setItem('plats_cache', JSON.stringify(data));
    await AsyncStorage.setItem('last_sync', new Date().toISOString());
    return data;
  } catch (error) {
    // If network fails, try to load from cache
    console.log('Network request failed, loading from cache...');
    const cached = await AsyncStorage.getItem('plats_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    throw error;
  }
};

export const getPlatById = async (id: any) => {
  const { data } = await api.get(`/plats/${id}`);
  return data;
};

export const createPlat = async (platData: any) => {
  const { data } = await api.post('/plats', platData);
  return data;
};

export const updatePlat = async ({ id, ...platData }: { id: any; [key: string]: any }) => {
  const { data } = await api.put(`/plats/${id}`, platData);
  return data;
};

export const deletePlat = async (id: any) => {
  const { data } = await api.delete(`/plats/${id}`);
  return data;
};

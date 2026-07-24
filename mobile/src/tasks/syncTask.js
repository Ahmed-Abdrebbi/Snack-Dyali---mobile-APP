import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlats } from '../api/plats';

const SYNC_TASK_NAME = 'BACKGROUND_SYNC_TASK';

// Define the task
TaskManager.defineTask(SYNC_TASK_NAME, async () => {
  try {
    const data = await getPlats();
    await AsyncStorage.setItem('plats_cache', JSON.stringify(data));
    await AsyncStorage.setItem('last_sync', new Date().toISOString());
    console.log('Background sync successful');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background sync failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register the task
export const registerBackgroundSync = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(SYNC_TASK_NAME, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Task registered successfully');
  } catch (err) {
    console.log('Task registration failed:', err);
  }
};

export const unregisterBackgroundSync = async () => {
  return BackgroundFetch.unregisterTaskAsync(SYNC_TASK_NAME);
};

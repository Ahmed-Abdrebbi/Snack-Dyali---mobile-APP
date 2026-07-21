import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INTRO_SEEN_KEY = '@snacksync_intro_seen';

export function useIntroductionStatus() {
  const [isIntroSeen, setIsIntroSeen] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkIntroStatus() {
      try {
        const value = await AsyncStorage.getItem(INTRO_SEEN_KEY);
        setIsIntroSeen(value === 'true');
      } catch (error) {
        console.error('Error reading intro status from AsyncStorage:', error);
        setIsIntroSeen(false); // Default to false on error
      }
    }
    checkIntroStatus();
  }, []);

  const markAsSeen = async () => {
    try {
      await AsyncStorage.setItem(INTRO_SEEN_KEY, 'true');
      setIsIntroSeen(true);
    } catch (error) {
      console.error('Error setting intro status in AsyncStorage:', error);
    }
  };

  return { isIntroSeen, markAsSeen };
}

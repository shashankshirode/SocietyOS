import AsyncStorage from '@react-native-async-storage/async-storage';

export const RESIDENT_HOME_CONTEXT_STORAGE_KEY = 'societyos.resident.activeHomeContextId';

export const residentHomeContextStorage = {
  async getSelectedContextId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(RESIDENT_HOME_CONTEXT_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  async saveSelectedContextId(id: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(RESIDENT_HOME_CONTEXT_STORAGE_KEY, id);
      return true;
    } catch {
      return false;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(RESIDENT_HOME_CONTEXT_STORAGE_KEY);
    } catch {
      return;
    }
  },
};
export default residentHomeContextStorage;

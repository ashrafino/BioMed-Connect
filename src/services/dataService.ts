import { apiClient } from './api';
import { authManager } from '../lib/auth';
import { OperationType } from '../types';

function handleError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authManager.getCurrentUser()?.uid,
      email: authManager.getCurrentUser()?.email,
    },
    operationType,
    path
  };
  console.error('API Error: ', JSON.stringify(errInfo));
  throw new Error(error instanceof Error ? error.message : String(error));
}

export const dataService = {
  // Authentication methods
  async register(data: { email: string; password: string; name: string; role?: string; service?: string }) {
    try {
      const result = await apiClient.register(data);
      
      // Set current user in auth manager
      authManager.setUser(
        { uid: result.uid, email: result.user.email, name: result.user.name },
        result.token
      );

      return result;
    } catch (error) {
      handleError(error, OperationType.CREATE, 'users');
    }
  },

  async login(credentials: { email: string; password: string }) {
    try {
      const result = await apiClient.login(credentials);
      
      // Set current user in auth manager
      authManager.setUser(
        { uid: result.uid, email: result.user.email, name: result.user.name },
        result.token
      );

      return result;
    } catch (error) {
      handleError(error, OperationType.GET, 'users');
    }
  },

  async signOut() {
    apiClient.signOut();
    authManager.signOut();
  },

  // Profile methods
  async getProfile(uid: string) {
    const path = `users/${uid}`;
    try {
      return await apiClient.getProfile(uid);
    } catch (error) {
      handleError(error, OperationType.GET, path);
    }
  },

  async createProfile(profile: any) {
    const path = `users/${profile.uid}`;
    try {
      return await apiClient.createProfile(profile);
    } catch (error) {
      handleError(error, OperationType.WRITE, path);
    }
  },

  // Panne methods
  async reportPanne(panne: any) {
    const path = 'pannes';
    try {
      const result = await apiClient.createPanne(panne);
      return result.id;
    } catch (error) {
      handleError(error, OperationType.CREATE, path);
    }
  },

  async getPannes() {
    const path = 'pannes';
    try {
      return await apiClient.getPannes();
    } catch (error) {
      handleError(error, OperationType.LIST, path);
    }
  },

  // Real-time listener simulation (polling-based)
  listenToPannes(callback: (pannes: any[]) => void) {
    const path = 'pannes';
    
    // Initial fetch
    this.getPannes().then(callback).catch((error) => {
      handleError(error, OperationType.LIST, path);
    });

    // Poll every 5 seconds for updates
    const intervalId = setInterval(() => {
      this.getPannes().then(callback).catch((error) => {
        console.error('Error fetching pannes:', error);
      });
    }, 5000);

    // Return unsubscribe function
    return () => clearInterval(intervalId);
  },

  async updatePanne(id: string, updates: any) {
    const path = `pannes/${id}`;
    try {
      return await apiClient.updatePanne(id, updates);
    } catch (error) {
      handleError(error, OperationType.UPDATE, path);
    }
  },

  async deletePanne(id: string) {
    const path = `pannes/${id}`;
    try {
      return await apiClient.deletePanne(id);
    } catch (error) {
      handleError(error, OperationType.DELETE, path);
    }
  }
};

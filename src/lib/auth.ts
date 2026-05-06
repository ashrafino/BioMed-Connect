export interface AuthUser {
  uid: string;
  email: string;
  name: string;
}

// Auth context management
class AuthManager {
  private currentUser: AuthUser | null = null;
  private token: string | null = null;
  private listeners: Set<(user: AuthUser | null) => void> = new Set();

  constructor() {
    // Load from localStorage on init
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('authUser');
      
      if (savedToken && savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
          this.token = savedToken;
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  setUser(user: AuthUser | null, token: string | null) {
    this.currentUser = user;
    this.token = token;
    
    if (typeof window !== 'undefined') {
      if (token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    
    this.notifyListeners();
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    this.listeners.add(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }

  signOut() {
    this.setUser(null, null);
  }
}

export const authManager = new AuthManager();

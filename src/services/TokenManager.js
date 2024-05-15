import { jwtDecode } from 'jwt-decode';

class TokenManager {
  constructor() {
    this.token = localStorage.getItem('token');
    this.decodedToken = null;
    if (this.token) {
      this.decodeToken();
    } else {
      console.warn('Token not found in local storage. User will have limited access.');
    }
  }

  decodeToken() {
    try {
      this.decodedToken = jwtDecode(this.token);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  getToken(){
    return this.token;
  }

  getUserId() {
    if (!this.decodedToken) {
      console.warn('Token not decoded. User will have limited access.');
      return null;
    }
    return this.decodedToken.userId;
  }

  getUserRoles() {
    if (!this.decodedToken) {
      console.warn('Token not decoded. User will have limited access.');
      return [];
    }
    return this.decodedToken.role;
  }

  clear() {
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    try {
      const token = this.getToken(); // Corrected invocation of getToken method
      if (token) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Authentication check failed: ", error);
      return false; // Return false in case of any errors
    }
  }
}

const tokenManager = new TokenManager();
export default tokenManager;


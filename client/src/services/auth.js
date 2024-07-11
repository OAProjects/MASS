// src/services/auth.js

class AuthService {
  setToken(token) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const { exp } = this.parseJwt(token);
      if (Date.now() >= exp * 1000) {
        this.removeToken();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }
}

export default new AuthService();

import { jwtDecode } from "jwt-decode";

const TokenManager = {
    getAccessToken: () => localStorage.getItem("token"),

    getClaims: () => {
        if (!localStorage.getItem("claims")) {
            return undefined;
        }
        return JSON.parse(localStorage.getItem("claims"));
    },

    setAccessToken: (token) => {
        localStorage.setItem("token", token);
        const claims = jwtDecode(token);
        localStorage.setItem("claims", JSON.stringify(claims));
        return claims;
    },
    isAuthenticated: () => {
      const token = TokenManager.getAccessToken();
      return !!token;
    },
    getUserId: () => {
      const claims = TokenManager.getClaims();
      return claims ? claims.userId : undefined;
    },
    getUserRole: () => {
      const claims = TokenManager.getClaims();
      return claims? claims.role: undefined;
    },
    clear: () => {
      localStorage.clear();
    }
}

export default TokenManager;



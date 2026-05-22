import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearAuth,
  fetchMe,
  getToken,
} from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    const me = await fetchMe(token);

    if (!me) {
      clearAuth();
      setUser(null);
    } else {
      setUser(me);
    }

    setLoading(false);
    return me;
  }, []);

  useEffect(() => {
    refreshSession();

    const onLogout = () => {
      clearAuth();
      setUser(null);
    };

    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [refreshSession]);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const login = useCallback(async (token) => {
    localStorage.setItem("token", token);
    const me = await fetchMe(token);

    if (!me) {
      clearAuth();
      setUser(null);
      return null;
    }

    setUser(me);
    return me;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
        login,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}

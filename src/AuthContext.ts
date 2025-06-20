import { SignoutRedirectArgs, User } from "oidc-client-ts";
import { createContext } from "solid-js";

export interface AuthContextType {
  user: () => User | null;
  isAuthenticated: () => boolean;
  isLoading: () => boolean;
  login: () => Promise<void>;
  logout: (args?: SignoutRedirectArgs) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>();

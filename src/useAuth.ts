import { useContext } from "solid-js";
import { AuthContext } from "./AuthContext";

/**
 * Hook to access the authentication context.
 * Must be used within an AuthProvider component.
 * 
 * @returns {AuthContextType} Authentication context containing user info and auth methods
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * import { useAuth } from 'solid-oidc-provider';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   return (
 *     <div>
 *       {isAuthenticated() ? (
 *         <>
 *           <p>Welcome, {user()?.profile.name}!</p>
 *           <button onClick={logout}>Logout</button>
 *         </>
 *       ) : (
 *         <button onClick={login}>Login</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
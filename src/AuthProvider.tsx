import { createSignal, createEffect, JSX, Show } from "solid-js";
import { User, UserManagerSettings } from "oidc-client-ts";
import { AuthService } from "./auth";
import { AuthContext, AuthContextType } from "./AuthContext";

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  /** OIDC client configuration */
  config: UserManagerSettings;
  /** Child components to be wrapped with auth context */
  children: JSX.Element;
  /** Optional loading component to show while authentication is being checked */
  loadingComponent?: JSX.Element;
}

/**
 * AuthProvider component that manages authentication state and provides auth context to child components.
 * Shows a loading component while authentication is being checked to prevent flickering of previous content.
 * 
 * @param config - OIDC client configuration
 * @param children - Child components to be wrapped with auth context
 * @param loadingComponent - Optional component to show during authentication loading state
 * 
 * Usage example:
 * ```tsx
 * import { AuthProvider } from 'solid-oidc-provider';
 * 
 * const config = {
 *   authority: "https://your-oidc-provider.com",
 *   client_id: "your-client-id",
 *   redirect_uri: "http://localhost:3000/callback",
 *   response_type: "code",
 *   scope: "openid profile email"
 * };
 * 
 * const LoadingSpinner = () => <div>Loading...</div>;
 * 
 * <AuthProvider config={config} loadingComponent={<LoadingSpinner />}>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider(props: AuthProviderProps): JSX.Element {
  const [user, setUser] = createSignal<User | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const authService = new AuthService(props.config);

  /**
   * Check authentication status and handle callback if necessary.
   * Automatically redirects to login if user is not authenticated.
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);

      if (authService.isCallbackUrl()) {
        const callbackUser = await authService.handleCallback();
        setUser(callbackUser);
        setIsLoading(false);
        return;
      }

      const currentUser = await authService.getUser();
      setUser(currentUser);

      if (!currentUser || currentUser.expired) {
        await authService.redirectToLogin();
        return;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      await authService.redirectToLogin();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initiate the login flow by redirecting to the OIDC provider.
   */
  const login = async () => {
    await authService.redirectToLogin();
  };

  /**
   * Log out the user and redirect to the OIDC provider's logout endpoint.
   */
  const logout = async () => {
    await authService.logout();
  };

  // Check authentication on component mount
  createEffect(async () => {
    await checkAuth();
  });

  // Create context value with auth state and methods
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: () => user() !== null && !user()?.expired,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <Show when={!isLoading()} fallback={props.loadingComponent}>
        {props.children}
      </Show>
    </AuthContext.Provider>
  );
}

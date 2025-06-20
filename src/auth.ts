import { UserManager, User, UserManagerSettings, SignoutRedirectArgs } from "oidc-client-ts";

/**
 * AuthService - OIDC authentication service for SolidJS applications
 * 
 * Usage example:
 * ```typescript
 * // Initialize the service
 * const authService = new AuthService({
 *   authority: "https://your-oidc-provider.com",
 *   client_id: "your-client-id",
 *   redirect_uri: "http://localhost:3000/callback",
 *   response_type: "code",
 *   scope: "openid profile email"
 * });
 * 
 * // Check if user is authenticated
 * const isAuth = await authService.isAuthenticated();
 * 
 * // Get current user
 * const user = await authService.getUser();
 * 
 * // Login
 * await authService.redirectToLogin();
 * 
 * // Handle callback (in your callback route)
 * if (authService.isCallbackUrl()) {
 *   const user = await authService.handleCallback();
 * }
 * 
 * // Logout
 * await authService.logout();
 * ```
 */
export class AuthService {
  private userManager: UserManager;

  constructor(config: UserManagerSettings) {
    this.userManager = new UserManager({
      authority: config.authority,
      client_id: config.client_id,
      redirect_uri: config.redirect_uri,
      response_type: config.response_type,
      scope: config.scope,
    });
  }

  /**
   * Get the currently authenticated user information.
   * @returns Promise<User | null> - User information or null if not authenticated
   */
  async getUser(): Promise<User | null> {
    try {
      return await this.userManager.getUser();
    } catch (error) {
      console.error("Failed to get user:", error);
      return null;
    }
  }

  /**
   * Check if the user is authenticated and the session is not expired.
   * @returns Promise<boolean> - True if authenticated, false otherwise
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return user !== null && !user.expired;
  }

  /**
   * Redirect the user to the OIDC provider's login page.
   * @throws Error if the redirect fails
   */
  async redirectToLogin(): Promise<void> {
    try {
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error("Failed to redirect to login:", error);
      throw error;
    }
  }

  /**
   * Handle the OIDC callback and process the authentication response.
   * Cleans up the URL by removing query parameters after processing.
   * @returns Promise<User | null> - The authenticated user information
   * @throws Error if callback processing fails
   */
  async handleCallback(): Promise<User | null> {
    try {
      const user = await this.userManager.signinRedirectCallback();

      window.history.replaceState({}, document.title, "/");
      return user;
    } catch (error) {
      console.error("Failed to handle callback:", error);
      throw error;
    }
  }

  /**
   * Log out the user and redirect to the OIDC provider's logout page.
   * @throws Error if logout fails
   */
  async logout(args?: SignoutRedirectArgs): Promise<void> {
    try {
      await this.userManager.signoutRedirect(args);
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  }

  /**
   * Check if the current URL is an OIDC callback URL.
   * Detects the presence of 'code' or 'error' parameters in the URL.
   * @returns boolean - True if this is a callback URL, false otherwise
   */
  isCallbackUrl(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("code") || urlParams.has("error");
  }
}

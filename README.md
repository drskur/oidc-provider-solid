# solidjs-oidc-provider

OpenID Connect & OAuth2 authentication provider for SolidJS applications.

## Installation

```bash
npm install solidjs-oidc-provider oidc-client-ts
```

## Usage

### 1. Wrap your app with AuthProvider

```tsx
import { render } from "solid-js/web";
import { AuthProvider } from "solid-oidc-provider";
import App from "./App";

const config = {
  authority: "https://your-oidc-provider.com",
  client_id: "your-client-id",
  redirect_uri: "http://localhost:3000/callback",
  response_type: "code",
  scope: "openid profile email",
};

render(
  () => (
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  ),
  document.getElementById("root")!
);
```

### 2. Use the useAuth hook in your components

```tsx
import { useAuth } from "solid-oidc-provider";

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated() ? (
        <>
          <h1>Welcome, {user()?.profile.name}!</h1>
          <p>Email: {user()?.profile.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login with OIDC</button>
      )}
    </div>
  );
}
```

## API Reference

### AuthProvider

The main provider component that manages authentication state.

**Props:**
- `config: UserManagerSettings` - OIDC client configuration
  - `authority`: Your OIDC provider URL
  - `client_id`: Your application's client ID
  - `redirect_uri`: Callback URL after authentication
  - `response_type`: OAuth2 response type (typically "code")
  - `scope`: Requested scopes (e.g., "openid profile email")

### useAuth Hook

Returns the authentication context with the following properties:

- `user: () => User | null` - Current authenticated user
- `isAuthenticated: () => boolean` - Whether the user is authenticated
- `isLoading: () => boolean` - Loading state during authentication
- `login: () => Promise<void>` - Initiate login flow
- `logout: () => Promise<void>` - Logout the user

### AuthService

Low-level service for direct OIDC operations:

```tsx
import { AuthService } from "solid-oidc-provider";

const authService = new AuthService(config);

// Check if current URL is a callback
if (authService.isCallbackUrl()) {
  const user = await authService.handleCallback();
}

// Get current user
const user = await authService.getUser();

// Check authentication
const isAuth = await authService.isAuthenticated();

// Login
await authService.redirectToLogin();

// Logout
await authService.logout();
```

## Configuration Examples

### Basic Configuration

```typescript
const config = {
  authority: "https://accounts.google.com",
  client_id: "your-google-client-id",
  redirect_uri: "http://localhost:3000/callback",
  response_type: "code",
  scope: "openid profile email",
};
```

### Advanced Configuration

```typescript
const config = {
  authority: "https://your-oidc-provider.com",
  client_id: "your-client-id",
  redirect_uri: "http://localhost:3000/callback",
  post_logout_redirect_uri: "http://localhost:3000/",
  response_type: "code",
  scope: "openid profile email offline_access",
  automaticSilentRenew: true,
  silentRequestTimeout: 10000,
  loadUserInfo: true,
};
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
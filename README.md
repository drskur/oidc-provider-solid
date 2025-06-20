# oidc-provider-solid

OpenID Connect & OAuth2 authentication provider for SolidJS applications.

## Installation

```bash
npm install oidc-provider-solid oidc-client-ts
```

## Usage

### 1. Wrap your app with AuthProvider

```tsx
import { render } from "solid-js/web";
import { AuthProvider } from "oidc-provider-solid";
import App from "./App";

const config = {
  authority: "https://your-oidc-provider.com",
  client_id: "your-client-id",
  redirect_uri: "http://localhost:3000/callback",
  response_type: "code",
  scope: "openid profile email",
};

// Optional: Custom loading component
const LoadingSpinner = () => (
  <div style={{ display: "flex", justify-content: "center", align-items: "center", height: "100vh" }}>
    <div>Loading...</div>
  </div>
);

render(
  () => (
    <AuthProvider config={config} loadingComponent={<LoadingSpinner />}>
      <App />
    </AuthProvider>
  ),
  document.getElementById("root")!
);
```

### 2. Use the useAuth hook in your components

```tsx
import { useAuth } from "oidc-provider-solid";

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

The main provider component that manages authentication state and provides loading state management.

**Props:**
- `config: UserManagerSettings` - OIDC client configuration
  - `authority`: Your OIDC provider URL
  - `client_id`: Your application's client ID
  - `redirect_uri`: Callback URL after authentication
  - `response_type`: OAuth2 response type (typically "code")
  - `scope`: Requested scopes (e.g., "openid profile email")
- `children: JSX.Element` - Child components to be wrapped with auth context
- `loadingComponent?: JSX.Element` - Optional component to show during authentication loading state (prevents flickering of previous content)

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
import { AuthService } from "oidc-provider-solid";

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
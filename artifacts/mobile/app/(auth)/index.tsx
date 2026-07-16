import { Redirect } from 'expo-router';

// Auth root just redirects — actual first screen is mode-select (handled by app/index.tsx)
export default function AuthIndex() {
  return <Redirect href="/(auth)/mode-select" />;
}

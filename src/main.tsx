
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const CLERK_PUBLISHABLE_KEY = "pk_test_c3Ryb25nLWJsdWVqYXktNDkuY2xlcmsuYWNjb3VudHMuZGV2JA"

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={CLERK_PUBLISHABLE_KEY}
    clerkJSVersion="5.56.0-snapshot.v20250312225817"
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    signInFallbackRedirectUrl="/home"
    signUpFallbackRedirectUrl="/home"
    afterSignOutUrl="/"
  >
    <App />
  </ClerkProvider>
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from '@/providers/query-provider'
import { ClerkProvider, RedirectToSignUp, } from '@clerk/clerk-react'
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { dark } from '@clerk/themes'
import SignInPage from './SignIn.tsx'
import { BrowserRouter } from 'react-router-dom'
import UserProfile from './components/ui/UserProfile.tsx'
import SignUp from './SignUp.tsx'
import SignUpPage from './SignUp.tsx'
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <ClerkProvider
//         appearance={{
//           baseTheme: dark,
//           layout: {
//             unsafe_disableDevelopmentModeWarnings: true,
//           },
//           // elements: {
//           //   footer: "hidden",
//           // },
//         }}
//         publishableKey={PUBLISHABLE_KEY}
//         afterSignOutUrl="/login">
//         <QueryProvider>
//            <SignedOut>
//             {/* <SignInPage /> */}
//             <SignUpPage />
//           </SignedOut>
        
//           <SignedIn>
//             <div className='flex flex-col justify-between items-end  w-full'>
//               <header>
//                 <UserProfile />
//               </header>
//               <App />
//             </div>
//           </SignedIn>
//         </QueryProvider>
//       </ClerkProvider>
//     </BrowserRouter>

//   </StrictMode>
// )
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/sign-in"
      >
        <QueryProvider>
          <App />
        </QueryProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
// src/components/AuthLayout.tsx
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-screen flex justify-around items-center h-screen transition-all duration-500 ease-in-out">
      <div className="w-2/6" >
        <img src="/logo/myaly-logo.png" />
      </div>
      <div className="fade-container w-full max-w-md">{children}</div>
    </div>
  );
}

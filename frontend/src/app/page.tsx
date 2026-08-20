'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { Triangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const handleGuestLogin = () => {
    login({
      id: "guest-123",
      name: "Dexter",
      username: "dexter",
      jobTitle: "Developer",
      email: "Dexter@gmail.com",
      avatarUrl: "https://i.pravatar.cc/150?u=dexter",
      theme: "light",
      color: "Blue"
    });
    router.push('/workspace');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8 p-10 bg-card rounded-3xl shadow-sm border border-border flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          <div className="bg-foreground text-card p-3 rounded-full mb-3 flex items-center justify-center h-12 w-12">
            <Triangle className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-xl font-bold">Pyramid...</h2>
        </div>

        {/* Header Text */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-foreground">Let's get back on track</h1>
          <p className="text-muted-foreground mt-2">Enter your email below to login to your account.</p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-4 mt-8">
          <button
            onClick={handleGuestLogin}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-black transition-colors"
          >
            Continue as Guest
          </button>

          <button
            className="w-full py-3 bg-card text-black border border-gray-300 rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Login with Google
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-8 text-center px-4">
          By clicking continue, you agree to our
          <a href="#" className="underline ml-1">Terms of Service</a> and
          <a href="#" className="underline ml-1">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function LoadingScreen() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Securing your session...</p>
        </div>
    );
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading, currentUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  const getInitials = (email: string) => {
    const parts = email.split('@');
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${currentUser?.email}`} alt="User avatar" />
                    <AvatarFallback className="text-3xl bg-muted">{currentUser?.email ? getInitials(currentUser.email) : 'U'}</AvatarFallback>
                </Avatar>
            </div>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>Welcome, you are successfully logged in!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center p-4 rounded-lg bg-accent/50">
                <ShieldCheck className="h-6 w-6 text-primary mr-4" />
                <div>
                    <p className="font-semibold text-primary-foreground">Welcome, {currentUser?.email}</p>
                    <p className="text-sm text-muted-foreground">Your session is secure.</p>
                </div>
            </div>
          
          <Button onClick={logout} className="w-full" variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

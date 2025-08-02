'use client';

import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { generateTempKey } from '@/ai/flows/generate-temp-key';
import type { User, Credentials, AuthContextType } from '@/lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching users from a database
    const storedUsers = sessionStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const tempKey = sessionStorage.getItem('tempKey');
    const userEmail = sessionStorage.getItem('userEmail');

    if (tempKey && userEmail) {
      setIsAuthenticated(true);
      setCurrentUser({ email: userEmail, password: '' });
    }
    setIsLoading(false);
  }, []);

  const signup = async (credentials: Credentials): Promise<void> => {
    setIsSubmitting(true);
    const userExists = users.find(user => user.email === credentials.email);

    if (userExists) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'A user with this email already exists.',
      });
      setIsSubmitting(false);
      return;
    }
    
    const newUsers = [...users, credentials];
    setUsers(newUsers);
    sessionStorage.setItem('users', JSON.stringify(newUsers));

    toast({
      title: 'Signup Successful',
      description: 'You can now log in with your credentials.',
    });
    router.push('/login');
    setIsSubmitting(false);
  };

  const login = async (credentials: Credentials): Promise<void> => {
    setIsSubmitting(true);
    const user = users.find(
      user => user.email === credentials.email && user.password === credentials.password
    );

    if (user) {
      try {
        const { tempKey } = await generateTempKey({ email: user.email });
        sessionStorage.setItem('tempKey', tempKey);
        sessionStorage.setItem('userEmail', user.email);
        setIsAuthenticated(true);
        setCurrentUser(user);
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
        router.push('/dashboard');
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Login Error',
          description: 'Could not generate a session key. Please try again.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password.',
      });
    }
    setIsSubmitting(false);
  };

  const logout = (): void => {
    sessionStorage.removeItem('tempKey');
    sessionStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.push('/login');
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    isSubmitting,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };

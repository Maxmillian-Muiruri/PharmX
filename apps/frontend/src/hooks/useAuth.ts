import { useEffect, useState } from 'react';

interface User {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  profilePicture: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('pharmacie_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);

    // Listen for auth changes (e.g., from other tabs or signup)
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('pharmacie_user');
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('pharmacie_user');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
  };

  return { user, isLoading, isLoggedIn: !!user, logout };
}

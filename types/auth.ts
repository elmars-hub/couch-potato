export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl?: string | null;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
  }) => Promise<{ error: AuthError | null }>;
  refetchUser: () => void;
}

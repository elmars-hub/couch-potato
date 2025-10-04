export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: { message: string } | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
  }) => Promise<{ error: { message: string } | null }>;
  refetchUser: () => void;
}

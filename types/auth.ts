export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AuthActionResponse = {
  error: { message: string } | null;
};

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthActionResponse>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<AuthActionResponse>;
  signOut: () => Promise<AuthActionResponse>;
  updateProfile: (updates: { name?: string }) => Promise<AuthActionResponse>;
  refetchUser: () => void;
}

export interface AuthContextType {
  user: string | null;
  signin: (username: string) => void;
  signout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

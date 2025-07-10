export interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

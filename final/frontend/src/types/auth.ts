export interface AuthContextType {
  user: string | null;
  signin: (username: string) => void;
  signout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface SignInResponse {
  token: string;
  username: string;
}

export interface SignUpResponse {
  message: string;
}

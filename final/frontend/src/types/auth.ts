export interface AuthContextType {
  user: string | undefined;
  signin: (username: string) => void;
  signout: () => Promise<void>;
}

export interface AuthProviderProperties {
  children: React.ReactNode;
}

export interface SignInResponse {
  token: string;
  username: string;
}

export interface SignUpResponse {
  message: string;
}

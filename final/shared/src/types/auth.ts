export interface SignupRequestBody {
  username: string;
  password: string;
}

export interface SigninRequestBody {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

export interface SignInResponse {
  token: string;
  username: string;
}

export interface SignUpResponse {
  message: string;
}

import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

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

export interface ErrorResponse {
  message: string;
}

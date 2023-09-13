import { Router } from "express";

export interface IRoutes {
    path?: string,
    router: Router
}

export interface IApiResponse<T> {
  status: number;
  token?: string;
  data: T | null;
  error?: string | null;
}

export interface ILogin {
  email: string;
  password: string;
}

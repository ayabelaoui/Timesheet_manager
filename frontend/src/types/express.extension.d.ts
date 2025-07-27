import { Request } from 'express';

declare module 'express' {
  interface Request {
    cookies?: {
      [key: string]: string;
    };
    headers: Headers & {
      cookie?: string;
    };
  }
}
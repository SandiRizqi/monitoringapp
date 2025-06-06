// next-auth.d.ts
import { DefaultSession} from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken: string;
    idToken: string;
     user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      
      /** Custom token from backend */
      token?: string;
    };
  }
}
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";


// Extend JWT type
// Extend JWT type
interface ExtendedJWT extends JWT {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
}

interface ResponseUser {
  message: string
  user_id: string
  email: string
  token: string
}




// Function to refresh access token
async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }).toString(),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000, // Token expiration time
      refreshToken: token.refreshToken, // Keep the old refresh token
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" }; // Mark session as invalid
  }
};




async function saveUser(user: AdapterUser, id: string): Promise<ResponseUser | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/accounts/saveuser/?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      console.error("Failed to save user:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data; // return data jika berhasil
  } catch (err) {
    console.error("Error saving user:", err);
    return null; // return null jika error terjadi
  }
}




export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
  pages: {
    signIn : "/signin"
  },
  secret: process.env.NEXT_AUTHSECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }): Promise<ExtendedJWT> {
      // console.log(token)
      // Initial sign in
      if (account && user) {
        const responseUser = await saveUser(user as AdapterUser, user.id as string)
        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token, // Google ID Token (JWT)
          refreshToken: account.refresh_token,
          userToken: responseUser?.token,
          id: user.id,
          ...account
        }
      };
      const now = Date.now();
      
      if (typeof token.expires_at === "number" && now > token.expires_at) {
        console.log("Access token expired, refreshing...");
        return await refreshAccessToken(token);
      }

      return token;
    },


    async session({ session, token }) {
      
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          token: token.userToken
        },
        accessToken: token.accessToken,
        idToken: token.idToken,
        refreshToken: token.refreshToken
      }
    },
  },
}
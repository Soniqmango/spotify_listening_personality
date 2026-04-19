import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const SPOTIFY_SCOPES = [
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
].join(" ");

async function refreshAccessToken(token: {
  refreshToken: string;
  accessToken: string;
  accessTokenExpires: number;
  spotifyId: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  error?: string;
}) {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const refreshed = await response.json();

    if (!response.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: { scope: SPOTIFY_SCOPES },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // First sign-in: persist Spotify tokens onto the JWT
      if (account && profile) {
        return {
          ...token,
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          accessTokenExpires: account.expires_at! * 1000,
          spotifyId: account.providerAccountId,
        };
      }

      // Token still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Token expired — refresh
      return refreshAccessToken(token as Parameters<typeof refreshAccessToken>[0]);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.spotifyId = token.spotifyId as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

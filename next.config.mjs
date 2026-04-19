/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.scdn.co" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "*.spotifycdn.com" },
      // Spotify user profile images are hosted on platform-lookaside.fbsbx.com or thispersondoesnotexist equivalents
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" },
    ],
  },
};

export default nextConfig;

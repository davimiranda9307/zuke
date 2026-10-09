/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Upload de foto das lojas no admin (a foto já é reduzida no navegador).
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;

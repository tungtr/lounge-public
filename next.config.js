/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    GIPHY_KEY: process.env.GIPHY_KEY
  }
}

module.exports = nextConfig

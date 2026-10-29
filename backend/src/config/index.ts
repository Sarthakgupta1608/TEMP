import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('Fatal: JWT_ACCESS_SECRET and JWT_REFRESH_SECRET environment variables must be defined in production.');
  }
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_only_for_local_development',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_only_for_local_development',
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },

  openai: {
    apiKey: process.env.AI_API_KEY || 'sk-placeholder-openai-key',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_razorpay_secret',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'traveller-cloud',
    apiKey: process.env.CLOUDINARY_API_KEY || 'placeholder_key',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'placeholder_secret',
  },
};

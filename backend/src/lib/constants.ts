// lib/constants.ts
export const ADMIN_CORS = process.env.ADMIN_CORS;
export const AUTH_CORS = process.env.AUTH_CORS;
export const BACKEND_URL = process.env.BACKEND_URL;
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REDIS_URL = process.env.REDIS_URL;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
export const SHOULD_DISABLE_ADMIN = process.env.SHOULD_DISABLE_ADMIN;
export const STORE_CORS = process.env.STORE_CORS;
export const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
export const WORKER_MODE = process.env.WORKER_MODE;
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const MINIO_BUCKET = process.env.MINIO_BUCKET;
export const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST;
export const MEILISEARCH_ADMIN_KEY = process.env.MEILISEARCH_ADMIN_KEY;

// PayPal Configuration
export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
export const PAYPAL_SANDBOX = process.env.PAYPAL_SANDBOX === 'true';
export const PAYPAL_AUTH_WEBHOOK_ID = process.env.PAYPAL_AUTH_WEBHOOK_ID;
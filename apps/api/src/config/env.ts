import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  SIWE_DOMAIN: z.string().default("localhost:3000"),
  SIWE_URI: z.string().default("http://localhost:3000"),
  APP_URL: z.string().default("http://localhost:3000"),
  RPC_URL_MAINNET: z.string().url().optional(),
  INDEXER_ENABLED: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID: z.string().optional(),
  BILLING_MOCK: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  BILLING_PLAN_NAME: z.string().default("Strategy Engine Pro"),
  BILLING_PRICE_USD: z.coerce.number().default(29),
});

export const env = envSchema.parse(process.env);

export const billingConfig = {
  planName: env.BILLING_PLAN_NAME,
  priceUsd: env.BILLING_PRICE_USD,
  interval: "month" as const,
  mockMode:
    env.BILLING_MOCK ||
    !env.STRIPE_SECRET_KEY ||
    !env.STRIPE_PRICE_ID,
};

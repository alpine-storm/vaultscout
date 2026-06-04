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
  RPC_URL_MAINNET: z.string().url().optional(),
  INDEXER_ENABLED: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
});

export const env = envSchema.parse(process.env);

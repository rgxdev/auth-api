import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET!;
export const DATABASE_URL = process.env.DATABASE_URL!;

export const COOKIES_DOMAIN = process.env.NODE_ENV === "development" ? "localhost:3000" : ".schulsync.com";
export const LOGIN_DOMAIN = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://dash.schulsync.com";

export const DOMAIN = "localhost"

export const BETA_MODE = true;
export const DISABLE_SEND_MAIL = true;

export const API_VERSION = "v1";
export const SERVICE_NAME = "TESTAPP";

export const URL_DOMAIN = "test.com";
export const URL_PROTOCOL = "https";
export const VERIFY_EMAIL_DOMAIN = "test.test.com"
export const DISCORD_INVITE = "https://discord.gg/invite";


export const TWO_FACTOR_ISSUER = "TEST";
export const TWO_FACTOR_DIGITS = 6;
export const TWO_FACTOR_PERIOD = 30;

export const LOG_PATH = "PATH";

export const APP_VERSION = "0.0.1";
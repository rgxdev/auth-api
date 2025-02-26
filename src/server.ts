// src/server.ts

import express, {Router} from 'express';
import {readdirSync} from 'fs';
import {join, resolve} from 'path';
import cors from 'cors';
import expressUseragent from 'express-useragent';
import deleteExpiredWhitelistEntries from '@/automation/deleteExpiredWhitelistEntries';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {errorHandler} from "@/middleware/errorHandler";

const app = express();
const apiVersion = 'v1';

app.set('trust proxy', false);

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        type: 'api_error',
        message: 'Too many requests from this IP, please try again later.',
    },
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(expressUseragent.express());

const allowedOrigins = [
    'https://auth.schulsync.com',
    'https://schulsync.com',
    'https://dash.schulsync.com',
    'http://localhost:3000',
    'https://api.schulsync.com',
    'http://192.168.101.59:3000',
    'capacitor://localhost',
    'http://localhost',
    'https://localhost',

];

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin) {
            callback(null, true);
        } else if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(
                new Error('CORS policy does not allow access from the specified Origin: ' + origin),
                false
            );
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const registerRoutesFromDirectory = (directory: string, router: Router) => {
    const normalizedPath = resolve(directory);

    readdirSync(normalizedPath, {withFileTypes: true}).forEach((file) => {
        const fullPath = join(normalizedPath, file.name);

        if (file.isDirectory()) {
            const newRouter = Router();
            router.use(`/${file.name}`, newRouter);
            registerRoutesFromDirectory(fullPath, newRouter);
        } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
            try {
                const routeModule = require(fullPath).default;
                if (typeof routeModule === 'function') {
                    routeModule(router);
                    console.log(`${fullPath} loaded`);
                } else {
                    console.warn(`Route file ${fullPath} does not export a default function.`);
                }
            } catch (error) {
                console.error(`Failed to load route ${fullPath}:`, error);
            }
        }
    });
};

const apiRouter = Router();
registerRoutesFromDirectory(join(__dirname, 'api', apiVersion), apiRouter);
app.use('/', apiRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 1407;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    deleteExpiredWhitelistEntries();
});

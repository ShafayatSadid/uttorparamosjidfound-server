import dotenv from 'dotenv';
dotenv.config();

const required = ['MONGODB_URI', 'DB_NAME', 'CLIENT_URL'];

for (const key of required) {
    if (!process.env[key]) {
        console.error(`❌ Missing env variable: ${key}`);
        process.exit(1);
    }
}

export const env = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI as string,
    DB_NAME: process.env.DB_NAME as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
};
require('dotenv').config();

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_CuNH5sBka6Yo@ep-billowing-tooth-axtka8r4-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

// Configure pg Pool for Neon PostgreSQL with clean SSL parameters
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
    console.warn('⚠️ Idle database pool error:', err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;

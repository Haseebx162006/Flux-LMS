const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is required in .env');
}

let prisma;
const dbUrl = process.env.DATABASE_URL;

if (dbUrl.startsWith('prisma+postgres://') || dbUrl.startsWith('prisma://')) {
	prisma = new PrismaClient({ accelerateUrl: dbUrl });
} else {
	try {
		const { Pool } = require('pg');
		const { PrismaPg } = require('@prisma/adapter-pg');
		const pool = new Pool({ connectionString: dbUrl });
		const adapter = new PrismaPg(pool);
		prisma = new PrismaClient({ adapter });
	} catch (e) {
		prisma = new PrismaClient();
	}
}

module.exports = prisma;

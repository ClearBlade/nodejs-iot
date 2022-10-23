import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync('.env')) {
  console.log('Using .env file to supply config environment variables');
  dotenv.config({path: '.env'});
} else {
  console.log('Using .env.config file to supply config environment variables');
  dotenv.config({path: '.env.config'}); // you can delete this after you create your own .env file!
}
//export const ENVIRONMENT = process.env.NODE_ENV;
//const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const ADMIN_SYSTEM_KEY = process.env['ADMIN_SYSTEM_KEY'];
export const ADMIN_USER_TOKEN = process.env['ADMIN_USER_TOKEN'];

if (!ADMIN_SYSTEM_KEY) {
  console.log('No client secret. Set ADMIN_SYSTEM_KEY environment variable.');
  process.exit(1);
}
if (!ADMIN_USER_TOKEN) {
  console.log('No client secret. Set ADMIN_USER_TOKEN environment variable.');
  process.exit(1);
}

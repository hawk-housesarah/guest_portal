const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const checkinEnvFile = process.env.CHECKIN_ENV_FILE || '.env.production';
const luggageEnvFile = process.env.LUGGAGE_ENV_FILE || '.env.production.luggage';

const parsedCheckin = dotenv.parse(fs.readFileSync(path.resolve(__dirname, checkinEnvFile)));
const parsedLuggage = dotenv.parse(fs.readFileSync(path.resolve(__dirname, luggageEnvFile)));

console.log(`[PM2] Checkin env: ${checkinEnvFile}`);
console.log(`[PM2] Luggage env: ${luggageEnvFile}`);

module.exports = {
  apps: [
    {
      name: 'guest-portal-checkin',
      port: '3000',
      script: './.output/server/index.mjs',
      instances: 1,
      env: parsedCheckin,
    },
    {
      name: 'guest-portal-luggage',
      port: '8080',
      script: './.output/server/index.mjs',
      instances: 1,
      env: parsedLuggage,
    },
  ],
};

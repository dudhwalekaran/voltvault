const crypto = require('crypto');

const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('hex'); // Generates a 256-bit secret
};

const jwtSecret = generateJWTSecret();
console.log('Your JWT Secret:', jwtSecret);

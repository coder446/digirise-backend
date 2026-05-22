require('dotenv').config();
console.log('DB_HOST:', process.env.DB_HOST || 'not set');
console.log('DB_USER:', process.env.DB_USER || 'not set');
console.log('DB_NAME:', process.env.DB_NAME || 'not set');
console.log('DB_PORT:', process.env.DB_PORT || 'not set');
console.log('CWD:', process.cwd());

console.log('Test'); require('./dist/config/database.js').default({ env: (key, def) => process.env[key] || def });

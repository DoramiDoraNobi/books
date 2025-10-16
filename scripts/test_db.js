require('dotenv').config();
const pool = require('../src/db/pool');

(async () => {
  try {
    const res = await pool.query('SELECT 1 AS ok');
    console.log('DB connection successful:', res.rows[0]);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('DB connection failed:', err.message);
    // Print full error for debugging (without leaking secrets normally)
    console.error(err);
    try { await pool.end(); } catch (_) {}
    process.exit(1);
  }
})();

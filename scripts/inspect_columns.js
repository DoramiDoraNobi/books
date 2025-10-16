const pool = require('../src/db/pool');

(async () => {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='books' AND table_schema='public' ORDER BY ordinal_position");
    console.log('books table columns:', res.rows.map(r => r.column_name));
    await pool.end();
  } catch (err) {
    console.error('error querying columns:', err.message || err);
    process.exit(1);
  }
})();

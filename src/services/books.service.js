class BooksService {
    constructor(pool) {
        this.pool = pool;
        this.tableColumns = null; // cache of columns for 'books' table
    }

    // Fetch and cache column names for the books table
    async getTableColumns() {
        if (this.tableColumns) return this.tableColumns;
        const q = `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'books' AND table_schema = 'public'
        `;
        const res = await this.pool.query(q);
        this.tableColumns = res.rows.map(r => r.column_name);
        return this.tableColumns;
    }

    // Helper to convert snake_case column to camelCase key
    snakeToCamel(s) {
        return s.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());
    }

    // Normalize client input to DB columns available in current schema
    normalizeInput(input) {
        if (!input || typeof input !== 'object') return {};
        const out = { ...input };

        // If client sends published_date (full date), convert to published_year if present in DB
        if (input.published_date) {
            const d = new Date(input.published_date);
            if (!isNaN(d)) out.published_year = d.getFullYear();
        }
        if (input.publishedDate) {
            const d = new Date(input.publishedDate);
            if (!isNaN(d)) out.published_year = d.getFullYear();
        }

        // If client sends published_year (number/string) or publishedYear (camelCase), normalize to published_year
        if (Object.prototype.hasOwnProperty.call(input, 'published_year')) {
            const v = input.published_year;
            const n = Number(v);
            if (!Number.isNaN(n)) out.published_year = Math.floor(n);
        }
        if (Object.prototype.hasOwnProperty.call(input, 'publishedYear')) {
            const v = input.publishedYear;
            const n = Number(v);
            if (!Number.isNaN(n)) out.published_year = Math.floor(n);
        }

        // Normalize boolean-ish available values
        if (Object.prototype.hasOwnProperty.call(input, 'available')) {
            const v = input.available;
            if (typeof v === 'string') {
                out.available = ['true', '1', 'yes', 'y'].includes(v.toLowerCase());
            } else {
                out.available = Boolean(v);
            }
        }

        // Accept both snake_case and camelCase for cover image etc. (pass through)
        return out;
    }

    async addBook(bookData) {
        const cols = await this.getTableColumns();
        const normalized = this.normalizeInput(bookData);

        // we won't insert the primary key 'id'
        const insertCols = cols.filter(c => c !== 'id');

        // prepare values in the same order as insertCols
        const values = insertCols.map(col => {
            // prefer normalized input, then original keys (snake or camel)
            if (Object.prototype.hasOwnProperty.call(normalized, col)) return normalized[col];
            if (Object.prototype.hasOwnProperty.call(bookData, col)) return bookData[col];
            const camel = this.snakeToCamel(col);
            if (Object.prototype.hasOwnProperty.call(bookData, camel)) return bookData[camel];
            return null;
        });

        const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO books (${insertCols.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async fetchAllBooks() {
        const query = 'SELECT * FROM books ORDER BY id';
        const result = await this.pool.query(query);
        return result.rows;
    }

    async findBookById(id) {
        const query = 'SELECT * FROM books WHERE id = $1';
        const result = await this.pool.query(query, [id]);
        return result.rows[0];
    }

    async updateBook(id, bookData) {
        const existing = await this.findBookById(id);
        if (!existing) return null;

        const cols = await this.getTableColumns();
        const normalized = this.normalizeInput(bookData);

        // exclude primary key and any server-managed columns
        const updatableCols = cols.filter(c => c !== 'id');

        const setClauses = [];
        const values = [];
        let idx = 1;

        for (const col of updatableCols) {
            // determine new value: prefer provided in bookData (snake or camel), otherwise keep existing value
            let val;
            if (Object.prototype.hasOwnProperty.call(normalized, col)) val = normalized[col];
            else if (Object.prototype.hasOwnProperty.call(bookData, col)) val = bookData[col];
            else {
                const camel = this.snakeToCamel(col);
                if (Object.prototype.hasOwnProperty.call(bookData, camel)) val = bookData[camel];
                else val = existing[col];
            }

            // skip columns that are not changing? we'll include them to keep behavior consistent
            setClauses.push(`${col} = $${idx}`);
            values.push(val === undefined ? null : val);
            idx++;
        }

        const query = `UPDATE books SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`;
        values.push(id);

        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async deleteBook(id) {
        const result = await this.pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = BooksService;
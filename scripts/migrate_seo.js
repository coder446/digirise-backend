const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function migrate() {
    try {
        console.log('Starting SEO schema migration...');
        
        // Ensure the SEO fields SQL script exists
        const sqlFilePath = path.join(__dirname, '..', 'seo_fields.sql');
        if (!fs.existsSync(sqlFilePath)) {
            throw new Error(`Migration file not found at ${sqlFilePath}`);
        }

        const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
        
        // Split by semicolon to run statements sequentially, filtering empty ones
        const statements = sqlScript.split(';').map(s => s.trim()).filter(s => s.length > 0);

        for (let statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            try {
                await db.query(statement);
                console.log('Success.');
            } catch (err) {
                // Ignore "Duplicate column name" errors so the script is idempotent
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log('Columns already exist, skipping.');
                } else {
                    console.error('Error executing statement:', err.message);
                }
            }
        }
        
        console.log('Migration complete. You can now use the SEO fields in your CMS.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();

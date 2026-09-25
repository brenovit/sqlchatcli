import Database from 'better-sqlite3';

const dbName = process.env.DB_NAME || 'app';
const dbFileName = process.env.DB_NAME ? `${process.env.DB_NAME}_app.db` : 'app.db';

export const knowledgeDb = new Database(dbFileName);

knowledgeDb.exec(`
  CREATE TABLE IF NOT EXISTS knowledge_table (
    table_name      TEXT NOT NULL,
    column_name     TEXT,
    data_type       TEXT,
    description     TEXT
  );
`);

// Helper to extract schema information for LLM context
export function getKnowledgeTable() {
  return JSON.stringify(knowledgeDb.prepare('SELECT * FROM knowledge_table').all());
}



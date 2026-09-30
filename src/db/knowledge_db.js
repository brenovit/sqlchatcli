import Database from 'better-sqlite3';

const dbFileName = process.env.DB_NAME ? `assets/${process.env.DB_NAME}_app.db` : undefined;

if (!dbFileName) {
  throw Error("Source database not defined, set it as 'DB_NAME' on .env file")
}

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



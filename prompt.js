import { generateText, tool } from 'ai';
import { z } from 'zod';
import { confirm } from '@inquirer/prompts';
import { getLanguageModel } from './aiclient.js';
import { db } from './data_db.js';

export async function runAgent(userPrompt, knowledgeTable) {
  const model = getLanguageModel();

  const response = await generateText({
    model,
    system: `You are a database analyst for SQLite. Your goal is to help the user by answering their question properly.
Given the following database schema context:

${knowledgeTable}

To answer the user's question, use the "generateSql" tool. Always pass the SQL query string in the "sql" parameter, e.g. {"sql": "SELECT ..."};
After running the tool, summarize the answer concisely based on the query results.`,
    prompt: userPrompt,
    tools: {
      generateSql: tool({
        description: 'Generate and execute a SQLite SQL query based on user question and database schema.',
        parameters: z.object({
          sql: z.string().optional().describe('The SQLite SQL query to execute.'),
        }).passthrough(),
        execute: generateSqlExecution
      }),
    },
    maxSteps: 5,
  });

  return response.text;
}
async function generateSqlExecution(input) {
  let sql = sanitizeInput(input);

  console.log("generateSqlExecution", sql)
  return await runSql(sql)
}

async function runSql(sql) {
  console.log("sql", sql)
  if (!sql || typeof sql !== 'string' || !sql.trim()) {
    console.error('\n❌ Execution Error: No valid SQL query was provided by the model.\n');
    return { status: 'error', error: 'No valid SQL query string provided.' };
  }

  console.log(`\nProposed SQL Query:\n\x1b[36m${sql}\x1b[0m\n`);

  const shouldRun = await confirm({
    message: 'Do you want to execute this query against your database?',
    default: true,
  });

  if (!shouldRun) {
    console.log('Query execution canceled by user.\n');
    return { status: 'canceled', message: 'Query execution was canceled by the user.' };
  }

  console.log('Executing query...');
  try {
    const queryResult = db.prepare(sql).all();
    if (queryResult.length > 0) {
      console.table(queryResult);
    } else {
      console.log('(no rows returned)');
    }
    return { status: 'success', rowCount: queryResult.length, rows: queryResult };
  } catch (err) {
    console.error(`\n❌ Execution Error: ${err.message}\n`);
    return { status: 'error', error: err.message };
  }
}

function sanitizeInput(input) {
  console.log("Input from model", input)

  return typeof args === 'string'
    ? args
    : (args?.sql || args?.query || args?.sql_query || args?.input || (args && typeof args === 'object' ? Object.values(args).find(v => typeof v === 'string') : null));
}
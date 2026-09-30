import { generateText } from 'ai';
import { getLanguageModel } from './aiclient.js';
import { SYSTEM_PROMPT } from './prompt_buider.js';
import { generateSqlExecutionTool } from './agent_tool_generateSql.js';

export async function runAgent(userPrompt, knowledgeTable) {
  const model = getLanguageModel();

  const response = await generateText({
    model,
    system: SYSTEM_PROMPT(knowledgeTable),
    prompt: userPrompt,
    tools: {
      generateSql: generateSqlExecutionTool
    },
    maxSteps: 5,

  });

  return response.text;
}
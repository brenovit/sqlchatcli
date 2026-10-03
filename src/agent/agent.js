import { generateText } from 'ai';
import { getLanguageModel } from './aiclient.js';
import { SYSTEM_PROMPT } from './prompt_buider.js';
import { generateSqlExecutionTool } from './agent_tool_generateSql.js';
import { openai } from '@ai-sdk/openai';

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
    providerOptions: {
      openai: {
        parallelToolCalls: false,
      }
    }
  });

  return response.text;
}
import OpenAI from 'jsr:@openai/openai';
import mappings from '../../resources/template-column-mappings.json' with { type: 'json' };
import { VisitTypes } from '../../utils/mappings.types.ts';

const client = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
});

/**
 * Generates prompt, given visit type and prompt
 * @param visit - Visit type
 * @param prompt - Text prompt to be mapped
 * @returns Prompt for the GPT model
 */
export function promptGenerator(visit: VisitTypes, prompt: string): string {
  const mapping = mappings.visit[visit];

  return `
  Given the json mapping, map the prompt to the correct values.
  For boolean values, return a 1 if true, and 0 if false.
  For dates, return the date in the format "YYYY-MM-DD".
  If a value is not present in the prompt, do not include it.
  **Only reply with a json object, that has the fields in the mappings replaced**
  **Do not format it as markdown, or include any other text**
  ----------------------------------------------
  Mapping:
  ${JSON.stringify(mapping)}

  Prompt:
  ${prompt}
  `;
}

/**
 * Prompts the GPT model with the given visit type and prompt
 * @param visit - Visit type
 * @param prompt - Text prompt to be mapped
 * @returns Response from the GPT model as an object
 */
export async function promptGpt(visit: VisitTypes, prompt: string) {
  const promptText = promptGenerator(visit, prompt);
  // Call GPT model with promptText
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: promptText }],
  });
  return JSON.parse(response.choices[0].message.content ?? '{}');
}

// Tests (TODO: Remove this and write proper tests)
type PromptType = [VisitTypes, string];
const prompt1: PromptType = [
  'first',
  `50kg, 170 cm. BMI of 24. QOL 3, and 2 weeks of VLCD.
  Operation date on 1st Jan 2025, by Dr. Jason. No complications.
  HBP, Diabetes, cholestrol problems, all no.
  HBA1C 3.
  Diabetes medications, none.`,
];

const prompt2: PromptType = ['operation', `45 kg, 24bmi.`];
const prompt3: PromptType = ['6months', `Weight is now 60kg. New BMI: 24.`];
const [date, prompt] = prompt1;

// console.log(promptGenerator(date, prompt));

export const sampleOutput = {
  weight: 50,
  height: 170,
  bmi: null,
  QOL: 3,
  VLCD: 2,
  operationDate: '2025-01-01',
  surgeonName: 'Dr. Jason',
  diabetes: 0,
  HBP: 0,
  cholestrol: 0,
  HBA1C: 3,
  diabetesMedication: 0,
};
export const sampleDate = 'first';

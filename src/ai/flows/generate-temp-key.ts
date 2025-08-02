'use server';

/**
 * @fileOverview A flow for generating temporary keys using GenAI for enhanced session security.
 *
 * - generateTempKey - A function that generates a temporary key.
 * - GenerateTempKeyInput - The input type for the generateTempKey function.
 * - GenerateTempKeyOutput - The return type for the generateTempKey function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTempKeyInputSchema = z.object({
  email: z.string().describe('The user email.'),
});
export type GenerateTempKeyInput = z.infer<typeof GenerateTempKeyInputSchema>;

const GenerateTempKeyOutputSchema = z.object({
  tempKey: z.string().describe('The generated temporary key.'),
});
export type GenerateTempKeyOutput = z.infer<typeof GenerateTempKeyOutputSchema>;

export async function generateTempKey(input: GenerateTempKeyInput): Promise<GenerateTempKeyOutput> {
  return generateTempKeyFlow(input);
}

const generateTempKeyPrompt = ai.definePrompt({
  name: 'generateTempKeyPrompt',
  input: {schema: GenerateTempKeyInputSchema},
  output: {schema: GenerateTempKeyOutputSchema},
  prompt: `You are a security expert generating temporary keys for user sessions.

  Generate a unique temporary key for the user with the following email: {{{email}}}. The key should be a random string.
  Return the generated key.
  The temporary key is: `,
});

const generateTempKeyFlow = ai.defineFlow(
  {
    name: 'generateTempKeyFlow',
    inputSchema: GenerateTempKeyInputSchema,
    outputSchema: GenerateTempKeyOutputSchema,
  },
  async input => {
    const {output} = await generateTempKeyPrompt(input);
    return output!;
  }
);

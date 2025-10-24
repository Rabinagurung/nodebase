import { inngest } from "@/inngest/client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import {createAnthropic} from "@ai-sdk/anthropic";
import { generateText } from "ai";


const google = createGoogleGenerativeAI();
const openAI = createOpenAI();
const anthropic = createAnthropic();


/**
 * Inngest function: executeAI
 * 
 * This function uses the Inngest platform to trigger an AI-powered text generation step
 * via Google's Generative AI (Gemini) model. It demonstrates how to wrap AI calls using
 * the `step.ai.wrap()` utility for observability, retries, and consistency within an
 * Inngest workflow.
 * 
 * ### Workflow:
 * 1. The function listens for the `execute/ai` event.
 * 2. When triggered, it wraps the `generateText` function from the `ai` SDK.
 * 3. The wrapped function executes a Gemini model prompt via the Google AI SDK.
 * 4. The step is tracked by Inngest, allowing retries, metrics, and logging.
 * 
 * ### Step Wrapping Details:
 * `step.ai.wrap()` accepts three arguments:
 * - **name** (`string`): Identifier for the AI step (used in Inngest UI and logs).
 * - **fn** (`Function`): The function to wrap — in this case, `generateText`.
 * - **props** (`object`): Configuration for the wrapped function, including:
 *   - `model`: The AI model to use.
 *   - `system`: The system prompt (sets model behavior).
 *   - `prompt`: The user input or query to process.
 * 
 * ### Example:
 * The example below generates a response to the prompt "What is 2+2?" using the Gemini model.
 * 
 * @function executeAI
 * @async
 * @param {Object} context - Inngest execution context.
 * @param {Object} context.event - The triggering event payload.
 * @param {Object} context.step - Inngest step utilities for wrapping and tracking function calls.
 * @returns {Promise<Object>} The result of the wrapped AI step execution.
 */
export const executeAI = inngest.createFunction(
    { id: "execute-ai", retries: 5}, 
    { event: "execute/ai" }, 
    async ({event, step}) => {
       
        await step.sleep("pretend", "5s")

        
        const { steps: geminiSteps } = await step.ai.wrap(
            "gemini-generate-text", 
            generateText, 
            {
                model: google("gemini-2.5-flash"),
                system: "You are a helpful assistant", 
                prompt: "What is 2+2 ?"
            }
        );

        const {steps: openAISteps} = await step.ai.wrap(
            "openai-generate-text", 
            generateText, 
            {
                model: openAI("gpt-4"),
                system: "You are a helpful assistant", 
                prompt: "What is 2+2 ?"
            }
        )

        const { steps: anthropicSteps} = await step.ai.wrap(
            "anthropic-generate-text", 
            generateText, 
            {
                model: anthropic("claude-3-7-sonnet-latest"), 
                system: "You are a helpful assistant", 
                prompt: "What is 2+2 ?"
            }
        )

        return {
            geminiSteps, 
            openAISteps, 
            anthropicSteps
        };
    }
)
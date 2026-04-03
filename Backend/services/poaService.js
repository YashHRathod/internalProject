const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
const { z } = require("zod");
const { format } = require("date-fns");

const POA_PROMPT = `You are a Productivity Expert. Below is a JSON list of tasks. Generate a sequential Plan of Action (POA).
- Start scheduling from today: {current_time}.
- Respect the priority level of each task.
- EDGE CASE: If a task has low priority but its createdAt is more than 3 days ago, treat it as medium priority. If more than 7 days ago, treat it as high priority. Aging tasks must not be neglected.
- High-priority tasks should be scheduled first, followed by medium, then low.
- Estimate realistic durations: simple tasks ~30 minutes, moderate tasks ~1 hour, complex tasks ~2 hours. Use the description to judge complexity.
- Leave 15-minute buffer gaps between tasks.
- Schedule only during working hours (9:00 AM to 6:00 PM). If tasks overflow, continue on the next working day.

{format_instructions}

Return ONLY the JSON array. No explanation.`;

const eventSchema = z.object({
  summary: z.string().describe("The task title"),
  description: z.string().describe("The task description"),
  start: z.object({
    dateTime: z.string().describe("ISO8601 start time"),
    timeZone: z.string().describe("IANA timezone e.g. Asia/Kolkata"),
  }),
  end: z.object({
    dateTime: z.string().describe("ISO8601 end time"),
    timeZone: z.string().describe("IANA timezone e.g. Asia/Kolkata"),
  }),
});

const poaSchema = z
  .array(eventSchema)
  .describe("Array of Google Calendar events");

const parser = StructuredOutputParser.fromZodSchema(poaSchema);

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", POA_PROMPT],
  ["human", "Here are the tasks to schedule:\n{tasks}"],
]);

/**
 * Transforms a list of tasks into a scheduled Plan of Action (POA) using an LLM.
 * @param {Array<{title: string, description: string, priority: string, createdAt?: Date|string}>} tasks - Array of task objects
 * @returns {Promise<Array>} - Array of Google Calendar event objects compatible with events.insert
 */
async function generatePOA(tasks) {
  const currentTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");
  const tasksForPrompt = tasks.map((t) => ({
    title: t.title,
    description: t.description || "",
    priority: t.priority,
    createdAt: t.createdAt
      ? new Date(t.createdAt).toISOString()
      : new Date().toISOString(),
  }));

  const promptValue = await prompt.invoke({
    current_time: currentTime,
    tasks: JSON.stringify(tasksForPrompt, null, 2),
    format_instructions: parser.getFormatInstructions(),
  });

  const response = await llm.invoke(promptValue);
  const text =
    typeof response.content === "string"
      ? response.content
      : (response.content && response.content[0]?.text) || "";

  return parser.parse(text);
}

module.exports = { generatePOA };

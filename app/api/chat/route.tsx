import { google } from "@ai-sdk/google";
import { streamText, tool, convertToModelMessages, UIMessage, stepCountIs } from "ai";
import { z } from "zod";
import {
  executeRawQuery,
  getDashboardStats,
  getRecentOrders,
  getSalesHistory,
} from "@/app/actions/actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { DATABASE_SCHEMA } from "@/lib/db-schema";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    console.log("Session debug:", JSON.stringify(session, null, 2));
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  
  const result = streamText({
    model: google("gemini-2.5-flash"),
    maxRetries: 0,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `You are a helpful business assistant that helps users analyze their sales data.
      ${DATABASE_SCHEMA}

      CURRENT USER ID: ${session.user.id}

      When writing SQL queries:
      1. ALWAYS filter by "userId" = '${session.user.id}' to show only this user's data
      2. Use double quotes around table and column names (PostgreSQL syntax)
      3. Only write SELECT queries - no INSERT, UPDATE, DELETE, or DROP

      When the user asks about their data, use the runAnalyticsQuery tool to execute SQL queries.
      For simple questions about total revenue or recent orders, you can use the simpler getStats, getSalesTrend, or getRecentTransactions tools.`,
    tools: {
      getStats: tool({
        description: "Get total revenue, total orders, and average order value",
        inputSchema: z.object({}),
        execute: async () => {
          return await getDashboardStats();
        },
      }),
      getSalesTrend: tool({
        description: "Get sales history data for a chart",
        inputSchema: z.object({}),
        execute: async () => {
          return await getSalesHistory();
        },
      }),
      getRecentTransactions: tool({
        description: "Get the 5 most recent transactions",
        inputSchema: z.object({}),
        execute: async () => {
          return await getRecentOrders();
        },
      }),
      runAnalyticsQuery: tool({
        description:
          "Run a raw SQL query against the user's database. ONLY use this tool to run SQL queries that help answer the user's question. Do not use this tool for anything else.",
        inputSchema: z.object({
          sql: z
            .string()
            .describe(
              "The SQL query to run against the database. Make sure it is syntactically correct and only queries the user's data.",
            ),
        }),
        execute: async ({ sql }) => {
          const result = await executeRawQuery(sql, session.user.id);
          return result;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

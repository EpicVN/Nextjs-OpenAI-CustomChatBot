import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import genAI, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { Message } from "ai/react";
import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const model = google("gemini-1.5-pro-latest");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages;

    const messageTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messageTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = await auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 1,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant notes found: ", relevantNotes);

    const content =
      "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
      "The relevant notes for this query are:\n" +
      relevantNotes
        .map((note) => `Title: ${note.title}\nContent:\n${note.content}`)
        .join("\n\n");

    console.log(content);

    const result = await generateText({
      model: model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        },
      ],
    });

    console.log(result.text);

    return NextResponse.json(result.text, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 },
    );
  }
}

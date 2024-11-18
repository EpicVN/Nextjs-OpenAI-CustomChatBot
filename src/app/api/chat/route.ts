import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { Message, streamText } from "ai";
import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { string } from "zod";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Array<Message> } = await req.json();

    let messageTruncated = messages.slice(-1);

    console.log(messageTruncated.map((message: any) => message.content).join("\n"))

    const embedding = await getEmbedding(
      messageTruncated.map((message: any) => message.content).join("\n"),
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

    const systemContent =
      "You are an intelligent note-taking app. You answer the user's question based on their existing notes.\n" +
      "The user want to ask: " + messageTruncated.map((message: any) => message.content).join("\n") + ".\n"  +
      "The relevant notes for this query are:\n" +
      relevantNotes
        .map((note) => `Title: ${note.title}\nContent:\n${note.content}`)
        .join("\n\n");

    console.log(systemContent);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: systemContent,
        },
      ],
    });

    return (await result).toDataStreamResponse();
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 },
    );
  }
}

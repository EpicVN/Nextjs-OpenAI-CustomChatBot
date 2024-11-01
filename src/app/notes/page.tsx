import { Metadata } from "next";

import { useState } from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Chatbot - NoteApp",
};

export default async function NotesPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const allNotes = await prisma.note.findMany({ where: { userId } })

  return (
    <div>
      {JSON.stringify(allNotes)}
    </div>
  )
}

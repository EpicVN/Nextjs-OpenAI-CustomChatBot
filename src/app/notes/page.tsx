import { Metadata } from "next";

import { useState } from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import { Note } from "@/components/note";

export const metadata: Metadata = {
  title: "Chatbot - NoteApp",
};

export default async function NotesPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const allNotes = await prisma.note.findMany({ where: { userId } });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}

      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          {"You don't have any note yet. Try create one."}
        </div>
      )}
    </div>
  );
}

"use client";

import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { AddEditNoteDialog } from "./add-edit-note-dialog";

interface NoteProps {
  note: NoteModel;
}

export const Note = ({ note }: NoteProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const wasUpdated = note.updateAt > note.createAt;

  const createUpdatedAtTimestamp = (
    wasUpdated ? note.updateAt : note.createAt
  ).toDateString();

  return (
    <>
      <AddEditNoteDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        noteToEdit={note}
      />
      
      <Card
        className="max-h-[350px] cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setOpenEditDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="max-h-[200px] overflow-hidden text-ellipsis whitespace-pre-line">
            {note.content}
          </p>
        </CardContent>
      </Card>
    </>
  );
};

import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface NoteProps {
  note: NoteModel;
}

export const Note = ({ note }: NoteProps) => {
  const wasUpdated = note.updateAt > note.createAt;

  const createUpdatedAtTimestamp = (
    wasUpdated ? note.updateAt : note.createAt
  ).toDateString();

  return (
    <Card className="max-h-[350px]">
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
  );
};

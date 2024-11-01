import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { createNoteSchema, CreateNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { LoadingButton } from "./ui/loading-button";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";
import { useConfirm } from "@/hooks/use-confirm";

interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}

export const AddEditNoteDialog = ({
  open,
  setOpen,
  noteToEdit,
}: AddNoteDialogProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'Are you sure you want to delete this note? This cannot be undone',
  );

  const router = useRouter();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input,
          }),
        });

        if (!response.ok) {
          throw new Error("Status code: " + response.status);
        }
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          throw new Error("Status code: " + response.status);
        }

        form.reset();
      }

      router.refresh();
      setOpen(false);
      toast.success("Note successfully submitted");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  const deleteNote = async () => {
    const ok = await confirm();

    if (!ok) return;

    if (!noteToEdit) return;

    setDeleteLoading(true);

    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Status code: " + response.status);
      }

      form.reset();
      router.refresh();
      setOpen(false);
      toast.success("Note successfully deleted");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="fixed">
      <ConfirmDialog />
      <Toaster richColors />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{noteToEdit ? "Edit note" : "Add Note"}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note title</FormLabel>

                    <FormControl>
                      <Input placeholder="Note title" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note content</FormLabel>

                    <FormControl>
                      <Textarea placeholder="Note content" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-3">
                {noteToEdit && (
                  <LoadingButton
                    variant="destructive"
                    loading={deleteLoading}
                    disabled={form.formState.isSubmitting}
                    onClick={deleteNote}
                    type="button"
                  >
                    Delete
                  </LoadingButton>
                )}
                <LoadingButton
                  type="submit"
                  loading={form.formState.isSubmitting}
                  disabled={deleteLoading}
                >
                  Submit
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

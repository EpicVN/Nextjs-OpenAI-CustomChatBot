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

interface AddNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AddNoteDialog = ({ open, setOpen }: AddNoteDialogProps) => {
  const router = useRouter();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(input: CreateNoteSchema) {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Status code: " + response.status);
      }

      form.reset();
      router.refresh();
      setOpen(false);
      toast.success("Note successfully submitted");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Toaster richColors />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
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

              <DialogFooter>
                <LoadingButton
                  type="submit"
                  loading={form.formState.isSubmitting}
                >
                  Submit
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

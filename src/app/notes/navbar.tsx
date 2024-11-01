"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddEditNoteDialog } from "@/components/add-edit-note-dialog";

export const NavBar = () => {
  const [openAddEditNoteDialog, setOpenAddEditNoteDialog] = useState(false);
  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/notes" className="flex items-center gap-4">
            <Image src={logo} alt="Logo" width={40} height={40} />
            <span className="text-2xl font-bold">Chatbot</span>
          </Link>

          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                  },
                },
                baseTheme: neobrutalism,
              }}
              showName
            />

            <Button onClick={() => setOpenAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add data
            </Button>
          </div>
        </div>
      </div>

      <AddEditNoteDialog
        open={openAddEditNoteDialog}
        setOpen={setOpenAddEditNoteDialog}
      />
    </>
  );
};

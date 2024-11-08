"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@clerk/nextjs";
import { neobrutalism, dark } from "@clerk/themes";

import { Button } from "@/components/ui/button";
import { AddEditNoteDialog } from "@/components/add-edit-note-dialog";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

import logo from "@/assets/logo.png";
import { useTheme } from "next-themes";
import { AIChatbotButton } from "@/components/ai-chatbot-button";

export const NavBar = () => {
  const { theme } = useTheme();
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
                baseTheme: theme === "dark" ? dark : neobrutalism,
              }}
              showName
            />

            <ThemeToggleButton />

            <Button onClick={() => setOpenAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add data
            </Button>

            <AIChatbotButton />
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

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"

export const NavBar = () => {
  return (
    <div className="p-4 shadow">
      <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href="/notes" className="flex items-center gap-4">
          <Image src={logo} alt="Logo" width={40} height={40} />
          <span className="font-bold text-2xl">Chatbot</span>
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
            }}
          />

          <Button>
            <Plus size={20} className="mr-2"/>
            Add data
          </Button>
        </div>
      </div>
    </div>
  );
};
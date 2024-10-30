import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/notes");
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image
          src={logo}
          alt="logo"
          width={100}
          height={100}
          className="my-4"
        />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Chatbot
        </span>
      </div>

      <p className="max-w-prose text-center">
        An chatbot application built with OpenAI, Next.js, Pinecone, Prisma,
        MongoDB, Shadcn UI, Clerk and more.
      </p>

      <Button size="lg" asChild>
        <Link href="/notes">Start</Link>
      </Button>
    </main>
  );
}

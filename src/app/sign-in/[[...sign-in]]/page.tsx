import { SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatbot - Sign In"
}

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        appearance={{
          variables: { colorPrimary: "#0F172A" },
          baseTheme: neobrutalism,
        }}
      />
    </div>
  );
}

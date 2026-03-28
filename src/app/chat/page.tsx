"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CommandMenu } from "@/components/command-palette/command-menu";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { O2sLogo } from "@/components/auth/o2s-logo";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <O2sLogo size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <CommandMenu />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <ChatInterface />
    </div>
  );
}

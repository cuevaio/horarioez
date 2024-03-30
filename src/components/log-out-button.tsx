"use client";

import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logOut } from "@/actions/auth.actions";

export default function LogOutButton() {
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    startTransition(async () => {
      event.preventDefault();
      toast.promise(logOut(), {
        loading: "Alistando todo...",
        success: "Adiós",
        error: (error) => error.message,
      });
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" disabled={isPending}>
        Cerrar sesión
      </Button>
    </form>
  );
}

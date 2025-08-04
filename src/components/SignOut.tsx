
"use client"

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { Power } from "lucide-react";

export const SignOut = () => {
  return (
    <Button
      onClick={() => signOut()}
      size="sm"
      variant="secondary"
    >
      <Power size={16} />
    </Button>
  );
};

"use client";

import { toast } from "sonner";
import Image from "next/image";

import { createGoogleAuthorizationURL } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const onGoogleSignInClicked = async () => {
    const res = await createGoogleAuthorizationURL();
    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      window.location.href = res.authorizationURL;
    }
  };

  return (
    <div className="w-full flex item-center justify-center">
      <Button onClick={onGoogleSignInClicked} variant={"outline"} className="">
        <Image
          alt="Google logo"
          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          width={16}
          height={16}
          className="w-6 h-6 inline-block mr-2 bg-background rounded-full p-0.5"
        />
        Iniciar sesión con Google
      </Button>
    </div>
  );
}

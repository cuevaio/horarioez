import { Lucia, TimeSpan } from "lucia";

import { adapter } from "./adapter";

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, "h"),
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production", // set `Secure` flag in HTTPS
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name,
      handle: attributes.handle,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      name?: string | null;
      handle?: string | null;
    };
  }
}

"use server";

import { generateState, generateCodeVerifier } from "arctic";
import { cookies } from "next/headers";

import { google } from "@/lib/auth/google-oauth";
import { validateRequest } from "@/lib/auth/validate-request";
import { lucia } from "@/lib/auth";

export const createGoogleAuthorizationURL = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });
    cookies().set("state", state, {
      httpOnly: true,
    });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: [
          "email",
          "profile",
          "https://www.googleapis.com/auth/calendar",
        ],
      }
    );

    return { success: true, authorizationURL: authorizationURL.toString() };
  } catch (error: any) {
    return { sucsuccessess: false, error: error?.message };
  }
};

export const logOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};

import type { Adapter } from "lucia";

import { getXataClient } from "@/lib/db";
const xata = getXataClient();

export const adapter: Adapter = {
  async getSessionAndUser(sessionId) {
    const session = await xata.db.sessions
      .filter({
        id: sessionId,
      })
      .select(["*", "user.*"])
      .getFirst();
    if (session?.user?.email) {
      return [
        {
          id: session.id,
          expiresAt: session.expiresAt,
          userId: session.user.id,
          attributes: {},
        },
        {
          id: session.user.id,
          attributes: {
            ...session.user,
            email: session.user.email,
          },
        },
      ];
    } else {
      return [null, null];
    }
  },

  async getUserSessions(userId) {
    const sessions = await xata.db.sessions
      .filter({
        "user.id": userId,
      })
      .select(["id", "expiresAt"])
      .getAll();

    return sessions.map((session) => ({
      id: session.id,
      expiresAt: session.expiresAt,
      userId,
      attributes: {},
    }));
  },

  async setSession(session) {
    await xata.db.sessions.create({
      id: session.id,
      user: session.userId,
      expiresAt: session.expiresAt,
    });
  },
  async updateSessionExpiration(sessionId, expiresAt) {
    await xata.db.sessions.update({
      id: sessionId,
      expiresAt,
    });
  },
  async deleteSession(sessionId) {
    await xata.db.sessions.delete(sessionId);
  },
  async deleteUserSessions(userId) {
    await xata.sql`DELETE FROM "sessions" WHERE "user" = ${userId}`;
  },
  async deleteExpiredSessions() {
    await xata.sql`DELETE FROM "sessions" WHERE "expiresAt" < NOW()`;
  },
};

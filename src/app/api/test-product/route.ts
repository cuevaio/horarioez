export const runtime = "edge";
export const dynamic = "force-dynamic";

import { validateRequest } from "@/lib/auth/validate-request";
import { ScheduleSchema } from "@/parseSchedule";
import { redirect } from "next/navigation";

import { getXataClient } from "@/lib/db";
const xata = getXataClient();

export const POST = async (req: Request) => {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/auth/signin");
  }

  const rawSchedule = await req.json();

  const safeParsedSchedule = ScheduleSchema.safeParse(rawSchedule);

  if (!safeParsedSchedule.success) {
    return Response.json({ message: "Horario inválido" }, { status: 400 });
  }

  const oa = await xata.db.google_oauth_accounts.read(user.id);
  const userXata = await xata.db.users.read(user.id);

  if (!oa) {
    return Response.json(
      { message: "No se encontró una cuenta de Google" },
      { status: 400 }
    );
  }

  if (!userXata) {
    return Response.json(
      { message: "No se encontró un usuario" },
      { status: 400 }
    );
  }

  const Authorization = "Bearer " + oa.accessToken;

  const schedule = safeParsedSchedule.data;

  try {
    const createCalendarResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars",
      {
        method: "POST",
        headers: {
          Authorization,
          "content-type": "application/json",
        },
        body: '{"summary":"Horario EZ"}',
      }
    );
    const createCalendarData = await createCalendarResponse.json();

    if (!createCalendarResponse.ok) {
      console.error(createCalendarData);
      return Response.json({ message: "ERROR" }, { status: 500 });
    }

    const calendarId = createCalendarData.id;

    const weekADaysDict: { [key: string]: string } = {
      "Lun.": "2024-04-01",
      "Mar.": "2024-04-02",
      "Mié.": "2024-04-03",
      "Jue.": "2024-04-04",
      "Vie.": "2024-04-05",
      "Sáb.": "2024-04-06",
    };

    const weekBDaysDict: { [key: string]: string } = {
      "Lun.": "2024-04-08",
      "Mar.": "2024-04-09",
      "Mié.": "2024-04-10",
      "Jue.": "2024-04-11",
      "Vie.": "2024-04-12",
      "Sáb.": "2024-04-13",
    };

    await Promise.all(
      schedule.map(async (course, i) => {
        await Promise.all(
          course.events.map(async (event) => {
            const weekDaysDict =
              event.customWeek === "B" ? weekBDaysDict : weekADaysDict;

            const createEventResponse = await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
              {
                method: "POST",
                headers: {
                  Authorization,
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  summary: course.name,
                  start: {
                    dateTime:
                      weekDaysDict[event.day] + "T" + event.start + ":0.000",
                    timeZone: "America/Lima",
                  },
                  end: {
                    dateTime:
                      weekDaysDict[event.day] + "T" + event.end + ":0.000",
                    timeZone: "America/Lima",
                  },
                  location: event.room,
                  colorId: i,
                  description: `<div><p><strong>${course.id} - ${
                    course.name
                  }</strong></p><p>${event.type}</p><p><strong>Aula:</strong> ${
                    event.room
                  }</p><p><strong>Profes_r:</strong> ${course.teacher}</p>${
                    !!course.section
                      ? "<p><strong>Sección:</strong>" + course.section + "</p>"
                      : ""
                  }${
                    !!course.group &&
                    "<p><strong>Grupo:</strong>" + course.group + "</p>"
                  }<p><strong>Créditos:</strong> ${course.credits}</p></div>`,
                }),
              }
            );

            const createEventData = await createEventResponse.json();
            if (createEventResponse.ok) {
              console.error(createEventData);
              return Response.json(
                { message: "Error creando eventos para el curso " + course.id },
                { status: 500 }
              );
            }
          })
        );
      })
    );

    await userXata.update({
      calendarCreated: true,
      calendarCount: {
        $increment: 1,
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error interno" }, { status: 500 });
  }
};

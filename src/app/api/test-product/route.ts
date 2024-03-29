export const runtime = "edge";
export const dynamic = "force-dynamic";

const WEEKLY = "RRULE:FREQ=WEEKLY;COUNT=14";
const BIWEEKLY = "RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=14";

import { validateRequest } from "@/lib/auth/validate-request";
import { redirect } from "next/navigation";

import { getXataClient } from "@/lib/db";
const xata = getXataClient();

export const POST = async () => {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/auth/signin");
  }

  const oa = await xata.db.google_oauth_accounts.read(user.id);
  const userXata = await xata.db.users.read(user.id);

  if (!oa) {
    return Response.json(
      { message: "No se encontró una cuenta de Google" },
      { status: 400 }
    );
  }

  if (userXata?.hasTested) {
    return Response.json(
      { message: "Ya create el calendario de prueba ;)" },
      { status: 400 }
    );
  }

  const Authorization = "Bearer " + oa.accessToken;

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

    const schedule = [
      {
        id: "GH0023",
        name: "Business Communication",
        teacher: "Neira Neira, Kenny",
        credits: 2,
        section: 4,
        group: "Laboratorio 4.01",
        events: [
          {
            day: "Lun.",
            type: "Teoría",
            start: "10:00",
            end: "11:00",
            room: "A101",
          },
          {
            day: "Mar.",
            type: "Laboratorio",
            start: "12:00",
            end: "14:00",
            room: "A1002",
          },
        ],
      },
      {
        id: "CI0047",
        name: "Diseño Arquitectónico",
        teacher: "Fantozzi Freire, Valeria Maria",
        credits: 3,
        section: 1,
        group: "",
        events: [
          {
            day: "Vi.",
            type: "Teoría",
            start: "15:00",
            end: "16:00",
            room: "A401",
          },
          {
            day: "Sáb.",
            type: "Teoría",
            start: "10:00",
            end: "12:00",
            room: "A401",
          },
        ],
      },
      {
        id: "CI0049",
        name: "Modelación Aplicada en Transporte Urbano",
        teacher: "Samaniego Barja, Walter",
        credits: 3,
        section: 1,
        group: "Laboratorio 1.01",
        events: [
          {
            day: "Jue.",
            type: "Laboratorio",
            start: "17:00",
            end: "19:00",
            room: "M602",
          },
          {
            day: "Sáb.",
            type: "Teoría",
            start: "13:00",
            end: "15:00",
            room: "A705",
          },
        ],
      },
      {
        id: "CI2012",
        name: "Dinámica y Vibraciones",
        teacher: "Vilca Córdova, Federico Omar",
        credits: 4,
        section: 2,
        group: "",
        events: [
          {
            day: "Lun.",
            type: "Teoría",
            start: "18:00",
            end: "20:00",
            room: "A706",
          },
          {
            day: "Mié.",
            type: "Teoría",
            start: "18:00",
            end: "20:00",
            room: "A706",
          },
        ],
      },
      {
        id: "CI4072",
        name: "Hidráulica Superficial",
        teacher: "Ramos Orlandino, Carmela Cristhy",
        credits: 4,
        section: 2,
        group: "Laboratorio 2.01",
        events: [
          {
            day: "Lun.",
            type: "Teoría",
            start: "08:00",
            end: "10:00",
            room: "M804",
          },
          {
            day: "Mar.",
            type: "Teoría",
            start: "15:00",
            end: "16:00",
            room: "A704",
          },
          {
            day: "Mié.",
            type: "Laboratorio",
            start: "12:00",
            end: "16:00",
            room: "L204",
            customWeek: "A",
          },
        ],
      },
      {
        id: "CI5006",
        name: "Proyecto Final de Ingeniería Civil - Trabajo de Investigación II",
        teacher: "Caicedo Murillo, Felix Andres",
        credits: 4,
        section: 3,
        group: "",
        events: [
          {
            day: "Vie.",
            type: "Teoría Virtual",
            start: "11:00",
            end: "13:00",
            room: "Virtual 115",
          },
          {
            day: "Vie.",
            type: "Teoría Virtual",
            start: "17:00",
            end: "19:00",
            room: "Virtual 117",
          },
        ],
      },
    ];

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
                  recurrence: [
                    event.customWeek === undefined ? WEEKLY : BIWEEKLY,
                  ],
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

    await userXata?.update({
      hasTested: true,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error interno" }, { status: 500 });
  }
};

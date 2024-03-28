import z from "zod";

export const EventSchema = z.object({
  day: z.string(),
  type: z.string(),
  start: z.string(),
  end: z.string(),
  room: z.string(),
  customWeek: z.union([z.literal("A"), z.literal("B"), z.undefined()]),
});

export type Event = z.infer<typeof EventSchema>;

export const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  teacher: z.string(),
  credits: z.number(),
  section: z.number(),
  group: z.string(),
  events: z.array(EventSchema),
});

export type Course = z.infer<typeof CourseSchema>;

export const ScheduleSchema = z.array(CourseSchema);
export type Schedule = z.infer<typeof ScheduleSchema>;

export function parseSchedule(text: string) {
  try {
    const normalizedText = text
      .replace(
        /[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,
        " "
      )
      .trim();

    const lines = normalizedText.split("\n");
    const courses: Course[] = [];

    let currentCourse: Course | null = null;
    let currentEvent: Event | null = null;

    for (const _line of lines) {
      const line = _line.trim();
      if (line === "") {
        continue;
      }

      try {
        if (!line.startsWith("Semana")) {
          if (currentCourse) {
            courses.push(currentCourse);
          }

          let parts = line.split("\t");

          let isNumber = false;
          if (!isNaN(Number(parts[0]))) {
            isNumber = true;
          }

          if (parts[0] === "-" || parts[0] === "E" || isNumber) {
            parts = parts.slice(1);
          }

          currentCourse = {
            id: parts[0],
            name: parts[1],
            teacher: parts[4],
            credits: parseInt(parts[5]),
            section: parseInt(parts[6]),
            group: parts[7],
            events: [],
          };
        } else {
          let parts = line.split(" ");

          let partsForHours = line.split("-");
          const end = partsForHours[1].split(" ")[0];
          const start =
            partsForHours[0].split(":")[1] +
            ":" +
            partsForHours[0].split(":")[2];

          let partsForType = line.split(".");
          let type = partsForType[1].split(":")[0].trim();

          let partsForRoom = line.split(":");
          partsForRoom = partsForRoom[partsForRoom.length - 1].split(" ");
          // remove first element
          partsForRoom.shift();
          let room = partsForRoom.join(" ");
          if (room.includes("(")) {
            room = room.split("(")[0];
          }

          let customWeek: "A" | "B" | undefined = undefined;
          try {
            let customWeekParts = line.split("Semana ");
            let x = customWeekParts[1].split(" ")[0];
            if (x === "A" || x === "B") {
              customWeek = x as "A" | "B";
            }
          } catch (e) {
            customWeek = undefined;
          }

          currentEvent = {
            day: parts[2],
            type,
            start,
            end,
            room,
            customWeek,
          };

          if (currentCourse) {
            currentCourse.events.push(currentEvent);
          }
        }
      } catch (e) {
        console.error(e);
        continue;
      }
    }

    if (currentCourse) {
      courses.push(currentCourse);
    }

    const safeParseSchema = ScheduleSchema.safeParse(courses);
    if (!safeParseSchema.success) {
      console.error(safeParseSchema.error.errors);
      return [];
    }

    return courses;
  } catch (e) {
    console.error(e);
    return [];
  }
}

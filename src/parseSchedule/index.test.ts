import { expect, test } from "vitest";
import { parseSchedule } from ".";

test("Anthony's schedule", () => {
  const text = `E	CI0049	Modelación Aplicada en Transporte Urbano		Electivo	Samaniego Barja, Walter	3	1	Laboratorio 1.01	1	
  Semana General Jue. Laboratorio:17:00-19:00 M602(30)
  Semana General Sáb. Teoría:13:00-15:00 A705(45)
  -	CI5006	Proyecto Final de Ingeniería Civil - Trabajo de Investigación II			Caicedo Murillo, Felix Andres	4	3		1	
  Semana General Vie. Teoría Virtual:11:00-13:00 Virtual 115
  Semana General Vie. Teoría Virtual:17:00-19:00 Virtual 117`;

  const schedule = parseSchedule(text);
  expect(schedule).toEqual([
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
  ]);
});

test("Diego's schedule", () => {
  const text = `
  6	GH0024	Crítica de la Modernidad		Obligatorio	Alayza Prager, Cristina	3	1		2	
Semana General Mar. Teoría:12:00-13:00 A902(45)
Semana General Mié. Teoría:10:00-12:00 A906(60)
-	AM3001	Hidrología			Llauca Soto, Harold Omar	4	2	Laboratorio 2.01	1	
Semana General Mar. Teoría:16:00-18:00 A707(45)
Semana General Jue. Teoría:17:00-18:00 A707(45)
Semana General Vie. Laboratorio:16:00-18:00 A702(45)
-	CI4072	Hidráulica Superficial			Ramos Orlandino, Carmela Cristhy	4	2	Laboratorio 2.01	1	
Semana General Lun. Teoría:08:00-10:00 M804(45)
Semana General Mar. Teoría:15:00-16:00 A704(45)
Semana A Mié. Laboratorio:12:00-16:00 L204
-	CI5105	Proyecto Final de Ingeniería Civil - Trabajo de Investigación I			Vilcapoma La Rosa, Alejandro Martin	4	6		1	
Semana General Jue. Teoría Virtual:19:00-21:00 Virtual 133
Semana General Sáb. Teoría Virtual:19:00-21:00 null`;

  const schedule = parseSchedule(text);

  expect(schedule).toEqual([
    {
      id: "GH0024",
      name: "Crítica de la Modernidad",
      teacher: "Alayza Prager, Cristina",
      credits: 3,
      section: 1,
      group: "",
      events: [
        {
          day: "Mar.",
          type: "Teoría",
          start: "12:00",
          end: "13:00",
          room: "A902",
        },
        {
          day: "Mié.",
          type: "Teoría",
          start: "10:00",
          end: "12:00",
          room: "A906",
        },
      ],
    },
    {
      id: "AM3001",
      name: "Hidrología",
      teacher: "Llauca Soto, Harold Omar",
      credits: 4,
      section: 2,
      group: "Laboratorio 2.01",
      events: [
        {
          day: "Mar.",
          type: "Teoría",
          start: "16:00",
          end: "18:00",
          room: "A707",
        },
        {
          day: "Jue.",
          type: "Teoría",
          start: "17:00",
          end: "18:00",
          room: "A707",
        },
        {
          day: "Vie.",
          type: "Laboratorio",
          start: "16:00",
          end: "18:00",
          room: "A702",
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
      id: "CI5105",
      name: "Proyecto Final de Ingeniería Civil - Trabajo de Investigación I",
      teacher: "Vilcapoma La Rosa, Alejandro Martin",
      credits: 4,
      section: 6,
      group: "",
      events: [
        {
          day: "Jue.",
          type: "Teoría Virtual",
          start: "19:00",
          end: "21:00",
          room: "Virtual 133",
        },
        {
          day: "Sáb.",
          type: "Teoría Virtual",
          start: "19:00",
          end: "21:00",
          room: "null",
        },
      ],
    },
  ]);
});

test("Mary's schedule", () => {
  const text = `
  9	GH0023	Business Communication	Nivel B1	Obligatorio	Neira Neira, Kenny	2	4	Laboratorio 4.01	1	
Semana General Lun. Teoría:10:00-11:00 A101(40)
Semana General Mar. Laboratorio:12:00-14:00 A1002(45)
E	CI0047	Diseño Arquitectónico		Electivo	Fantozzi Freire, Valeria Maria	3	1		1	
Semana General Vi. Teoría:15:00-16:00 A401(20)
Semana General Sáb. Teoría:10:00-12:00 A401(20)
E	CI0049	Modelación Aplicada en Transporte Urbano		Electivo	Samaniego Barja, Walter	3	1	Laboratorio 1.01	1	
Semana General Jue. Laboratorio:17:00-19:00 M602(30)
Semana General Sáb. Teoría:13:00-15:00 A705(45)
CI2012	Dinámica y Vibraciones			Vilca Córdova, Federico Omar	4	2		1	
Semana General Lun. Teoría:18:00-20:00 A706(45)
Semana General Mié. Teoría:18:00-20:00 A706(45)
-	CI4072	Hidráulica Superficial			Ramos Orlandino, Carmela Cristhy	4	2	Laboratorio 2.01	1	
Semana General Lun. Teoría:08:00-10:00 M804(45)
Semana General Mar. Teoría:15:00-16:00 A704(45)
Semana A Mié. Laboratorio:12:00-16:00 L204
CI5006	Proyecto Final de Ingeniería Civil - Trabajo de Investigación II			Caicedo Murillo, Felix Andres	4	3		1	
Semana General Vie. Teoría Virtual:11:00-13:00 Virtual 115
Semana General Vie. Teoría Virtual:17:00-19:00 Virtual 117`;

  const schedule = parseSchedule(text);

  expect(schedule).toEqual([
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
  ]);
});

test("Rodrigo's schedule", () => {
  const text = `ECI0038	Análisis Matricial de Estructuras	Electivo	Ostolaza Cantuarias, Arianne	3	1\tLaboratorio\t1.01\t1
  Semana General Mar. Teoría:12:00-14:00 A602(23)
  Semana General Jue. Laboratorio:16:00-18:00 M601(30)
  -\tCI3033\tTecnología del Concreto\tSalas Paulet, Manuel Jesus\t4\t1\tLaboratorio 1.021
  Semana B Mar. Laboratorio:17:00-21:00 L508
  Semana General Jue. Teoría:18:00-20:00 A707(45)
  Semana General Vie. Teoría:21:00-22:00 A701(45)
  -\tCI5105\tProyecto Final de Ingeniería Civil - Trabajo de Investigación I\tBenedetty Torres, Carlos Alberto\t4\t2\t1
  Semana General Jue. Teoría Virtual:20:00-22:00 Virtual 118
  Semana General Sáb. Teoría Virtual:19:00-21:00`;

  const schedule = parseSchedule(text);

  expect(schedule).toEqual([
    {
      id: "ECI0038",
      name: "Análisis Matricial de Estructuras",
      teacher: "Ostolaza Cantuarias, Arianne",
      credits: 3,
      section: 1,
      group: "Laboratorio 1.01",
      events: [
        {
          day: "Mar.",
          type: "Teoría",
          start: "12:00",
          end: "14:00",
          room: "A602",
        },
        {
          day: "Jue.",
          type: "Laboratorio",
          start: "16:00",
          end: "18:00",
          room: "M601",
        },
      ],
    },
    {
      id: "CI3033",
      name: "Tecnología del Concreto",
      teacher: "Salas Paulet, Manuel Jesus",
      credits: 4,
      section: 1,
      group: "Laboratorio 1.02",
      events: [
        {
          day: "Mar.",
          type: "Laboratorio",
          start: "17:00",
          end: "21:00",
          room: "L508",
          customWeek: "B",
        },
        {
          day: "Jue.",
          type: "Teoría",
          start: "18:00",
          end: "20:00",
          room: "A707",
        },
        {
          day: "Vie.",
          type: "Teoría",
          start: "21:00",
          end: "22:00",
          room: "A701",
        },
      ],
    },
    {
      id: "CI5105",
      name: "Proyecto Final de Ingeniería Civil - Trabajo de Investigación I",
      teacher: "Benedetty Torres, Carlos Alberto",
      credits: 4,
      section: 1,
      group: "",
      events: [
        {
          day: "Jue.",
          type: "Teoría Virtual",
          start: "20:00",
          end: "22:00",
          room: "Virtual 118",
        },
        {
          day: "Sáb.",
          type: "Teoría Virtual",
          start: "19:00",
          end: "21:00",
          room: "",
        },
      ],
    },
  ]);
});

"use client";

import * as React from "react";
import { CheckIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseSchedule } from "@/parseSchedule";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function Page() {
  const [rawSchedule, setRawSchedule] = React.useState("");
  const parsedSchedule = parseSchedule(rawSchedule);

  const createCalendarMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(parsedSchedule),
      });

      if (!res.ok) {
        throw new Error("Error al crear el calendario");
      }

      return true;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Calendario creado exitosamente", {
        action: {
          label: "Ver",
          onClick: () => {
            window.open(
              "https://calendar.google.com/calendar/u/0/r/week/2024/4/4"
            );
          },
        },
      });
    },
  });

  return (
    <div className="container">
      <h1 className="text-4xl font-bold">Horario EZ</h1>
      <p>
        Copia tu consolidado de matrícula del{" "}
        <a
          href="https://sistema-academico.utec.edu.pe/students/view/consolidated-enrollment"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary"
        >
          Sístema Académico
        </a>{" "}
        y págalo aquí abajo:
      </p>
      <div className="mt-2 mb-8">
        <Label htmlFor="schedule">Consolidado de matrícula</Label>
        <Textarea
          id="schedule"
          value={rawSchedule}
          onChange={(event) => setRawSchedule(event.target.value)}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <Label>Cursos Identificados</Label>
          <div className="h-96 overflow-auto border rounded-lg p-4 bg-muted mt-2 text-muted-foreground space-y-2">
            {parsedSchedule.map((course) => (
              <h2 key={course.id}>
                <CheckIcon className="w-4 h-4 inline-block mr-2 text-primary" />
                {course.name}
              </h2>
            ))}
          </div>
        </div>
        <div>
          <Label>Parsed data</Label>
          <pre className="h-96 overflow-auto border rounded-lg p-4 bg-muted mt-2 text-muted-foreground">
            {JSON.stringify(parsedSchedule, undefined, 2)}
          </pre>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => createCalendarMutation.mutate()}
          size="lg"
          disabled={
            parsedSchedule.length === 0 || createCalendarMutation.isPending
          }
        >
          <Image
            alt="Google logo"
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            width={16}
            height={16}
            className="w-6 h-6 inline-block mr-2 bg-background rounded-full p-0.5"
          />
          Crear calendario
          {parsedSchedule.length === 0 ||
            (createCalendarMutation.isPending && (
              <Loader2Icon className="w-4 h-4 inline-block ml-2 animate-spin" />
            ))}
        </Button>
      </div>
    </div>
  );
}
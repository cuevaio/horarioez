"use client";

import * as React from "react";
import { CheckIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseSchedule } from "@/parseSchedule";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import YapeQR from "./yape-qr.png";
import ConsolidadoImg from "./consolidado.png";
import LogOutButton from "@/components/log-out-button";
import { is } from "@xata.io/client";

export function Page() {
  const [rawSchedule, setRawSchedule] = React.useState("");
  const parsedSchedule = parseSchedule(rawSchedule);

  const isPaidQuery = useQuery({
    queryKey: ["isPaid"],
    queryFn: async () => {
      const res = await fetch("/api/isPaid");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return {
        isPaid: data.isPaid as boolean,
        hasTested: data.hasTested as boolean,
      };
    },
  });

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

  const testProductMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/test-product", {
        method: "POST",
        body: JSON.stringify(parsedSchedule),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      return true;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Calendario semana 1 creado exitosamente", {
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
    <div className="container my-4">
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
        sín los headers y pégalo en el input de abajo.
      </p>
      <Image
        src={ConsolidadoImg}
        alt="Consolidado de matrícula"
        width={800}
        height={400}
      />
      <div className="mt-2 mb-8">
        <Label htmlFor="schedule">Consolidado de matrícula</Label>
        <Textarea
          placeholder="Ctrl + V aquí..."
          id="schedule"
          value={rawSchedule}
          onChange={(event) => setRawSchedule(event.target.value)}
          className="mt-2"
        />
      </div>
      {rawSchedule && (
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
      )}
      <div className="grid sm:grid-cols-2 gap-4 my-8">
        <Button
          onClick={() => createCalendarMutation.mutate()}
          size="lg"
          disabled={
            parsedSchedule.length === 0 ||
            createCalendarMutation.isPending ||
            isPaidQuery.data?.isPaid === false
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

        <Button
          onClick={() => testProductMutation.mutate()}
          size="lg"
          variant="secondary"
          disabled={
            parsedSchedule.length === 0 ||
            testProductMutation.isPending ||
            isPaidQuery.data?.hasTested === true
          }
        >
          <Image
            alt="Google logo"
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            width={16}
            height={16}
            className="w-6 h-6 inline-block mr-2 bg-background rounded-full p-0.5"
          />
          Crear calendario (semana 1)
          {parsedSchedule.length === 0 ||
            (testProductMutation.isPending && (
              <Loader2Icon className="w-4 h-4 inline-block ml-2 animate-spin" />
            ))}
        </Button>
      </div>

      <div>
        <p>
          *Todos los usuario pueden crear los eventos de la primera semana de su
          calendario totalmente gratis. Para crear tu calendario hasta la semana
          16 debes pagar los 5so. ;)
        </p>
      </div>

      {!isPaidQuery.isPending && isPaidQuery.data?.isPaid === false && (
        <div className="flex flex-col items-center text-center text-muted-foreground mx-auto max-w-md space-y-2 my-8">
          <p>
            Hemos tenido muchas solicitudes recientemente y para poder escalar
            este proyecto necesitamos tu apoyo.
          </p>
          <p className="text-primary-foreground">
            Para continuar utilizando esta herramienta, por favor realiza un
            pago de S/ 5.00 a la siguiente cuenta de Yape dejando tu correo en
            la descripción.
          </p>
          <p>
            *Si no puedes dejar mensajes (en el caso de Plin), puedes enviarme
            un correo{" "}
            <span className="text-primary-foreground">(hi@caverne.io)</span>{" "}
            enviando un screenshot de tu pago.
          </p>
          <Image src={YapeQR} alt="Yape QR" width={200} height={200} />
        </div>
      )}

      <div className="flex justify-center">
        <LogOutButton />
      </div>
    </div>
  );
}

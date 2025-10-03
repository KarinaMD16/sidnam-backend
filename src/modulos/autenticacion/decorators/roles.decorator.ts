import { SetMetadata } from "@nestjs/common";

export const ACCION_KEY = "accion";
export const AccionRequerida = (accion: string) => SetMetadata(ACCION_KEY, accion);

import { SetMetadata } from '@nestjs/common';

export const SECCION_KEY = 'SECCION_KEY';
export const SeccionRequerida = (seccion: string) => SetMetadata(SECCION_KEY, seccion);

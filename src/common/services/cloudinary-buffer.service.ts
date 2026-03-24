import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import {
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  PayloadTooLargeException,
} from '@nestjs/common';
import { configureCloudinary } from '../cloudinary/cloudinary.config';

const cloudinaryLogger = new Logger('CloudinaryUpload');

function getMissingCloudinaryEnvVars(): string[] {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ] as const;

  return requiredEnvVars.filter((envVar) => !process.env[envVar]);
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message ?? 'Error desconocido');
  }

  return 'Error desconocido';
}

function getErrorCode(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'http_code' in error) {
    const code = Number(error.http_code);
    return Number.isFinite(code) ? code : undefined;
  }

  return undefined;
}

function buildCloudinaryUploadException(error: unknown, folder: string) {
  const rawMessage = getErrorMessage(error);
  const message = rawMessage.slice(0, 220);
  const normalizedMessage = rawMessage.toLowerCase();
  const httpCode = getErrorCode(error);

  cloudinaryLogger.error(
    `Cloudinary upload failed for folder "${folder}"`,
    JSON.stringify({ httpCode, message: rawMessage }),
  );

  if (
    normalizedMessage.includes('must supply api_key') ||
    normalizedMessage.includes('must supply api_secret') ||
    normalizedMessage.includes('invalid api key') ||
    normalizedMessage.includes('unknown api key')
  ) {
    return new InternalServerErrorException(
      'Cloudinary no está configurado correctamente. Revisa las credenciales del servicio.',
    );
  }

  if (
    normalizedMessage.includes('file size too large') ||
    normalizedMessage.includes('request entity too large') ||
    normalizedMessage.includes('max file size')
  ) {
    return new PayloadTooLargeException(
      `La imagen excede el tamaño permitido por Cloudinary: ${message}`,
    );
  }

  if (
    normalizedMessage.includes('invalid image file') ||
    normalizedMessage.includes('image could not be decoded') ||
    normalizedMessage.includes('unsupported image format') ||
    normalizedMessage.includes('unsupported format') ||
    normalizedMessage.includes('empty file')
  ) {
    return new BadRequestException(`Cloudinary rechazó la imagen enviada: ${message}`);
  }

  return new BadGatewayException(`Error subiendo la imagen a Cloudinary: ${message}`);
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<{ secure_url: string; public_id: string }> {
  const missingEnvVars = getMissingCloudinaryEnvVars();
  if (missingEnvVars.length > 0) {
    throw new InternalServerErrorException(
      `Falta configurar Cloudinary. Variables ausentes: ${missingEnvVars.join(', ')}`,
    );
  }

  configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(buildCloudinaryUploadException(error, folder));
        }

        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      },
    );

    uploadStream.on('error', (error) => {
      reject(buildCloudinaryUploadException(error, folder));
    });

    uploadStream.end(buffer);
  });
}

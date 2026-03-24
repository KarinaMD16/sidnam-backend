import { BadRequestException } from '@nestjs/common';

type ImageValidationOptions = {
  required?: boolean;
  fieldName?: string;
};

export function assertValidImageUpload(
  file: Express.Multer.File | undefined,
  options: ImageValidationOptions = {},
): asserts file is Express.Multer.File {
  const { required = true, fieldName = 'imagen' } = options;

  if (!file) {
    if (required) {
      throw new BadRequestException(`Debes subir una imagen en el campo "${fieldName}"`);
    }
    return;
  }

  if (!file.buffer || file.buffer.length === 0 || file.size === 0) {
    throw new BadRequestException('La imagen enviada está vacía.');
  }

  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    throw new BadRequestException('El archivo enviado debe ser una imagen válida.');
  }
}

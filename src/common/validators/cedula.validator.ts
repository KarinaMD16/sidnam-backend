import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCedula(validationOptions?: ValidationOptions) {
    return function (target: object, propertyName: string) {
        registerDecorator({
            name: 'isCedula',
            target: target.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown): boolean {
                    if (typeof value !== 'string') return false;
                    return /^\d{9,20}$/.test(value);
                },
                defaultMessage(): string {
                    return 'La cédula debe contener solo dígitos y tener entre 9 y 20 caracteres.';
                },
            },
        });
    };
}
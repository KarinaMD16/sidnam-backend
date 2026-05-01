import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsAdultoMayor(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAdultoMayor',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!value) return false;

          const fechaNacimiento = new Date(value);
          const hoy = new Date();

          let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

          const mesActual = hoy.getMonth();
          const mesNacimiento = fechaNacimiento.getMonth();

          const diaActual = hoy.getDate();
          const diaNacimiento = fechaNacimiento.getDate();

          if (
            mesActual < mesNacimiento ||
            (mesActual === mesNacimiento && diaActual < diaNacimiento)
          ) {
            edad--;
          }

          return edad >= 65;
        },

        defaultMessage(args: ValidationArguments) {
          return 'El residente debe tener al menos 65 años';
        },
      },
    });
  };
}
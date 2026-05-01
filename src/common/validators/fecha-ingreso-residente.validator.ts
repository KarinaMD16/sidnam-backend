import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function FechaIngresoResidenteValida(
  validationOptions?: ValidationOptions,
) {
  return function (constructor: Function) {
    registerDecorator({
      name: 'fechaIngresoResidenteValida',
      target: constructor,
      propertyName: 'fecha_ingreso',
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const object = args.object as any;

          const fechaIngreso = new Date(object.fecha_ingreso);
          const fechaNacimiento = new Date(object.residente?.fecha_nacimiento);

          if (!object.fecha_ingreso || !object.residente?.fecha_nacimiento) {
            return false;
          }

          if (isNaN(fechaIngreso.getTime()) || isNaN(fechaNacimiento.getTime())) {
            return false;
          }

          const hoy = new Date();

          if (fechaNacimiento > hoy) {
            return false;
          }

          if (fechaIngreso < fechaNacimiento) {
            return false;
          }

          let edadAlIngreso =
            fechaIngreso.getFullYear() - fechaNacimiento.getFullYear();

          const mesIngreso = fechaIngreso.getMonth();
          const mesNacimiento = fechaNacimiento.getMonth();

          const diaIngreso = fechaIngreso.getDate();
          const diaNacimiento = fechaNacimiento.getDate();

          if (
            mesIngreso < mesNacimiento ||
            (mesIngreso === mesNacimiento && diaIngreso < diaNacimiento)
          ) {
            edadAlIngreso--;
          }

          return edadAlIngreso >= 65;
        },

        defaultMessage() {
          return 'La fecha de ingreso debe ser posterior a la fecha de nacimiento y el residente debe tener al menos 65 años al ingresar';
        },
      },
    });
  };
}
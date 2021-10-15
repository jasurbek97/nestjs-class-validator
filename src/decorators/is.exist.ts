import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { getConnection } from 'typeorm';

export function IsExists(Entity: any, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(
          value: any,
          args: ValidationArguments,
        ): Promise<boolean> {
          const exist = await getConnection()
            .getRepository(Entity)
            .createQueryBuilder('e')
            .where('e.id = :id', { id: value })
            .getOne();
          return !!exist;
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return 'Not found with this id ' + validationArguments.value;
        },
      },
    });
  };
}

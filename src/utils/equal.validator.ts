import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsEqualConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: any) {
        const relatedValue = (args.object as any)[args.constraints[0]];
        return value === relatedValue;
    }

    defaultMessage(args: any) {
        return `${args.property} deve ser igual a ${args.constraints[0]}`;
    }
}

export function IsEqual(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isEqual',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: IsEqualConstraint,
        });
    };
}
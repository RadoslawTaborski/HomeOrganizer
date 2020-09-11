import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSign'
})
export class CamelCaseToSignPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

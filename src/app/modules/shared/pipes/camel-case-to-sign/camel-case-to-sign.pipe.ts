import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSign'
})
export class CamelCaseToSignPipe implements PipeTransform {

  transform(expression, sign) {
    return expression
        .replace(/[A-Z]/g, function (val) {
            return sign + val.toLowerCase();
        });
}

}

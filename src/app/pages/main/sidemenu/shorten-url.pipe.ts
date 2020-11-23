import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenUrl'
})
export class ShortenUrlPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const length = +args[0] || 15;
    return `${value.slice(0, length)}...`;
  }

}

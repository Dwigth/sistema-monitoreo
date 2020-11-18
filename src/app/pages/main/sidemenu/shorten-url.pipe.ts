import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenUrl'
})
export class ShortenUrlPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return `${value.slice(0, 15)}...`;
  }

}

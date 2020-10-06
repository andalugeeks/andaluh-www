import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'decode' })
export class DecodePipe implements PipeTransform {
  transform(value: string): string {
    return decodeURIComponent(value);
  }
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public parse(dateStr: string): number {
    if (dateStr) {
      let date = Date.parse(dateStr);
      return date;
    }

    return null;
  }

  public toLocalString(date: Date): string {
    if (date) {
      return date.toLocaleString();
    }

    return "";
  }

  public isoToLocal(dateStr: string): string {
    let timestamp = this.parse(dateStr);
    if (!timestamp) {
      return ""
    }
    let date = new Date(timestamp);
    return this.toLocalString(date);
  }
}

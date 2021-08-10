import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  parseGuionDDMMYYYY(date: String | Date): Date {
    if (date) {
      if (typeof date == 'string') {
        let dateYear = date.substr(0, 4);
        let dateMonth = date.substr(5, 2);
        let dateDay = date.substr(8, 2);
        return new Date(parseInt(dateYear), parseInt(dateMonth) - 1, parseInt(dateDay));
      } else {
        return new Date(date.toString().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
      }
    } else {
      return null;
    }
  }

  parseSlashDDMMYYYY(date: String): Date {
    if (date) {
      let dateYear = date.substr(6, 4);
      let dateMonth = date.substr(3, 2);
      let dateDay = date.substr(0, 2);
      console.log(dateDay + '/' + dateMonth + '/' + dateYear);
      return new Date(parseInt(dateYear), parseInt(dateMonth) - 1, parseInt(dateDay));
    } else {
      return null;
    }
  }

  parseGuionDDMMYYYY2(date: String | Date): Date {
    if (date) {
      return new Date(date.toString().replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
    } else {
      return null;
    }
  }
}

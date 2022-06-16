import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  static AppName="HomeOrganizer"
  static FooterText="© HomeOrganizer - Radosław Taborski - 2020-2022"

  constructor() { }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  static AppName="HomeOrganizer"
  static ApiUrl="http://webapp.zapto.org:81/bemaapi.php/";
  static FooterText="© HomeOrganizer - Radosław Taborski - 2020"

  constructor() { }
}

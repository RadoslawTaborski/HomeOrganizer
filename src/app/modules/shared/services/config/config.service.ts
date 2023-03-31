import { Injectable } from '@angular/core';
import { AppConfig } from './app-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _config: AppConfig

  public get config(): AppConfig {
    return this._config;
  }
  public set config(value: AppConfig) {
    this._config = value;
  }

  initialize(config: AppConfig): void {
    this.config = config;
  }
}

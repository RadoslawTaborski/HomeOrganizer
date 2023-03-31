import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { AppConfig } from './app-config';
import { ConfigService } from './config.service';

export function preloadFactory(httpClient: HttpClient, configService: ConfigService, authService: AuthService) {
  return () => httpClient.get<AppConfig>('./assets/config.json')
    .pipe(
      tap((response: AppConfig) => {
        configService.initialize(response);
        authService.initialize(response);
      })).toPromise()
}
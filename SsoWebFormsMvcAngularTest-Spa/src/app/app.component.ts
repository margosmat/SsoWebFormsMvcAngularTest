import { Component } from '@angular/core';
import { OAuthService, JwksValidationHandler, AuthConfig } from 'angular-oauth2-oidc';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>
  
    <h1 *ngIf="!name">
      Hello
    </h1>
    <h1 *ngIf="name">
      Hello, {{name}}
    </h1>

    <button class="btn btn-default" (click)="login()">
        Login
    </button>
    <button class="btn btn-default" (click)="logoff()">
        Logout
    </button>

    <div>
        Username/Password: bob/bob or alice/alice
    </div>

    <button (click)="callApi()">Call API</button>

    <span>Secured API endpoint data: {{data}}</span>
    
  `,
  styles: []
})
export class AppComponent {
  title = 'SsoWebFormsMvcAngularTest-Spa';
  data: string;

  authConfig: AuthConfig = {
    issuer: 'http://localhost:5000',

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin,

    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: 'spa',

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid profile api1',
  }

  constructor(
    private oauthService: OAuthService,
    private httpClient: HttpClient
    ) {
    this.configureWithNewConfigApi();
  }

  private configureWithNewConfigApi() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  public login() {
    this.oauthService.initImplicitFlow();
  }

  public logoff() {
      this.oauthService.logOut();
  }

  public get name() {
      let claims: any = this.oauthService.getIdentityClaims();
      if (!claims) return null;
      return claims.name;
  }

  public callApi(): void {
    var headers = new HttpHeaders({
      "Authorization": "Bearer " + this.oauthService.getAccessToken()
    });
    
    this.httpClient.get<string>('http://localhost:5001/api/values', {
      headers
    }).subscribe(result => this.data = result);
  }
}

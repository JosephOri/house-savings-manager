import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthClientDto } from '../dto/google-auth-client.dto';

@Injectable()
export class GoogleService {
  constructor(private configService: ConfigService) {}

  async getOAuth2ClientUrl(): Promise<{ url: string }> {
    const authClient = this.getAuthClient();
    return this.getAuthUrl(authClient);
  }
  getAuthClient(): OAuth2Client {
    const authClient = new OAuth2Client({
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    });
    return authClient;
  }

  getAuthUrl(authClient: OAuth2Client): { url: string } {
    const authorizeUrl = authClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      prompt: 'consent',
      include_granted_scopes: true,
    });
    return { url: authorizeUrl };
  }
  async getAuthClientData(code: string): Promise<GoogleAuthClientDto> {
    const authClient = this.getAuthClient();
    const tokenData = await authClient.getToken(code);
    const tokens = tokenData.tokens;
    const refreshToken = tokens?.refresh_token || '';
    const accessToken = tokens?.access_token || '';

    authClient.setCredentials(tokens);

    const googleAuth = google.oauth2({
      version: 'v2',
      auth: authClient,
    } as any);

    const googleUserInfo = await googleAuth.userinfo.get();
    const { email, name } = googleUserInfo.data;
    return { email, name, refreshToken, accessToken };
  }
}
export interface IGoogleAuthCredentials {
  web: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    javascript_origins: string[];
  };
}

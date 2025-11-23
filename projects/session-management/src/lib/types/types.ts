export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface SessionManagementConfig {
  accessTokenKey?: string;
  refreshTokenKey?: string;
  refreshBeforeExpiryMs?: number; // ms before idle refresh triggers
  refreshTokenEndpoint: string;
  onRefreshTokenFailure: () => void;
}

export type RefreshTokensFn = (
  refreshToken: string
) => import('rxjs').Observable<Tokens>;

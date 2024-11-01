export interface DecodedToken {
  exp: number;
  iat: number;
  jti: string;
  sub: string;
  email: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
    | string
    | string[];
}

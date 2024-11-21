// src/utils/authHelpers.ts
import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
    | string
    | string[];
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
}

export const extractRolesFromToken = (
  token: string
): { roles: string[]; username: string } => {
  const decodedToken = jwtDecode<MyJwtPayload>(token);
  const rolesClaim =
    decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  const username =
    decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const roles = rolesClaim
    ? Array.isArray(rolesClaim)
      ? rolesClaim
      : [rolesClaim]
    : [];
  return { roles, username };
};

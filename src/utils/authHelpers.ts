// src/utils/authHelpers.ts
import { jwtDecode, JwtPayload } from "jwt-decode";

interface MyJwtPayload extends JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
    | string
    | string[];
}

export const extractRolesFromToken = (token: string): string[] => {
  const decodedToken = jwtDecode<MyJwtPayload>(token);
  const rolesClaim =
    decodedToken[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  const userRoles = rolesClaim
    ? Array.isArray(rolesClaim)
      ? rolesClaim
      : [rolesClaim]
    : [];
  return userRoles;
};

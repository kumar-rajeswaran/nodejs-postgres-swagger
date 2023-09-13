import * as express from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../configs";

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === "jwt") {
    const token: string =
      request.body.token || request.query.token || request.headers["x-access-token"] || request.headers.authorization;
    const bearerToken = token.split(" ")[1];

    return new Promise((resolve, reject) => {
      if (!bearerToken) {
        reject(new Error("No token provided"));
      }
      jwt.verify(bearerToken, `${JWT_SECRET_KEY}`, function (err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          if (scopes) {
            for (let scope of scopes) {
              if (!decoded.scopes.includes(scope)) {
                reject(new Error("JWT does not contain required scope."));
              }
            }
          }
          resolve(decoded);
        }
      });
    });
  } else {
    return Promise.reject("Authentication Failed!");
  }
}

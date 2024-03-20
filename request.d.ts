import AuthenticatedUser from "src/middleware/models/authenticated-user";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
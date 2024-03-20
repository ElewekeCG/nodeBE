declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      PORT: number;
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_EXPIRES: string;
      REFRESH_SECRET: string;
      REFRESH_EXPIRES: string;
      JWT_ISSUER: string;
    }
  }
}

// convert this to a module
export {};

import { RequestHandler } from "express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API da Clínica",
      version: "1.0.0",
      description: "Documentação da API gerada automaticamente",
    },
    servers: [
      {
        url: "http://localhost:3333/api",
      },
    ],
  },
  apis: [
    "./src/routes/**/*.ts",
    // , "./src/models/*.ts"
  ],
  // components: {
  //   securitySchemes: {
  //     bearerAuth: {
  //       type: "http",
  //       scheme: "bearer",
  //       bearerFormat: "JWT",
  //     },
  //   },
  // },
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiServe: RequestHandler[] = swaggerUi.serve;
export const swaggerUiSetup: RequestHandler = swaggerUi.setup(swaggerSpec);

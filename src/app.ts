import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import { SERVER_PORT } from "./configs";
import { errorHandler } from "./middlewares";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";

export class App {
  public app: express.Application;
  public port: string | number;
  constructor() {
    this.app = express();
    this.port = SERVER_PORT || 3000;
    this.initializeMiddlewares();
    RegisterRoutes(this.app);
    this.app.use(errorHandler);
    this.initializeSwagger();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 http://localhost:${this.port}/docs`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(morgan("tiny"));
    this.app.use(cors({ origin: "*", credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private initializeSwagger() {
    this.app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
      return res.send(swaggerUi.generateHTML(await import("./swagger/swagger.json")));
    });
  }
}

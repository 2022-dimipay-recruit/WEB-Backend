import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import jsend from 'jsend';
import config from 'config';
import cookieParser from 'cookie-parser';

import errorHandler from 'middlewares/error-handler';
import { serviceRouter } from 'routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRouter();
    this.initializeErrorHandlers();
  }

  private initializeRouter() {
    this.app.use('/', serviceRouter);
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '/assets')));
    this.app.use(jsend.middleware);
    this.app.use(cookieParser(config.cookieSecret));
  }

  private initializeErrorHandlers() {
    this.app.use(errorHandler);
  }
}

export default App;

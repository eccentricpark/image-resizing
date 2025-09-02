import express from "express";
import morgan from "morgan";
import cors from 'cors';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from "typedi";
import { GlobalErrorHandler } from "../middlewares/global-error-handler";
import { GlobalResponseInterceptor } from "../middlewares/global-response-interceptor";
import { AppController } from "../app.controller";
import { ResizingController } from "../features/resizing/resizing.controller";
import { ConversionController } from "../features/conversion/conversion.controller";

export async function setExpress(app: express.Application) {
  useContainer(Container);
  const controllers = [
    AppController, 
    ResizingController,
    ConversionController
  ];
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(morgan('dev'));
  useExpressServer(app, {
    controllers: controllers,
    interceptors: [GlobalResponseInterceptor],
    middlewares: [GlobalErrorHandler]
  });
}
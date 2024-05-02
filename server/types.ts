import { Router } from 'express';

export type AppContext = {};
export type Service = (context: AppContext) => Router;

import { Express } from 'express';

export type ApiKnob = (app: Express) => void;

export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
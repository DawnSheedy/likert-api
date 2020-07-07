import { Router } from 'express';
import expressLoader from './express';
import dependencyLoader from './dependencyInjection';
import { Container } from 'typedi';
import { Logger } from 'winston';
import authLoader from './auth';

export default async (app:Router): Promise<void> => {
    await dependencyLoader();
    const logger = Container.get<Logger>('logger');
    logger.info('Dependency Injection Loaded!');
    await authLoader();
    await expressLoader(app);
    logger.info('Express loaded!');
};
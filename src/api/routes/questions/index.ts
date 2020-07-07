import { Router } from 'express';
import instance from './instance';
import root from './root';

export default (app: Router): void => {
    instance(app);
    root(app);
};
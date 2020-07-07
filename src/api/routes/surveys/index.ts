import { Router } from 'express';
import instance from './instance';
import root from './root';

export default (app: Router): void => {
    root(app);
    instance(app);
};
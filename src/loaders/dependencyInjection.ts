import { Container } from 'typedi';
import logInstance from './winston';

export default (): void => {
    Container.set('logger', logInstance);
};
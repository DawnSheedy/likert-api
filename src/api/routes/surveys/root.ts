import { Router } from 'express';
import { Container } from 'typedi';
import SurveyService from '../../../entity/Survey/service';
import Survey from '../../../entity/Survey/entity';
import { celebrate, Segments, Joi } from 'celebrate';
import { Logger } from 'winston';
import passport from 'passport';
import adminCheck from '../../middleware/adminCheck';
//import { Like } from 'typeorm';

const route = Router();

export default (api: Router): void => {
    const logger = Container.get<Logger>('logger');
    const surveyService = Container.get(SurveyService);

    api.use('/surveys', route);

    // Require admin authentication
    route.use(passport.authenticate('token', { session: false }));
    route.use(adminCheck);

    /*
        GET /
        Return list of surveys;
    */
    route.get('/', async (req, res) => {
        const surveys = await Survey.find({});
        res.json(surveys);
    });
    /*
        PUT /
        Create a survey
    */
    route.put('/',
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                title: Joi.string().required(),
                description: Joi.string().required(),
                questions: Joi.array().items(Joi.object({
                    query: Joi.string().required(),
                    helpText: Joi.string().optional(),
                    optionOne: Joi.string().default('Disagree'),
                    optionTwo: Joi.string().default('Agree')
                })).optional()
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }), async (req, res, next) => {
            await surveyService.create(req.body)
                .then((survey) => {
                    res.json(survey);
                })
                .catch((err) => {
                    next(err);
                });
        });

    /* Not yet implemented.
    route.post('/:id/update',
        celebrate({
            [Segments.PARAMS]: Joi.object().keys({
                id: Joi.string().required()
            })
        }), async (req: any, res, next) => {
            await surveyService.delete(req.params)
                .then((deleted) => {
                    res.json(deleted);
                })
                .catch((err) => {
                    next(err);
                });
        });
    */
    logger.info('Loaded survey root endpoints.');
};
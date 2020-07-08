import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Segments, Joi } from 'celebrate';
import { Logger } from 'winston';
import passport from 'passport';
import adminCheck from '../../middleware/adminCheck';
import InviteService from '../../../entity/Invite/service';
import paramTo from '../../middleware/paramTo';
import Invite from '../../../entity/Invite/entity';
import SurveyService from '../../../entity/Survey/service';
import QuestionService from '../../../entity/Question/service';
import Question from '../../../entity/Question/entity';
//import Survey from '../../../entity/Survey/entity';

/* 
    SURVEY INSTANCE ROUTES 
    Used for accessing data regarding an existing survey.
*/


const route = Router({ mergeParams: true });

export default (api: Router): void => {
    const logger = Container.get<Logger>('logger');
    const inviteService = Container.get(InviteService);
    const surveyService = Container.get(SurveyService);
    const questionService = Container.get(QuestionService);

    api.use('/surveys/:id', route);

    // Require admin authentication
    route.use(passport.authenticate('token', { session: false, failWithError: true }));
    route.use(adminCheck);

    //Convert survey parameter into usable object.
    route.use(paramTo.SURVEY);

    /*
        GET /
        Retrieve current survey object.
    */
    route.get('/', async (req, res) => {
        res.json(req.body.survey);
    });

    /*
        DELETE /:id
        deletes given survey
    */
    route.delete('/',
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                survey: Joi.object().required()
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }), async (req: any, res, next) => {
            await surveyService.delete(req.body.survey)
                .then((deleted) => {
                    res.json(deleted);
                })
                .catch((err) => {
                    next(err);
                });
        });

    /*
        GET /invites
        list invites registered to a survey
    */
    route.get('/invites', async (req, res, next) => {
        const invites = await Invite.find({ where: { survey: req.body.survey }, relations: ['survey'] })
            .catch(err => next(err));
        res.json(invites);
    });

    /*
        PUT /invites
        create a new survey invite
    */
    route.put('/invites',
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                survey: Joi.object().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                completed: Joi.string().default(false)
            })
        }), async (req, res, next) => {
            await inviteService.create(req.body)
                .then((response) => {
                    res.json(response);
                })
                .catch((err) => {
                    next(err);
                });
        });

    /*
        GET /invites
        list invites registered to a survey
    */
    route.get('/questions', async (req, res, next) => {
        const questions = await Question.find({ where: { survey: req.body.survey }, relations: ['survey'] })
            .catch(err => next(err));
        res.json(questions);
    });

    /*
        PUT /questions
        create a new survey question
    */
    route.put('/questions',
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                survey: Joi.object().required(),
                query: Joi.string().required(),
                helpText: Joi.string().optional(),
                optionOne: Joi.string().default('Disagree'),
                optionTwo: Joi.string().default('Agree')
            })
        }), async (req, res, next) => {
            await questionService.create(req.body)
                .then((response) => {
                    res.json(response);
                })
                .catch((err) => {
                    next(err);
                });
        });

    logger.info('Loaded survey api.');
};
import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Segments, Joi } from 'celebrate';
import { Logger } from 'winston';
import passport from 'passport';
import adminCheck from '../../middleware/adminCheck';
import paramTo from '../../middleware/paramTo';
import Answer from '../../../entity/Answer/entity';
import QuestionService from '../../../entity/Question/service';
import Survey from '../../../entity/Survey/entity';

/* 
    Question Instance Routes
    Used for accessing data regarding an existing question
*/


const route = Router({ mergeParams: true });

export default (api: Router): void => {
    const logger = Container.get<Logger>('logger');
    const questionService = Container.get(QuestionService);

    api.use('/questions/:id', route);

    // Require admin authentication
    route.use(passport.authenticate('token', { session: false, failWithError: true}));
    route.use(adminCheck);

    //Convert survey parameter into usable object.
    route.use(paramTo.QUESTION);

    route.get('/', async (req, res) => {
        res.json(req.body.question);
    });

    /*
        PATCH /
        update a question
    */
    route.patch('/', celebrate({
        [Segments.BODY]: Joi.object().keys({
            question: Joi.object().required(),
            survey: Joi.object().optional(),
            query: Joi.string().optional(),
            helpText: Joi.string().optional(),
            optionOne: Joi.string().default('Disagree'),
            optionTwo: Joi.string().default('Agree')
        })
    }), async (req, res, next) => {
        const id = req.body.question;
        delete req.body.question;
        await questionService.update(id ,req.body)
            .catch(err => next(err));
        res.json({ id: id });
    });

    /*
        DELETE /
        delete a question
    */
    route.delete('/', async (req, res, next) => {
        await questionService.delete(req.body.question)
            .then((deleted) => {
                res.json(deleted);
            })
            .catch((err) => {
                next(err);
            });
    });

    route.get('/answers', async (req, res, next) => {
        const answers = await Answer.find({ where: { question: req.body.question } })
            .catch(err =>  next(err));
        res.json(answers);
    });

    route.get('/survey', async (req, res, next) => {
        const survey = await Survey.findOneOrFail(req.body.question.survey)
            .catch(err => next(err));
        res.json(survey);
    });

    logger.info('Invites: Instance Endpoints Loaded.');
};
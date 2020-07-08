import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Segments, Joi } from 'celebrate';
import { Logger } from 'winston';
import passport from 'passport';
import adminCheck from '../../middleware/adminCheck';
import paramTo from '../../middleware/paramTo';
import InviteService from '../../../entity/Invite/service';
import Answer from '../../../entity/Answer/entity';
import Survey from '../../../entity/Survey/entity';
import AnswerService from '../../../entity/Answer/service';

/* 
    SERVER SESSION ROUTES 
    Used for accessing data regarding a server session.
*/


const route = Router({ mergeParams: true });

export default (api: Router): void => {
    const logger = Container.get<Logger>('logger');
    const inviteService = Container.get(InviteService);
    const answerService = Container.get(AnswerService);

    api.use('/invites/:id', route);

    // Require authentication to access
    route.use(passport.authenticate(['response-auth', 'token'], { session: false, failWithError: true }));

    //Convert survey parameter into usable object.
    route.use(paramTo.INVITE);

    //Single use middleware.
    /*
        Verifies that the user has permission to access these endpoints.
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    route.use(async (req: any, res, next) => {
        if (req.user.isAdmin) {
            next();
            return;
        }
        if (req.user.accessCode == req.body.invite.accessCode) {
            next();
            return;
        }
        res.status(403);
        next(new Error('Forbidden.'));
    });

    route.get('/', async (req, res) => {
        res.json(req.body.invite);
    });

    /*
        PATCH /
        update an invite
    */
    route.patch('/', celebrate({
        [Segments.BODY]: Joi.object().keys({
            invite: Joi.object().required(),
            survey: Joi.object().optional(),
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional(),
            completed: Joi.boolean().optional()
        })
    }), async (req, res, next) => {
        const id = req.body.invite.id;
        delete req.body.invite;
        await inviteService.update(id, req.body)
            .catch(err => next(err));
        res.json({ id: id });
    });

    /*
        DELETE /
        delete an invite

        requires admin priveleges
    */
    route.delete('/', passport.authenticate('token', { session: false }), adminCheck, async (req, res, next) => {
        await inviteService.delete(req.body.invite)
            .then((deleted) => {
                res.json(deleted);
            })
            .catch((err) => {
                next(err);
            });
    });

    route.get('/answers', async (req: any, res, next) => {
        if (!req.user.isAdmin) {
            next(new Error("Forbidden"))
            return
        }
        const answers = await Answer.find({ where: { invite: req.body.invite.id }, relations: ['question'] })
            .catch(err => next(err));
        res.json(answers);
    });

    //insert an answer
    route.put('/answers',
        celebrate({
            [Segments.BODY]: Joi.object().keys({
                invite: Joi.object().required(),
                question: Joi.string().required(),
                input: Joi.number().required()
            })
        }), async (req, res, next) => {
            const exists = await Answer.findOne({ invite: req.body.invite, question: req.body.question })
                .catch(err => next(err));
            await answerService.create(req.body)
                .then((response) => {
                    res.json(response);
                })
                .catch((err) => {
                    next(err);
                });
        });

    route.get('/survey', async (req: any, res, next) => {
        const survey: any = await Survey.findOne(req.body.invite.survey, { relations: ['questions'] })
            .catch(err => next(err));

        //Remove answered questions, unless user is an admin
        if (!req.user.isAdmin) {
            const answers: any = await Answer.find({ where: { invite: req.body.invite.id }, relations: ['question'] })
            console.log(JSON.stringify(answers))
            let answerQuestionIds = [];
            for (let i = 0; i < answers.length; i++) {
                answerQuestionIds[i] = answers[i].question.id
            }
            for (let i = survey.questions.length - 1; i >= 0; i--) {
                if (answerQuestionIds.includes(survey.questions[i].id)) {
                    survey.questions.splice(i, 1);
                }
            }
        }

        res.json(survey);
    });

    logger.info('Invites: Instance Endpoints Loaded.');
};
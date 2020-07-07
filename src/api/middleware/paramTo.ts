/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Survey from '../../entity/Survey/entity';
import Invite from '../../entity/Invite/entity';
import Question from '../../entity/Question/entity';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default {

    /*
        convert id to SURVEY
    */
    SURVEY: async (req, res, next): Promise<void> => {
        //Contingency due to a bug in typeorm
        if (!req.params.id) {
            next(new Error('Invalid Survey ID'));
        }

        const survey = await Survey.findOneOrFail({ id: req.params.id })
            .catch((err) => {
                next(err);
            });

        req.body.survey = survey;
        next();
    },

    /*
        convert id to INVITE
    */
    INVITE: async (req, res, next): Promise<void> => {
        //Contingency due to a bug in typeorm
        if (!req.params.id) {
            next(new Error('Invalid Invite ID'));
        }

        const survey = await Invite.findOneOrFail({ id: req.params.id })
            .catch((err) => {
                next(err);
            });

        req.body.invite = survey;
        next();
    },


    QUESTION: async (req, res, next): Promise<void> => {
        //Contingency due to a bug in typeorm
        if (!req.params.id) {
            next(new Error('Invalid Invite ID'));
        }

        const survey = await Question.findOneOrFail({ id: req.params.id })
            .catch((err) => {
                next(err);
            });

        req.body.question = survey;
        next();
    },
};
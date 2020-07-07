/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject } from 'typedi';
import { Logger } from 'winston';
//import { BaseEntity } from 'typeorm';
import UserInputSchema from './schema';
import EntitySample from './entity';



export default class EntityServiceSample<T extends UserInputSchema, U extends EntitySample> {

    @Inject('logger')
    logger: Logger;

    entity: any;

    async create(info: T): Promise<U> {
        const object = await this.entity.create(info);
        //.catch(err => this.logger.error(err));
        await object.save();
        return object;
    }

    async read(info: T): Promise<U> {
        const object = await this.entity.findOneOrFail(info);
        //.catch(err => this.logger.error(err));
        return object;
    }

    async update(id: string, info: T): Promise<U> {
        info = this.cleanse(info);
        const object = await this.entity.update(id, info);
        //.catch(err => this.logger.error(err));
        return object;
    }

    async delete(info: T): Promise<U> {
        const object = await this.entity.findOneOrFail(info.id);
        //.catch (err => this.logger.error(err));
        object.remove();
        return object;
    }

    private cleanse(info: T): T {
        for (const propName in info) {
            if (info[propName] === null || info[propName] === undefined) {
                delete info[propName];
            }
        }
        return info;
    }
}
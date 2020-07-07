import {PrimaryGeneratedColumn, BaseEntity, Entity} from 'typeorm';

@Entity()
export default class EntitySample extends BaseEntity {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //[x: string]: any;

    @PrimaryGeneratedColumn('uuid')
    id: string;

}
import {Entity, Column, BeforeInsert} from 'typeorm';
import crypto from 'crypto';
import EntitySample from '../Sample/entity';
@Entity()
export default class User extends EntitySample {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    hash: string;

    @Column()
    salt: string;

    @Column()
    isAdmin: boolean;

    @BeforeInsert()
    beforeInsertActions(): void {
        this.isAdmin = false;
        return;
    }

    public setPassword(password: string): void {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    }

    public verifyPassword(password: string): boolean {
        const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
        return hash === this.hash;
    }
}

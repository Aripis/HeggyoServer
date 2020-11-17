/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity()
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: false })
    classNumber: number;

    @Column({ nullable: false })
    classLetter: string;
}

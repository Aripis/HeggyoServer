/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Class } from 'src/institution/classes/class.model';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user.model';

@ObjectType()
@Entity()
export class Student {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => User)
    @OneToOne(() => User)
    @JoinColumn({ name: 'user' })
    user: User;

    @Field({ nullable: true })
    @Column('varchar', { nullable: true, length: 2 })
    classLetter?: string;

    @Field(() => Int, { nullable: true })
    @Column({ type: 'tinyint', nullable: true })
    classNumber?: number;

    @Field(() => Date, { nullable: true })
    @Column({ type: 'date', nullable: true })
    startDate?: Date;

    @Field(() => Class, { nullable: true })
    @OneToOne(() => Class, { nullable: true })
    @JoinColumn({ name: 'class' })
    class?: Class;

    @Field({ nullable: true })
    @Column('text', { nullable: true })
    prevEducation?: string;
}

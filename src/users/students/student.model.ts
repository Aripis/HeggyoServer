/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user.model';

@ObjectType()
@Entity()
export class Student {
    @Field(() => User)
    @PrimaryGeneratedColumn('uuid')
    user: User;

    @Field(() => ID)
    @OneToOne(() => User)
    @JoinColumn()
    id: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    education: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    workExperience: number;
}

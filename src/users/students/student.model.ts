import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user.model';
import { Parent } from '../parents/parent.model';
import { Class } from 'src/institution/classes/class.model';

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

    @Field(() => Date, { nullable: true })
    @Column({ type: 'date', nullable: true })
    startDate?: Date;

    @Field(() => Class, { nullable: true })
    @OneToOne(() => Class, { nullable: true })
    @JoinColumn({ name: 'class' })
    class?: Class;

    @Field()
    @Column('text', { default: 'none' })
    prevEducation: string;

    @Field()
    @Column('varchar', { length: 5 })
    studentToken: string;

    @Field(() => [Parent], { nullable: true })
    @ManyToMany(
        () => Parent,
        parent => parent.children,
        { nullable: true },
    )
    parents?: Parent[];
}

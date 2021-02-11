import { Field, registerEnumType, ID, ObjectType, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

import { Teacher } from 'src/teachers/teacher.model';
import { Institution } from '../institution/institution.model';
import { Schedule } from 'src/schedule/schedule.model';
import { Subject } from 'src/subjects/subject.model';
import { Message } from 'src/messages/message.model';

export enum TokenStatus {
    ACTIVE,
    INACTIVE,
}

registerEnumType(TokenStatus, {
    name: 'TokenStatus',
});

@ObjectType()
@Entity()
@Unique(['classLetter', 'classNumber'])
export class Class {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Institution)
    @ManyToOne(() => Institution, { eager: true })
    institution: Institution;

    @Field(() => Int)
    @Column('year')
    startYear: number;

    @Field(() => Int)
    @Column('year')
    endYear: number;

    @Field(() => Int)
    @Column('tinyint')
    totalStudentCount: number;

    @Field(() => Teacher, { nullable: true })
    @OneToOne(() => Teacher, { eager: true, nullable: true })
    @JoinColumn()
    teacher: Teacher;

    @Field()
    @Column('varchar', { length: 1 })
    @Length(1, 3)
    classLetter: string;

    @Field(() => Int)
    @Column('tinyint')
    @Length(1, 3)
    classNumber: number;

    @Field()
    @Column('varchar', { length: 10, default: '' })
    classToken: string;

    @Field(() => TokenStatus)
    @Column({
        type: 'enum',
        enum: TokenStatus,
        nullable: false,
        default: TokenStatus.ACTIVE,
    })
    classTokenStatus: TokenStatus;

    @Field(() => [Schedule])
    @OneToMany(
        () => Schedule,
        schedule => schedule.class,
    )
    schedules: Schedule[];

    @Field(() => [Subject], { nullable: true })
    @OneToMany(
        () => Subject,
        subject => subject.class,
    )
    subjects: Subject[];

    @Field(() => [Message])
    @ManyToMany(
        () => Message,
        message => message.toClasses,
        {
            cascade: true,
        },
    )
    messages: Message[];
}

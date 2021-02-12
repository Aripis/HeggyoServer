import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    Column,
    Entity,
    Unique,
} from 'typeorm';
import { Field, registerEnumType, ID, ObjectType, Int } from '@nestjs/graphql';
import { Institution } from '../institution/institution.model';
import { Schedule } from 'src/schedule/schedule.model';
import { Teacher } from 'src/teacher/teacher.model';
import { Subject } from 'src/subject/subject.model';
import { Message } from 'src/message/message.model';
import { Length } from 'class-validator';

export enum TokenStatus {
    ACTIVE,
    INACTIVE,
}

registerEnumType(TokenStatus, {
    name: 'TokenStatus',
});

@ObjectType()
@Entity()
@Unique(['letter', 'number'])
export class Class {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

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
    letter: string;

    @Field(() => Int)
    @Column('tinyint')
    number: number;

    @Field()
    @Column('varchar', { length: 10, default: '' })
    token: string;

    @Field(() => TokenStatus)
    @Column({
        type: 'enum',
        enum: TokenStatus,
        nullable: false,
        default: TokenStatus.ACTIVE,
    })
    tokenStatus: TokenStatus;

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

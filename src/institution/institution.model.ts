import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Field, registerEnumType, ID, ObjectType } from '@nestjs/graphql';
import { Schedule } from 'src/schedule/schedule.model';
import { Subject } from 'src/subject/subject.model';
import { User } from 'src/user/user.model';
import { IsEmail } from 'class-validator';

export enum InstitutionType {
    NATURAL_MATHEMATICAL = 'natural_mathematical',
    TECHNOLOGICAL = 'technological',
    LINGUISTICAL = 'linguistical',
    MATHEMATICAL = 'mathematical',
    HUMANITARIAN = 'humanitarian',
    ART = 'art',
    SU = 'su',
    OU = 'ou',
}

export enum EducationStage {
    ELEMENTARY = 'elementary',
    PRIMARY = 'primary',
    UNITED = 'united',
    HIGH = 'high',
}

registerEnumType(InstitutionType, {
    name: 'InstitutionType',
});

registerEnumType(EducationStage, {
    name: 'EducationStage',
});

@ObjectType()
@Entity()
export class Institution {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field()
    @Column({ unique: true })
    name: string;

    @Field()
    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Field(() => InstitutionType)
    @Column({
        type: 'enum',
        enum: InstitutionType,
    })
    type: InstitutionType;

    @Field(() => EducationStage)
    @Column({
        type: 'enum',
        enum: EducationStage,
    })
    educationalStage: EducationStage;

    @Field()
    @Column({ unique: true })
    alias: string;

    @Field(() => [User], { nullable: true })
    @OneToMany(
        () => User,
        user => user.institution,
        { nullable: true },
    )
    users?: User[];

    @Field(() => [Subject], { nullable: true })
    @OneToMany(
        () => Subject,
        subject => subject.institution,
        { nullable: true },
    )
    subjects: Subject[];

    @Field(() => [Schedule])
    @OneToMany(
        () => Schedule,
        schedule => schedule.institution,
        { nullable: true },
    )
    schedules: Schedule[];
}

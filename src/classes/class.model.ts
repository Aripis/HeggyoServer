import { Field, registerEnumType, ID, ObjectType, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

import { Teacher } from 'src/teachers/teacher.model';
import { Institution } from '../institution/institution.model';

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
    @ManyToOne(() => Institution)
    @JoinColumn({ name: 'institution' })
    institution: Institution;

    @Field(() => Int)
    @Column('year')
    forYear: number;

    @Field(() => Int)
    @Column('tinyint')
    totalStudentCount: number;

    @Field(() => Teacher)
    @OneToOne(() => Teacher)
    @JoinColumn({ name: 'classTeacher' })
    classTeacher: Teacher;

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
}

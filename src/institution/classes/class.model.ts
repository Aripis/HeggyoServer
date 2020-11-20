import { Field, registerEnumType, ID, ObjectType, Int } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { Teacher } from 'src/users/teachers/teacher.model';
import { TokenStatus } from '../institution.model';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

registerEnumType(TokenStatus, {
    name: 'TokenStatus',
});

@ObjectType()
@Entity()
export class Class {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    // FIXME: think if it shouldn't be only one char
    @Field()
    @Column('varchar', { length: 3 })
    @Length(1, 3)
    classLetter: string;

    @Field(() => Int)
    @Column('tinyint')
    @Length(1, 3)
    classNumber: number;

    @Field()
    @Column('varchar', { length: 5, unique: true })
    @Length(5)
    registerToken: string;

    @Field(() => TokenStatus)
    @Column({
        type: 'enum',
        enum: TokenStatus,
        nullable: false,
        default: TokenStatus.ACTIVE,
    })
    registerTokenStatus: TokenStatus;
}

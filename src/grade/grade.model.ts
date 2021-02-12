import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Column,
    Entity,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Student } from 'src/student/student.model';
import { Subject } from 'src/subject/subject.model';
import { Max, Min } from 'class-validator';
import { User } from 'src/user/user.model';

export enum GradeType {
    YEAR = 'year',
    TURM_1 = 'turm_1',
    TURM_2 = 'turm_2',
    ONGOING = 'ongoing',
}

export enum GradeWord {
    BAD,
    AVERAGE,
    GOOD,
    VERY_GOOD,
    EXCELLENT,
}

registerEnumType(GradeType, {
    name: 'GradeType',
});

registerEnumType(GradeWord, {
    name: 'GradeWord',
});

@ObjectType()
@Entity()
export class StudentGrade {
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
    @Column()
    message: string;

    @Field(() => GradeType)
    @Column({
        type: 'enum',
        enum: GradeType,
        default: GradeType.ONGOING,
    })
    type: GradeType;

    @Field()
    @Column()
    @Min(2)
    @Max(6)
    grade: number;

    @Field(() => GradeWord)
    @Column({
        type: 'enum',
        enum: GradeWord,
        default: GradeWord.EXCELLENT,
    })
    gradeWithWords: GradeWord;

    @Field(() => User)
    @ManyToOne(
        () => User,
        user => user.studentGrades,
        { eager: true },
    )
    fromUser: User;

    @Field(() => Student)
    @ManyToOne(
        () => Student,
        student => student.grades,
        { eager: true },
    )
    student: Student;

    @Field(() => Subject)
    @ManyToOne(
        () => Subject,
        subject => subject.grades,
        { eager: true },
    )
    subject: Subject;
}

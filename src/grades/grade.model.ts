import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsIn, IsLowercase, Max, Min } from 'class-validator';
import { Student } from 'src/students/student.model';
import { Subject } from 'src/subjects/subject.model';
import { User } from 'src/users/user.model';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum GradeTypes {
    YEAR = 'year',
    TURM_1 = 'turm_1',
    TURM_2 = 'turm_2',
    ONGOING = 'ongoing',
}

registerEnumType(GradeTypes, {
    name: 'GradeTypes',
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

    @Field(() => GradeTypes)
    @Column({
        type: 'enum',
        enum: GradeTypes,
        default: GradeTypes.ONGOING,
    })
    type: GradeTypes;

    @Field()
    @Column()
    @Min(2)
    @Max(6)
    grade: number;

    @Field()
    @Column()
    @IsLowercase()
    @IsIn(['bad', 'average', 'good', 'very good', 'excellent'])
    gradeWithWords: string;

    @Field(() => User)
    @ManyToOne(
        () => User,
        user => user.studentDossiers,
        { eager: true },
    )
    fromUser: User;

    @Field(() => Student)
    @ManyToOne(
        () => Student,
        student => student.grades,
    )
    student: Student;

    @Field(() => Subject, { nullable: true })
    @ManyToOne(
        () => Subject,
        subject => subject.grades,
        { eager: true },
    )
    subject: Subject;
}

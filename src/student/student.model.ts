import {
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToMany,
    JoinTable,
    ManyToOne,
    OneToMany,
    OneToOne,
    Column,
    Entity,
} from 'typeorm';
import { StudentDossier } from 'src/student-dossier/student-dossier.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StudentGrade } from 'src/grade/grade.model';
import { Parent } from 'src/parent/parent.model';
import { Class } from 'src/class/class.model';
import { User } from 'src/user/user.model';
import { File } from 'src/file/file.model';

@ObjectType()
@Entity()
export class Student {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => User)
    @OneToOne(() => User, { eager: true, cascade: true })
    @JoinColumn()
    user: User;

    @Field(() => Date, { nullable: true })
    @Column({ type: 'date', nullable: true })
    startDate?: Date;

    @Field(() => Class)
    @ManyToOne(() => Class, { eager: true })
    class?: Class;

    @Field()
    @Column('text', { default: 'none' })
    prevEducation: string;

    @Field()
    @Column('varchar', { length: 10, default: '' })
    token: string;

    @Field(() => [Parent], { nullable: true })
    @ManyToMany(
        () => Parent,
        parent => parent.students,
        { nullable: true },
    )
    parents?: Parent[];

    @Field({ nullable: true })
    @Column({ nullable: true })
    recordMessage?: string;

    @Field(() => [File], { nullable: true })
    @ManyToMany(
        () => File,
        fil => fil.studentRecords,
        { eager: true, nullable: true, cascade: true },
    )
    @JoinTable({
        name: 'student_record_files',
        joinColumn: {
            name: 'student',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'file',
            referencedColumnName: 'id',
        },
    })
    recordFiles?: File[];

    @Field(() => [StudentDossier], { nullable: true })
    @OneToMany(
        () => StudentDossier,
        dossier => dossier.student,
        { eager: true, nullable: true, cascade: true },
    )
    dossier: StudentDossier[];

    @Field(() => [StudentGrade])
    @OneToMany(
        () => StudentGrade,
        grade => grade.student,
        { nullable: true },
    )
    grades: StudentGrade[];
}

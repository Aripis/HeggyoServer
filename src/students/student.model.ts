import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.model';
import { Parent } from '../parents/parent.model';
import { Class } from 'src/classes/class.model';
import { File } from 'src/file/file.model';
import { StudentDossier } from 'src/dossier/student_dossier.model';
import { StudentGrade } from 'src/grades/grade.model';

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
    @Column('varchar', { length: 10 })
    token: string;

    @Field()
    @Column('varchar', { length: 10, default: 'none' })
    studentToken: string;

    @Field(() => [Parent], { nullable: true })
    @ManyToMany(
        () => Parent,
        parent => parent.children,
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

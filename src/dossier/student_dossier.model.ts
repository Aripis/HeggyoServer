import { Field, ID, ObjectType } from '@nestjs/graphql';
import { File } from 'src/file/file.model';
import { Student } from 'src/students/student.model';
import { Subject } from 'src/subjects/subject.model';
import { User } from 'src/users/user.model';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class StudentDossier {
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
    dossierMessage: string;

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
        student => student.dossier,
    )
    student: Student;

    @Field(() => [File], { nullable: true })
    @ManyToMany(
        () => File,
        fil => fil.dossiers,
        { nullable: true, cascade: true, eager: true },
    )
    @JoinTable({
        name: 'student_dossier_files',
        joinColumn: {
            name: 'dossier',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'file',
            referencedColumnName: 'id',
        },
    })
    studentFiles?: File[];

    @Field(() => Subject, { nullable: true })
    @ManyToOne(
        () => Subject,
        subject => subject.studentDossiers,
        { nullable: true, eager: true },
    )
    subject?: Subject;
}

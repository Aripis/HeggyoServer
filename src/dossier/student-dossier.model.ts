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
    @Column()
    dossierMessage: string;

    @Field(() => User)
    @ManyToOne(
        () => User,
        user => user.studentDossiers,
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
        fil => fil.dossierFiles,
        { eager: true, nullable: true, cascade: true },
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
    @Column(() => Subject)
    subject?: Subject;
}

import {
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    Column,
    Entity,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Student } from 'src/student/student.model';
import { Subject } from 'src/subject/subject.model';
import { User } from 'src/user/user.model';
import { File } from 'src/file/file.model';

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
    message: string;

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
        fil => fil.studentDossiers,
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
    files?: File[];

    @Field(() => Subject, { nullable: true })
    @ManyToOne(
        () => Subject,
        subject => subject.studentDossiers,
        { nullable: true, eager: true },
    )
    subject?: Subject;
}

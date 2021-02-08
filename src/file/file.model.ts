import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StudentDossier } from 'src/dossier/student_dossier.model';
import { Student } from 'src/students/student.model';
import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from '../messages/message.model';

@ObjectType()
@Entity()
export class File {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    filename: string;

    @Field()
    @Column()
    cloudFilename: string;

    @Field({ nullable: true })
    publicUrl?: string;

    @Field(() => Message)
    @ManyToOne(
        () => Message,
        message => message.files,
        { nullable: true },
    )
    message?: Message;

    @Field(() => [Student])
    @ManyToMany(
        () => Student,
        student => student.recordFiles,
        {
            nullable: true,
        },
    )
    studentRecords?: Student[];

    @Field(() => [StudentDossier])
    @ManyToMany(
        () => StudentDossier,
        student => student.studentFiles,
        {
            nullable: true,
        },
    )
    dossiers?: StudentDossier[];
}

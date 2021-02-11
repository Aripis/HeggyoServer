import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { StudentDossier } from 'src/student-dossier/student-dossier.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Student } from 'src/student/student.model';
import { Message } from 'src/message/message.model';

@ObjectType()
@Entity()
export class File {
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
        studentDossier => studentDossier.files,
        {
            nullable: true,
        },
    )
    studentDossiers?: StudentDossier[];
}

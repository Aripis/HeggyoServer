import { Field, ID, ObjectType } from '@nestjs/graphql';
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
    filePath: string;

    @Field(() => Message)
    @ManyToOne(
        () => Message,
        message => message.files,
    )
    message: Message;

    @Field(() => [Student])
    @ManyToMany(
        () => Student,
        student => student.recordFiles,
        {
            nullable: true,
        },
    )
    studentRecords: Student[];
}

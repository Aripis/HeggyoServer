import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.model';

@ObjectType()
@Entity()
export class File {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    filePath: string;

    @Field()
    @ManyToOne(
        () => Message,
        message => message.files,
    )
    message: Message;
}

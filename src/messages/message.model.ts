import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Class } from 'src/classes/class.model';
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

export enum MessageType {
    ASSIGNMENT = 'assignment',
}

export enum MessageStatus {
    CREATED = 'created',
    PUBLISHED = 'published',
}

registerEnumType(MessageType, {
    name: 'MessageType',
});

registerEnumType(MessageStatus, {
    name: 'MessageStatus',
});

@ObjectType()
@Entity()
export class Message {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => User)
    @ManyToOne(
        () => User,
        user => user.sentMessages,
        { eager: true },
    )
    from: User;

    @Field(() => [User])
    @ManyToMany(
        () => User,
        user => user.receivedMessages,
        {
            eager: true,
            nullable: true,
        },
    )
    @JoinTable({
        name: 'message_toUser',
        joinColumn: {
            name: 'message',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user',
            referencedColumnName: 'id',
        },
    })
    toUser: User[];

    @Field(() => [Class])
    @ManyToMany(
        () => Class,
        cls => cls.messages,
        {
            eager: true,
            nullable: true,
        },
    )
    @JoinTable({
        name: 'message_toClass',
        joinColumn: {
            name: 'message',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'class',
            referencedColumnName: 'id',
        },
    })
    toClasses: Class[];

    @Field({ nullable: true })
    @Column({ nullable: true })
    data?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    filePath?: string;

    @Field(() => MessageType)
    @Column({
        type: 'enum',
        enum: MessageType,
    })
    type: MessageType;

    @Field(() => MessageStatus)
    @Column({
        type: 'enum',
        enum: MessageStatus,
        default: MessageStatus.CREATED,
    })
    status: MessageStatus;
}

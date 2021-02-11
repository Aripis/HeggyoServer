import {
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToMany,
    OneToMany,
    ManyToOne,
    JoinTable,
    Column,
    Entity,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Subject } from 'src/subject/subject.model';
import { Class } from 'src/class/class.model';
import { User } from 'src/user/user.model';
import { File } from 'src/file/file.model';

export enum MessageType {
    ASSIGNMENT = 'assignment',
    MESSAGE = 'message',
}

export enum MessageStatus {
    CREATED = 'created',
    PUBLISHED = 'published',
}

export enum AssignmentType {
    HOMEWORK = 'homework',
    CLASSWORK = 'classwork',
    EXAM = 'exam',
}

registerEnumType(AssignmentType, {
    name: 'AssignmentType',
});

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
    fromUser: User;

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
        name: 'message_toUsers',
        joinColumn: {
            name: 'message',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user',
            referencedColumnName: 'id',
        },
    })
    toUsers: User[];

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

    @Field(() => AssignmentType, { nullable: true })
    @Column({
        nullable: true,
        type: 'enum',
        enum: AssignmentType,
    })
    assignmentType?: AssignmentType;

    @Field({ nullable: true })
    @Column({ nullable: true })
    data?: string;

    @Field(() => [File], { nullable: true })
    @OneToMany(
        () => File,
        file => file.message,
        { nullable: true, eager: true, cascade: true },
    )
    files?: File[];

    @Field(() => MessageType)
    @Column({
        type: 'enum',
        enum: MessageType,
    })
    messageType: MessageType;

    @Field(() => MessageStatus)
    @Column({
        type: 'enum',
        enum: MessageStatus,
        default: MessageStatus.CREATED,
    })
    status: MessageStatus;

    @Field(() => Subject, { nullable: true })
    @ManyToOne(
        () => Subject,
        subject => subject.messages,
        { eager: true, nullable: true },
    )
    subject?: Subject;

    @Field({ nullable: true })
    @Column({ nullable: true })
    assignmentDueDate?: Date;
}

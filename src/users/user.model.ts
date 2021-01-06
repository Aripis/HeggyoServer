import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { StudentDossier } from 'src/dossier/student_dossier.model';
import { Institution } from 'src/institution/institution.model';
import { Message } from 'src/messages/message.model';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum UserStatus {
    ACTIVE,
    INACTIVE,
    BLOCKED,
    UNVERIFIED,
}

export enum UserRoles {
    ADMIN = 'admin',
    PARENT = 'parent',
    STUDENT = 'student',
    TEACHER = 'teacher',
    VIEWER = 'viewer',
}

registerEnumType(UserStatus, {
    name: 'UserStatus',
});

registerEnumType(UserRoles, {
    name: 'UserRoles',
});

@ObjectType()
@Entity()
export class User {
    @Field()
    @CreateDateColumn()
    public createdAt: Date;

    @Field()
    @UpdateDateColumn()
    public updatedAt: Date;

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('varchar', { length: 50 })
    firstName: string;

    @Field()
    @Column('varchar', { length: 50 })
    middleName: string;

    @Field()
    @Column('varchar', { length: 50 })
    lastName: string;

    @Field()
    @Column({
        type: 'varchar',
        unique: true,
        length: 70,
    })
    email: string;

    @Field()
    @Column('text')
    password: string;

    @Field(() => UserRoles)
    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.VIEWER,
    })
    userRole: UserRoles;

    @Field({ nullable: true })
    @Column({ nullable: true })
    registerToken?: string;

    @Field(() => UserStatus)
    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.UNVERIFIED,
    })
    status: UserStatus;

    // TODO: Make it many to many relationship
    @Field(() => Institution)
    @ManyToOne(
        () => Institution,
        student => student.user,
        {
            cascade: true,
            eager: true,
        },
    )
    institution: Institution;

    @Field(() => [Message])
    @OneToMany(
        () => Message,
        message => message.from,
        { cascade: true },
    )
    sentMessages: Message[];

    @Field(() => [Message])
    @ManyToMany(
        () => Message,
        message => message.toUser,
        { cascade: true },
    )
    receivedMessages: Message[];

    @Field(() => [StudentDossier], { nullable: true })
    @OneToMany(
        () => StudentDossier,
        dossier => dossier.fromUser,
        { nullable: true },
    )
    studentDossiers: StudentDossier[];
}

import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    Column,
    Entity,
} from 'typeorm';
import { StudentDossier } from 'src/student-dossier/student-dossier.model';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Institution } from 'src/institution/institution.model';
import { StudentGrade } from 'src/grade/grade.model';
import { Message } from 'src/message/message.model';
import { IsEmail } from 'class-validator';

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked',
    UNVERIFIED = 'unverified',
}

export enum UserRole {
    ADMIN = 'admin',
    PARENT = 'parent',
    STUDENT = 'student',
    TEACHER = 'teacher',
    VIEWER = 'viewer',
}

registerEnumType(UserStatus, {
    name: 'UserStatus',
});

registerEnumType(UserRole, {
    name: 'UserRole',
});

@ObjectType()
@Entity()
export class User {
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
        length: 70,
        unique: true,
    })
    @IsEmail()
    email: string;

    @Field()
    @Column('text')
    password: string;

    @Field(() => UserRole)
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.VIEWER,
    })
    role: UserRole;

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

    @Field(() => Institution)
    @ManyToOne(
        () => Institution,
        student => student.users,
        {
            cascade: true,
            eager: true,
        },
    )
    institution: Institution;

    @Field(() => [Message])
    @OneToMany(
        () => Message,
        message => message.fromUser,
        { cascade: true },
    )
    sentMessages: Message[];

    @Field(() => [Message])
    @ManyToMany(
        () => Message,
        message => message.toUsers,
        { cascade: true },
    )
    receivedMessages: Message[];

    @Field(() => [StudentDossier], { nullable: true })
    @OneToMany(
        () => StudentDossier,
        dossier => dossier.fromUser,
        { nullable: true, cascade: true },
    )
    studentDossiers: StudentDossier[];

    @Field(() => [StudentGrade], { nullable: true })
    @OneToMany(
        () => StudentGrade,
        grade => grade.fromUser,
        { nullable: true, cascade: true },
    )
    studentGrades: StudentGrade[];
}

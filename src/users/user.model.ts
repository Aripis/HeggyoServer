import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Institution } from 'src/institution/institution.model';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
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
    ADMIN,
    PARENT,
    STUDENT,
    TEACHER,
    VIEWER,
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
    userRole: string;

    @Field({ nullable: true })
    @Column('varchar', { length: 6, nullable: true })
    registerToken?: string;

    @Field(() => UserStatus)
    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.UNVERIFIED,
    })
    status: UserStatus;

    @Field(() => Institution, { nullable: true })
    @ManyToOne(() => Institution, { nullable: true })
    @JoinColumn({ name: 'institution' })
    institution?: Institution;
}

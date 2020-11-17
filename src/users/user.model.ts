/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
// import { Status } from './user.entity';

export enum Status {
    ACTIVE,
    INACTIVE,
    BLOCKED,
    UNVERIFIED,
}

registerEnumType(Status, {
    name: 'Status',
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

    @Field({ nullable: false })
    @Column({ nullable: false })
    firstName: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    middleName: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    lastName: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    userName: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    email: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    password: string;

    @Field({ nullable: false })
    @Column({ nullable: true })
    userRole: string;

    @Field(() => Status, { nullable: false })
    @Column({
        type: 'enum',
        enum: Status,
        nullable: false,
        default: Status.UNVERIFIED,
    })
    status: Status;

    @Field({ nullable: false })
    @Column({ nullable: false })
    institutionId: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    registerToken: string;
}

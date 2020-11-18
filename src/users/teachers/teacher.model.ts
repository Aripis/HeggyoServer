/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user.model';
// import { ContractType } from './teacher.entity';

export enum ContractType {
    PART_TIME,
    FULL_TIME,
}

registerEnumType(ContractType, {
    name: 'ContractType',
});

@ObjectType()
@Entity()
export class Teacher {
    @Field(() => User)
    @PrimaryGeneratedColumn('uuid')
    user: User;

    @Field(() => ID)
    @OneToOne(() => User)
    @JoinColumn()
    id: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    education: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    workExperience: number;

    @Field(() => ContractType)
    @Column({
        type: 'enum',
        enum: ContractType,
    })
    contractType: ContractType;
}

import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
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
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => User)
    @OneToOne(() => User)
    @JoinColumn({ name: 'user' })
    user: User;

    @Field({ nullable: true })
    @Column({ nullable: true })
    education?: string;

    // TODO: should be able to auto-increment every year
    @Field(() => Int)
    @Column('tinyint', { nullable: true })
    yearsExperience?: number;

    @Field(() => ContractType, { nullable: true })
    @Column({
        type: 'enum',
        enum: ContractType,
        nullable: true,
    })
    contractType?: ContractType;
}

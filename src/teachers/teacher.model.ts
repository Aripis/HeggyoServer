import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Schedule } from 'src/schedule/schedule.model';
import { Subject } from 'src/subjects/subject.model';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.model';

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
    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    user: User;

    @Field({ nullable: true })
    @Column({ nullable: true })
    education?: string;

    // TODO: should be able to auto-increment every year
    @Field(() => Int, { nullable: true })
    @Column('tinyint', { nullable: true })
    yearsExperience?: number;

    @Field(() => ContractType, { nullable: true })
    @Column({
        type: 'enum',
        enum: ContractType,
        nullable: true,
    })
    contractType?: ContractType;

    @Field()
    @Column('varchar', { length: 5, default: 't' })
    teacherToken: string;

    @Field(() => [Subject], { nullable: true })
    @ManyToMany(
        () => Subject,
        subject => subject.teachers,
        { nullable: true },
    )
    subjects?: Subject[];

    @Field(() => [Schedule], { nullable: true })
    @ManyToMany(
        () => Schedule,
        schedule => schedule.teachers,
        { nullable: true },
    )
    schedules?: Schedule[];
}

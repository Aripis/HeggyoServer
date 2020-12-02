import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../students/student.model';
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
export class Parent {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => User)
    @OneToOne(() => User, { cascade: true, eager: true })
    @JoinColumn({ name: 'user' })
    user: User;

    @Field(() => [Student])
    @ManyToMany(
        () => Student,
        student => student.parents,
        {
            cascade: true,
            eager: true,
        },
    )
    @JoinTable({
        name: 'parent_child',
        joinColumn: {
            name: 'parent',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'student',
            referencedColumnName: 'id',
        },
    })
    children: Student[];
}

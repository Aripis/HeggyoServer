import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToMany,
    JoinTable,
    OneToOne,
    Entity,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Student } from '../student/student.model';
import { User } from '../user/user.model';

@ObjectType()
@Entity()
export class Parent {
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
    @OneToOne(() => User, { cascade: true, eager: true })
    @JoinColumn()
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
        name: 'parent_student',
        joinColumn: {
            name: 'parent',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'student',
            referencedColumnName: 'id',
        },
    })
    students: Student[];
}

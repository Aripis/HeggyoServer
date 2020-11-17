import { Field, registerEnumType, ID, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { Teacher } from 'src/users/teachers/teacher.model';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
    ACTIVE,
    INACTIVE,
}

registerEnumType(Status, {
    name: 'Status',
});

@ObjectType()
@Entity()
export class Class {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    forYear: number;

    @Field({ nullable: false })
    @Column({ nullable: false })
    totalStudentCount: number;

    @Field({ nullable: false })
    @OneToOne(() => Teacher)
    @JoinColumn()
    classTeacherId: Teacher;

    @Field({ nullable: false })
    @Column({ nullable: false })
    @Length(1, 3)
    classLetter: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    @Length(1, 3)
    classNumber: number;

    @Field({ nullable: false })
    @Column({ nullable: false })
    @Length(5)
    token: string;

    @Field({ nullable: false })
    @Column({
        type: 'enum',
        enum: Status,
        nullable: false,
        default: Status.ACTIVE,
    })
    tokenStatus: Status;
}

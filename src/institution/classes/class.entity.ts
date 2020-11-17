import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Length } from 'class-validator';

export enum Status {
    ACTIVE,
    INACTIVE,
}
@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    forYear: number;

    @Column({ nullable: false })
    totalStudentCount: number;

    @Column({ nullable: false })
    classTeacherId: number;
    // Trought Teacher Id and User relation we can get the institution Id

    @Column({ nullable: false })
    @Length(1, 3)
    classLetter: string;

    @Column({ nullable: false })
    @Length(1, 3)
    classNumber: number;

    @Column({
        type: 'enum',
        enum: Status,
        nullable: false,
        default: Status.ACTIVE,
    })
    tokenStatus: Status;

    @Column({ nullable: false })
    @Length(5)
    token: string;
}

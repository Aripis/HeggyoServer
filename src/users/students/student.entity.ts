/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';

@Entity()
export class Student extends User {
    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: false })
    classNumber: number;

    @Column({ nullable: false })
    classLetter: string;
}

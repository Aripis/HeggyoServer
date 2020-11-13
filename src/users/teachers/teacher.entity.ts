/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';

export enum ContractType {
    PART_TIME,
    FULL_TIME,
}

@Entity()
export class Teacher extends User {
    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: false })
    education: string;

    @Column({ nullable: false })
    workExperience: number;

    @Column({
        type: 'enum',
        enum: ContractType,
    })
    contractType: ContractType;
}

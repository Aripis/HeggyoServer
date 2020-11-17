/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user.entity';

export enum ContractType {
    PART_TIME,
    FULL_TIME,
}

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Max, Min } from 'class-validator';
import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
    ACTIVE,
    INACTIVE,
}
import { InstitutionEntity } from '../../institution/institution.entity';

@Entity()
export class ClassToken {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(type => InstitutionEntity)
    @JoinColumn()
    institution: InstitutionEntity;

    @Column({
        type: 'enum',
        enum: Status,
        nullable: false,
        default: Status.ACTIVE,
    })
    status: Status;

    @Column({ nullable: false })
    @Min(2)
    @Max(4)
    token: string;
}

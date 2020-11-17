import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Length } from 'class-validator';
import { InstitutionStatus, InstitutionType } from './institution.model';

// export enum Type {
//     TECHNOLOGICAL,
//     MATHEMATICAL,
//     NATURAL_MATHEMATICAL,
//     HUMANITARIAN,
//     ART,
//     LINGUISTICAL,
//     SU,
//     OU,
// }

// export enum InstitutionStatus {
//     ACTIVE,
//     INACTIVE,
// }

export enum EducationStage {
    ELEMENTARY,
    PRIMARY,
    UNITED,
    HIGH,
    SECONDARY,
}

@Entity()
export class Institution {
    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    email: string;

    @Column({
        type: 'enum',
        enum: InstitutionType,
        nullable: false,
    })
    type: InstitutionType;

    @Column({ nullable: false })
    capacityPerClass: number;

    @Column({
        type: 'enum',
        enum: EducationStage,
        nullable: false,
    })
    educationalStage: EducationStage;

    @Column({ nullable: false })
    @Length(5)
    token: string;

    @Column({
        type: 'enum',
        enum: InstitutionStatus,
        nullable: false,
        default: InstitutionStatus.ACTIVE,
    })
    tokenStatus: InstitutionStatus;
}

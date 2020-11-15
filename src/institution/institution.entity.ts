import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Length } from 'class-validator';

export enum Type {
    TECHNOLOGICAL,
    MATHEMATICAL,
    NATURAL_MATHEMATICAL,
    HUMANITARIAN,
    ART,
    LINGUISTICAL,
    SU,
    OU,
}

export enum Status {
    ACTIVE,
    INACTIVE,
}

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

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    email: string;

    @Column({
        type: 'enum',
        enum: Type,
        nullable: false,
    })
    type: Type;

    @Column({ nullable: false })
    capacityPerClass: number;

    @Column({
        type: 'enum',
        enum: EducationStage,
        nullable: false,
    })
    educationalStage: EducationStage;

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

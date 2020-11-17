/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Field,
    InputType,
    registerEnumType,
    ID,
    ObjectType,
} from '@nestjs/graphql';
import { Length } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum InstitutionType {
    TECHNOLOGICAL,
    MATHEMATICAL,
    NATURAL_MATHEMATICAL,
    HUMANITARIAN,
    ART,
    LINGUISTICAL,
    SU,
    OU,
}

export enum InstitutionStatus {
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

registerEnumType(InstitutionType, {
    name: 'InstitutionType',
});

registerEnumType(InstitutionStatus, {
    name: 'InstitutionStatus',
});

registerEnumType(EducationStage, {
    name: 'EducationStage',
});

@ObjectType()
@Entity()
export class Institution {
    @Field()
    @CreateDateColumn()
    public createdAt: Date;

    @Field()
    @UpdateDateColumn()
    public updatedAt: Date;

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    name: string;

    @Field({ nullable: false })
    @Column({ nullable: false })
    email: string;

    @Field(() => InstitutionType, { nullable: false })
    @Column({
        type: 'enum',
        enum: InstitutionType,
        nullable: false,
    })
    type: InstitutionType;

    @Field({ nullable: false })
    @Column({ nullable: false })
    capacityPerClass: number;

    @Field(() => EducationStage, { nullable: false })
    @Column({
        type: 'enum',
        enum: EducationStage,
        nullable: false,
    })
    educationalStage: EducationStage;

    @Field({ nullable: false })
    @Column({ nullable: false })
    @Length(5)
    token: string;

    @Field({ nullable: false })
    @Column({
        type: 'enum',
        enum: InstitutionStatus,
        nullable: false,
        default: InstitutionStatus.ACTIVE,
    })
    tokenStatus: InstitutionStatus;
}

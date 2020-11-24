import { Field, registerEnumType, ID, ObjectType, Int } from '@nestjs/graphql';
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

    @Field()
    @Column({ unique: true })
    name: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Field(() => InstitutionType)
    @Column({
        type: 'enum',
        enum: InstitutionType,
        nullable: false,
    })
    type: InstitutionType;

    @Field(() => Int, { nullable: true })
    @Column('tinyint', { nullable: true })
    capacityPerClass?: number;

    @Field(() => EducationStage)
    @Column({
        type: 'enum',
        enum: EducationStage,
        nullable: false,
    })
    educationalStage: EducationStage;

    @Field()
    @Column({ unique: true })
    @Length(5)
    alias: string;
}

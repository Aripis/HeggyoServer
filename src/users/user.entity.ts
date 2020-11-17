import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum Status {
    ACTIVE,
    INACTIVE,
    BLOCKED,
    UNVERIFIED,
}

@Entity()
export class User {
    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    middleName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    userName: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    userRole: string;

    @Column({
        type: 'enum',
        enum: Status,
        nullable: false,
        default: Status.UNVERIFIED,
    })
    status: Status;

    @Column({ nullable: false })
    institutionId: string;

    @Column({ nullable: false })
    registerToken: string;
}

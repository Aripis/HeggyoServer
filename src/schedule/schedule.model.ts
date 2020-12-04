import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Class } from 'src/classes/class.model';
import { Institution } from 'src/institution/institution.model';
import { Subject } from 'src/subjects/subject.model';
import { Teacher } from 'src/teachers/teacher.model';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Schedule {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Int)
    @Column('year')
    startYear: number;

    @Field(() => Int)
    @Column('year')
    endYear: number;

    // FIXME: make time not string
    @Field()
    @Column()
    startTime: string;

    // FIXME: make time not string
    @Field()
    @Column()
    endTime: string;

    @Field(() => [Subject])
    @ManyToMany(
        () => Subject,
        subject => subject.schedule,
        { eager: true },
    )
    @JoinTable({
        name: 'schedule_subject',
        joinColumn: {
            name: 'schedule',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'subject',
            referencedColumnName: 'id',
        },
    })
    subjects: [Subject];

    @Field(() => Class)
    @OneToMany(
        () => Class,
        cls => cls.schedule,
        { eager: true },
    )
    class: Class;

    @Field(() => [Teacher], { nullable: true })
    @ManyToMany(
        () => Teacher,
        teacher => teacher.schedules,
        { eager: true, nullable: true },
    )
    @JoinTable({
        name: 'schedule_teacher',
        joinColumn: {
            name: 'schedule',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'teacher',
            referencedColumnName: 'id',
        },
    })
    teachers?: Teacher[];

    @Field(() => Institution)
    @ManyToOne(() => Institution, { eager: true })
    institution: Institution;
}

import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Institution } from 'src/institution/institution.model';
import { Subject } from 'src/subject/subject.model';
import { Teacher } from 'src/teacher/teacher.model';
import { Class } from 'src/class/class.model';

export enum WeekDays {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday',
}

registerEnumType(WeekDays, {
    name: 'WeekDays',
});

@ObjectType()
@Entity()
@Unique(['institution', 'day', 'subject', 'class', 'startTime', 'endTime'])
export class Schedule {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    startTime: Date;

    @Field()
    @Column()
    endTime: Date;

    @Field(() => WeekDays)
    @Column('enum', { enum: WeekDays })
    day: WeekDays;

    @Field(() => Subject)
    @ManyToOne(
        () => Subject,
        subject => subject.schedules,
        { eager: true },
    )
    subject: Subject;

    @Field(() => Class)
    @ManyToOne(
        () => Class,
        cls => cls.schedules,
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
    @ManyToOne(
        () => Institution,
        institution => institution.schedules,
        { eager: true },
    )
    institution: Institution;

    @Field()
    @Column()
    room: string;
}

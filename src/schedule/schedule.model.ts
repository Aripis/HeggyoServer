import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
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
export class Schedule {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // FIXME: make time not string
    @Field()
    @Column()
    startTime: string;

    // FIXME: make time not string
    @Field()
    @Column()
    endTime: string;

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
}

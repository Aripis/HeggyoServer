import { Field, ID, ObjectType } from '@nestjs/graphql';
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

    // FIXME: make time not string
    @Field()
    @Column()
    startTime: string;

    // FIXME: make time not string
    @Field()
    @Column()
    endTime: string;

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

    @Field(() => [Institution], { nullable: true })
    @OneToMany(
        () => Institution,
        institution => institution.schedules,
        { eager: true, nullable: true },
    )
    institution?: Institution[];
}

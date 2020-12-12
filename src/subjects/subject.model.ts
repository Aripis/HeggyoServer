import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Class } from 'src/classes/class.model';
import { Institution } from 'src/institution/institution.model';
import { Schedule } from 'src/schedule/schedule.model';
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
export class Subject {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Int)
    @Column('year')
    startYear: number;

    @Field(() => Int)
    @Column('year')
    endYear: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field(() => Institution)
    @ManyToOne(
        () => Institution,
        institution => institution.subjects,
        { eager: true },
    )
    institution: Institution;

    @Field(() => [Teacher], { nullable: true })
    @ManyToMany(
        () => Teacher,
        teacher => teacher.subjects,
        { eager: true, nullable: true },
    )
    @JoinTable({
        name: 'teacher_subject',
        joinColumn: {
            name: 'subjects',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'teachers',
            referencedColumnName: 'id',
        },
    })
    teachers?: Teacher[];

    @Field(() => [Schedule])
    @OneToMany(
        () => Schedule,
        schedule => schedule.subject,
    )
    schedules: Schedule[];

    @Field(() => Class)
    @ManyToOne(
        () => Class,
        cls => cls.schedules,
        { nullable: true, eager: true },
    )
    class?: Class;
}

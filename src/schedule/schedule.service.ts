import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { AddScheduleInput } from './schedule-input/add-schedule.input';
import { SchedulePayload } from './schedule-payload/schedule.payload';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { ClassService } from 'src/class/class.service';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { Schedule } from './schedule.model';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly classService: ClassService,
        private readonly teacherService: TeacherService,
        private readonly userService: UserService,

        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
    ) {}

    async add(
        input: AddScheduleInput,
        currUser: User,
    ): Promise<SchedulePayload> {
        const newSchedule = new Schedule();
        const { subjectId, classId, ...data } = input;

        newSchedule.institution = (
            await this.userService.findOne(currUser.id)
        ).institution;

        if (data.teachersIds) {
            const { teachersIds, ...info } = data;
            const teachers = [];

            for (const id of teachersIds) {
                teachers.push(await this.teacherService.findOne(id));
            }

            newSchedule.teachers = teachers;
            Object.assign(newSchedule, info);
        } else {
            Object.assign(newSchedule, data);
        }

        newSchedule.subject = await this.subjectService.findOne(subjectId);
        newSchedule.class = await this.classService.findOne(classId);

        try {
            return new SchedulePayload(
                (await this.scheduleRepository.save(newSchedule)).id,
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-Schedule] This Schedule already exists',
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async findOne(id: string): Promise<Schedule> {
        const schedule = await this.scheduleRepository.findOne(id);

        if (!schedule) {
            throw new NotFoundException(id);
        }

        return schedule;
    }

    async findAll(currUser: User): Promise<Schedule[]> {
        const institution = (await this.userService.findOne(currUser.id))
            .institution;

        return this.scheduleRepository.find({
            where: { institution: institution },
        });
    }

    async findAllByClass(classId: string, currUser: User): Promise<Schedule[]> {
        const institution = (await this.userService.findOne(currUser.id))
            .institution;
        const schedules = await this.scheduleRepository.find({
            where: { institution: institution },
        });

        return schedules.filter(schedule => schedule.class.id === classId);
    }

    async remove(id: string): Promise<SchedulePayload> {
        await this.scheduleRepository.delete(id);
        return new SchedulePayload(id);
    }

    async removeAllByClass(classId: string): Promise<SchedulePayload> {
        const scheduleClass = await this.classService.findOne(classId);

        await this.scheduleRepository.delete({ class: scheduleClass });
        return new SchedulePayload(classId);
    }
}

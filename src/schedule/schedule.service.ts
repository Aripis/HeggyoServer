import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassesService } from 'src/classes/classes.service';
import { SubjectService } from 'src/subjects/subjects.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateScheduleInput } from './schedule-input/create-schedule.input';
import { CreateSchedulePayload } from './schedule-payload/create-schedule.payload';
import { RemoveSchedulePayload } from './schedule-payload/remove-schedule.payload';
import { Schedule } from './schedule.model';

@Injectable()
export class ScheduleService {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly classesService: ClassesService,
        private readonly teacherService: TeachersService,
        private readonly userService: UsersService,

        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
    ) {}

    async create(
        createScheduleInput: CreateScheduleInput,
        currUser: User,
    ): Promise<CreateSchedulePayload> {
        const schedule = new Schedule();
        const { subjectUUID, classUUID, ...data } = createScheduleInput;
        schedule.institution = (
            await this.userService.findOne(currUser.id)
        ).institution;
        if (data.teachersUUIDs) {
            const { teachersUUIDs, ...info } = data;
            const teachers = [];
            for (const uuid of teachersUUIDs) {
                teachers.push(await this.teacherService.findOne(uuid));
            }
            schedule.teachers = teachers;
            Object.assign(schedule, info);
        } else {
            Object.assign(schedule, data);
        }

        schedule.subject = await this.subjectService.findOne(subjectUUID);
        schedule.class = await this.classesService.findOne(classUUID);

        try {
            const schdl = await this.scheduleRepository.save(schedule);

            return new CreateSchedulePayload(schdl.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('This Class already exists');
            }
            throw new InternalServerErrorException(error);
        }
    }

    async findOne(uuid: string): Promise<Schedule> {
        const schedule = await this.scheduleRepository.findOne(uuid);
        if (!schedule) {
            throw new NotFoundException(uuid);
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

    async findAllByClass(
        classUUID: string,
        currUser: User,
    ): Promise<Schedule[]> {
        const institution = (await this.userService.findOne(currUser.id))
            .institution;
        const schedules = await this.scheduleRepository.find({
            where: { institution: institution },
        });
        return schedules.filter(schedule => schedule.class.id === classUUID);
    }

    async remove(uuid: string): Promise<RemoveSchedulePayload> {
        await this.scheduleRepository.delete(uuid);
        return new RemoveSchedulePayload(uuid);
    }

    async removeAllByClass(classUUID: string): Promise<boolean> {
        const scheduleClass = await this.classesService.findOne(classUUID);
        await this.scheduleRepository.delete({ class: scheduleClass });
        return true;
    }
}

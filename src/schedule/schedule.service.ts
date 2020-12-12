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
        scheduleData: CreateScheduleInput,
    ): Promise<CreateSchedulePayload> {
        const schedule = new Schedule();
        const { subjectUUID, classUUID, ...data } = scheduleData;

        if (data.teacherUUIDs) {
            const { teacherUUIDs, ...info } = data;
            const teachers = [];
            for (const uuid of teacherUUIDs) {
                teachers.push(await this.teacherService.findOne(uuid));
            }
            Object.assign(schedule, info);
        } else {
            Object.assign(schedule, data);
        }

        schedule.subject = await this.subjectService.findOne(subjectUUID);

        schedule.class = await this.classesService.findOne(classUUID);
        console.log('----- Schedule: ', schedule);

        try {
            // FIXME: something fails here
            const schdl = await this.scheduleRepository.save(schedule);
            console.log('----- ScheduleReturn: ', schdl);

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
}

import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Message, MessageStatus, MessageType } from './message.model';
import { CreateMessageInput } from './messages-input/create-message.input';
import { User } from 'src/users/user.model';
import { CreateMessagePayload } from './messages-payload/create-message.payload';
import { ClassesService } from 'src/classes/classes.service';

@Injectable()
export class MessageService {
    constructor(
        private readonly userService: UsersService,
        private readonly classesService: ClassesService,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async create(
        createSubjectData: CreateMessageInput,
        currUser: User,
    ): Promise<CreateMessagePayload> {
        const message = new Message();

        message.from = await this.userService.findOne(currUser.id);
        message.type = createSubjectData.type;

        if (createSubjectData.data) {
            message.data = createSubjectData.data;
        }
        if (createSubjectData.toClassUUIDs) {
            const toClasses = [];
            for (const uuid of createSubjectData.toClassUUIDs) {
                toClasses.push(await this.classesService.findOne(uuid));
            }
            message.toClasses = toClasses;
        }
        if (createSubjectData.toUserUUIDs) {
            const toUsers = [];
            for (const uuid of createSubjectData.toUserUUIDs) {
                toUsers.push(await this.userService.findOne(uuid));
            }
            message.toUser = toUsers;
        }
        if (!createSubjectData.toClassUUIDs && !createSubjectData.toUserUUIDs) {
            throw new Error('[Create-Message] No input data for message');
        }

        // TODO: File save
        // if (createSubjectData.file) {
        //     message.filesPath = ['file1Path', 'file2Path'];
        // }

        try {
            const msg = await this.messageRepository.save(message);
            return new CreateMessagePayload(msg.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    'This message already exists: ' + error,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    // async update(
    //     updateSubjectInput: UpdateSubjectInput,
    // ): Promise<UpdateSubjectPayload> {
    //     const { id, ...data } = updateSubjectInput;
    //     if (await this.subjectRepository.findOne(id)) {
    //         let subjectClass: Class;
    //         const subject = await this.subjectRepository.findOne(id);
    //         const { classUUID, teachersUUIDs, ...info } = data;
    //         if (classUUID) {
    //             subjectClass = await this.classesService.findOne(classUUID);
    //             subject.class = subjectClass;
    //         }
    //         if (teachersUUIDs) {
    //             const teachers = [];
    //             for (const uuid of teachersUUIDs) {
    //                 teachers.push(await this.teachersService.findOne(uuid));
    //             }
    //             subject.teachers = teachers;
    //         }

    //         Object.assign(subject, info);
    //         await this.subjectRepository.save(subject);
    //         return new UpdateSubjectPayload(id);
    //     } else {
    //         throw new NotFoundException('[Update-Subject] Subject Not Found.');
    //     }
    // }

    async findAll(currUser: User): Promise<Message[]> {
        const user = await this.userService.findOne(currUser.id);
        return this.messageRepository.find({
            where: { from: user },
        });
    }

    async findOne(uuid: string): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: { id: uuid },
        });
        if (!message) {
            throw new NotFoundException(uuid);
        }
        return message;
    }

    async findByCriteria(
        currUser: User,
        messageType?: MessageType,
        messageStatus?: MessageStatus,
    ): Promise<Message[]> {
        if (!messageType && !messageStatus) {
            return this.findAll(currUser);
        }

        let messages: Message[];
        if (messageType && messageStatus) {
            messages = await this.messageRepository.find({
                where: {
                    from: await this.userService.findOne(currUser.id),
                    type: messageType,
                    status: messageStatus,
                },
            });
        } else if (!messageType) {
            messages = await this.messageRepository.find({
                where: {
                    from: await this.userService.findOne(currUser.id),
                    status: messageStatus,
                },
            });
        } else if (!messageStatus) {
            messages = await this.messageRepository.find({
                where: {
                    from: await this.userService.findOne(currUser.id),
                    type: messageType,
                },
            });
        }

        return messages;
    }

    // async remove(uuid: string): Promise<void> {
    //     await this.subjectRepository.delete(uuid);
    // }
}

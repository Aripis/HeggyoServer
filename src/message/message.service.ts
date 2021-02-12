import {
    InternalServerErrorException,
    NotFoundException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { MessagesByCriteriaInput } from './message-input/messages-by-criteria.input';
import { UpdateMessageInput } from './message-input/update-message.input';
import { AddMessageInput } from './message-input/add-message.input';
import { MessagePayload } from './message-payload/message.payload';
import { SubjectService } from 'src/subject/subject.service';
import { StudentService } from 'src/student/student.service';
import { ClassService } from 'src/class/class.service';
import { Message, MessageType } from './message.model';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';
import { User, UserRole } from 'src/user/user.model';
import { Student } from 'src/student/student.model';
import { FileService } from 'src/file/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/file/file.model';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        private readonly userService: UserService,
        private readonly studentService: StudentService,
        private readonly classService: ClassService,
        private readonly subjectService: SubjectService,
        private readonly fileService: FileService,
        private readonly mailerService: MailerService,

        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async add(input: AddMessageInput, currUser: User): Promise<MessagePayload> {
        const newMessage = new Message();

        newMessage.fromUser = await this.userService.findOne(currUser.id);
        newMessage.messageType = input.messageType;

        const { toClassIds, toUserIds, subjectId, files, ...data } = input;

        Object.assign(newMessage, data);

        if (!toClassIds && !toUserIds) {
            throw new Error('[Create-Message] No data for message');
        }

        if (subjectId) {
            newMessage.subject = await this.subjectService.findOne(subjectId);
        }

        if (toClassIds) {
            const toClasses = [];
            for (const uuid of toClassIds) {
                toClasses.push(await this.classService.findOne(uuid));
            }
            newMessage.toClasses = toClasses;
        }

        if (toUserIds) {
            const toUsers = [];
            for (const uuid of toUserIds) {
                toUsers.push(await this.userService.findOne(uuid));
            }
            newMessage.toUsers = toUsers;
        }

        if (files) {
            const inputFiles = await Promise.all(input.files);

            for (const inputFile of inputFiles) {
                const fileMeta = await this.fileService.uploadCloudFileFromStream(
                    `${currUser.id}/${inputFile.filename}`,
                    inputFile.createReadStream,
                );
                const files = newMessage.files ? [...newMessage.files] : [];
                const messageFile = new File();

                messageFile.filename = inputFile.filename;
                messageFile.cloudFilename = fileMeta.name;

                files.push(messageFile);
                newMessage.files = files;
            }
        }

        const classUserEmails = (
            await this.studentService.findAllForEachClass(
                currUser,
                input.toClassIds,
            )
        ).map((student: Student) => student.user.email);

        const userEmails = [
            ...new Set([
                ...classUserEmails,
                ...newMessage.toUsers.map(user => user.email),
            ]),
        ];

        try {
            const message = await this.messageRepository.save(newMessage);

            await this.mailerService.sendMail({
                bcc: userEmails,
                from: `${newMessage.fromUser.firstName} ${newMessage.fromUser.lastName} [Heggyo] <heggyoapp@gmail.com>`,
                subject:
                    newMessage.messageType === MessageType.MESSAGE
                        ? 'Ново съобщение'
                        : 'Ново задание',
                template: 'message',
                context: {
                    subject: newMessage.subject,
                    data: newMessage.data,
                },
            });

            return new MessagePayload(message.id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    '[Add-Message] This message already exists: ' + error,
                );
            }
            throw new InternalServerErrorException(error);
        }
    }

    async update(
        input: UpdateMessageInput,
        currUser: User,
    ): Promise<MessagePayload> {
        const message = await this.findOne(input.id);
        const newFiles = message.files ? [...message.files] : [];

        if (input.files) {
            const dataFiles = await Promise.all(input.files);

            for (const dataFile of dataFiles) {
                const fileMeta = await this.fileService.uploadCloudFileFromStream(
                    `${currUser.id}/${dataFile.filename}`,
                    dataFile.createReadStream,
                );
                const messageFile = new File();

                messageFile.filename = dataFile.filename;
                messageFile.cloudFilename = fileMeta.name;
                newFiles.push(messageFile);
            }
        }

        message.files = message.files ? newFiles : message.files;

        Object.assign(message, input);
        const { id, ...data } = message;

        try {
            await this.messageRepository.update(id, data);
            return new MessagePayload(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findAll(currUser: User): Promise<Message[]> {
        const user = await this.userService.findOne(currUser.id);
        const allMessages = await this.messageRepository.find();

        if (user.role == UserRole.STUDENT) {
            const student = await this.studentService.findOneByUserId(user.id);

            return allMessages
                .filter(
                    message =>
                        message.toUsers
                            .map((user: User) => user.id)
                            .includes(user.id) ||
                        message.toClasses
                            .map(cls => cls.id)
                            .includes(student.class.id),
                )
                .map(message => {
                    message.files = message.files.map(file =>
                        this.fileService.getCloudFile(file),
                    );

                    return message;
                });
        }

        return allMessages
            .filter(
                message =>
                    message.fromUser.id === user.id ||
                    message.toUsers
                        .map((user: User) => user.id)
                        .includes(user.id),
            )
            .map(message => {
                message.files = message.files.map(file =>
                    this.fileService.getCloudFile(file),
                );

                return message;
            });
    }

    async findOne(id: string): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: { id: id },
        });

        if (!message) {
            throw new NotFoundException(id);
        }
        message.files = message.files.map(file =>
            this.fileService.getCloudFile(file),
        );
        return message;
    }

    async findByCriteria(
        currUser: User,
        input?: MessagesByCriteriaInput,
    ): Promise<Message[]> {
        if (!input.messageType && !input.messageStatus) {
            return this.findAll(currUser);
        }

        let messages: Message[];

        if (input.messageType && input.messageStatus) {
            messages = await this.messageRepository.find({
                where: {
                    fromUser: await this.userService.findOne(currUser.id),
                    messageType: input.messageType,
                    status: input.messageStatus,
                },
            });
        } else if (!input.messageType) {
            messages = await this.messageRepository.find({
                where: {
                    fromUser: await this.userService.findOne(currUser.id),
                    status: input.messageStatus,
                },
            });
        } else if (!input.messageStatus) {
            messages = await this.messageRepository.find({
                where: {
                    fromUser: await this.userService.findOne(currUser.id),
                    messageType: input.messageType,
                },
            });
        }

        return messages.map(message => {
            message.files = message.files.map(file =>
                this.fileService.getCloudFile(file),
            );
            return message;
        });
    }

    async remove(id: string): Promise<MessagePayload> {
        await this.messageRepository.delete(id);
        return new MessagePayload(id);
    }
}

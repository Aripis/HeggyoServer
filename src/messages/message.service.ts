import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
    All,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Message, MessageStatus, MessageType } from './message.model';
import { CreateMessageInput } from './messages-input/create-message.input';
import { UpdateMessageInput } from './messages-input/update-message.input';
import { User, UserRoles } from 'src/users/user.model';
import { CreateMessagePayload } from './messages-payload/create-message.payload';
import { RemoveMessagePayload } from './messages-payload/remove-message.payload';
import { UpdateMessagePayload } from './messages-payload/update-message.payload';
import { ClassesService } from 'src/classes/classes.service';
import { File } from 'src/file/file.model';
import { SubjectService } from 'src/subjects/subjects.service';
import { MailerService } from '@nestjs-modules/mailer';
import { StudentsService } from 'src/students/students.service';
import { FileService } from 'src/file/file.service';

@Injectable()
export class MessageService {
    constructor(
        private readonly userService: UsersService,
        private readonly studentService: StudentsService,
        private readonly classesService: ClassesService,
        private readonly subjectService: SubjectService,
        private readonly fileService: FileService,
        private readonly mailerService: MailerService,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async create(
        createMessageInput: CreateMessageInput,
        currUser: User,
    ): Promise<CreateMessagePayload> {
        const message = new Message();

        message.from = await this.userService.findOne(currUser.id);
        message.type = createMessageInput.type;

        if (createMessageInput.subjectUUID) {
            message.subject = await this.subjectService.findOne(
                createMessageInput.subjectUUID,
            );
        }

        if (createMessageInput.data) {
            message.data = createMessageInput.data;
        }
        if (createMessageInput.toClassUUIDs) {
            const toClasses = [];
            for (const uuid of createMessageInput.toClassUUIDs) {
                toClasses.push(await this.classesService.findOne(uuid));
            }
            message.toClasses = toClasses;
        }
        if (createMessageInput.toUserUUIDs) {
            const toUsers = [];
            for (const uuid of createMessageInput.toUserUUIDs) {
                toUsers.push(await this.userService.findOne(uuid));
            }
            message.toUser = toUsers;
        }
        if (
            !createMessageInput.toClassUUIDs &&
            !createMessageInput.toUserUUIDs
        ) {
            throw new Error('[Create-Message] No input data for message');
        }

        if (createMessageInput.assignmentDueDate) {
            message.assignmentDueDate = createMessageInput.assignmentDueDate;
        }

        if (createMessageInput.assignmentType) {
            message.assignmentType = createMessageInput.assignmentType;
        }

        if (createMessageInput.files) {
            const inputFiles = await Promise.all(createMessageInput.files);
            for (const inputFile of inputFiles) {
                const fileMeta = await this.fileService.uploadCloudFileFromStream(
                    `${currUser.id}/${inputFile.filename}`,
                    inputFile.createReadStream,
                );
                const files = message.files ? [...message.files] : [];
                const messageFile = new File();
                messageFile.filename = inputFile.filename;
                messageFile.cloudFilename = fileMeta.name;
                files.push(messageFile);
                message.files = files;
            }
        }

        const classUserEmails = (
            await this.studentService.findAllForEachClass(
                currUser,
                createMessageInput.toClassUUIDs,
            )
        ).map(student => student.user.email);

        const userEmails = [
            ...new Set([
                ...classUserEmails,
                ...message.toUser.map(user => user.email),
            ]),
        ];

        try {
            const msg = await this.messageRepository.save(message);
            await this.mailerService.sendMail({
                bcc: userEmails,
                from: `${message.from.firstName} ${message.from.lastName} [Heggyo] <heggyoapp@gmail.com>`,
                subject:
                    message.type === MessageType.MESSAGE
                        ? 'Ново съобщение'
                        : 'Ново задание',
                template: 'message',
                context: {
                    subject: message.subject,
                    data: message.data,
                },
            });
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

    async update(
        updateMessageInput: UpdateMessageInput,
        currUser: User,
    ): Promise<UpdateMessagePayload> {
        const message = await this.findOne(updateMessageInput.id);
        const newFiles = message.files ? [...message.files] : [];
        if (updateMessageInput.files) {
            const dataFiles = await Promise.all(updateMessageInput.files);
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
        Object.assign(message, updateMessageInput);
        const { id, ...msgData } = message;
        if (await this.messageRepository.findOne(id)) {
            await this.messageRepository.update(id, msgData);
            return new UpdateMessagePayload(id);
        } else {
            throw new NotFoundException('[Update-Message] Message Not Found.');
        }
    }

    async findAll(currUser: User): Promise<Message[]> {
        const user = await this.userService.findOne(currUser.id);
        const messages = await this.messageRepository.find();

        if (user.userRole == UserRoles.STUDENT) {
            const student = await this.studentService.findOneByUserUUID(
                user.id,
            );
            return messages
                .filter(
                    message =>
                        message.toUser.map(user => user.id).includes(user.id) ||
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

        return messages
            .filter(
                message =>
                    message.from.id == user.id ||
                    message.toUser.map(user => user.id).includes(user.id),
            )
            .map(message => {
                message.files = message.files.map(file =>
                    this.fileService.getCloudFile(file),
                );
                return message;
            });
    }

    async findOne(uuid: string): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: { id: uuid },
        });
        if (!message) {
            throw new NotFoundException(uuid);
        }
        message.files = message.files.map(file =>
            this.fileService.getCloudFile(file),
        );
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

        return messages.map(message => {
            message.files = message.files.map(file =>
                this.fileService.getCloudFile(file),
            );
            return message;
        });
    }

    async remove(uuid: string): Promise<RemoveMessagePayload> {
        await this.messageRepository.delete(uuid);
        return new RemoveMessagePayload(uuid);
    }
}

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
import { UpdateMessageInput } from './messages-input/update-message.input';
import { User } from 'src/users/user.model';
import { CreateMessagePayload } from './messages-payload/create-message.payload';
import { RemoveMessagePayload } from './messages-payload/remove-message.payload';
import { UpdateMessagePayload } from './messages-payload/update-message.payload';
import { ClassesService } from 'src/classes/classes.service';
// import { File } from './file.model';
import { SubjectService } from 'src/subjects/subjects.service';

@Injectable()
export class MessageService {
    constructor(
        private readonly userService: UsersService,
        private readonly classesService: ClassesService,
        private readonly subjectService: SubjectService,
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

        // const file =  new File()
        // file.filesPath = 'PATH'

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

        // TODO: File save
        // if (createMessageInput.file) {
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

    // TODO: File update
    async update(
        updateMessageInput: UpdateMessageInput,
    ): Promise<UpdateMessagePayload> {
        const { id, ...data } = updateMessageInput;
        if (await this.messageRepository.findOne(id)) {
            await this.messageRepository.update(id, data);
            return new UpdateMessagePayload(id);
        } else {
            throw new NotFoundException('[Update-Message] Message Not Found.');
        }
    }

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

    async remove(uuid: string): Promise<RemoveMessagePayload> {
        await this.messageRepository.delete(uuid);
        return new RemoveMessagePayload(uuid);
    }
}

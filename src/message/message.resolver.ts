import { MessagesByCriteriaInput } from './message-input/messages-by-criteria.input';
import { UpdateMessageInput } from './message-input/update-message.input';
import { AddMessageInput } from './message-input/add-message.input';
import { MessagePayload } from './message-payload/message.payload';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { MessageService } from './message.service';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.model';
import { Message } from './message.model';

@Resolver(() => Message)
export class MessageResolver {
    constructor(private readonly messageService: MessageService) {}

    @Query(() => Message)
    @UseGuards(GqlAuthGuard)
    getMessage(@Args('id') id: string): Promise<Message> {
        return this.messageService.findOne(id);
    }

    @Query(() => [Message])
    @UseGuards(GqlAuthGuard)
    getAllMessages(@CurrentUser() currUser: User): Promise<Message[]> {
        return this.messageService.findAll(currUser);
    }

    @Query(() => [Message])
    @UseGuards(GqlAuthGuard)
    getAllMessagesByCriteria(
        @CurrentUser() currUser: User,
        @Args('input') input: MessagesByCriteriaInput,
    ): Promise<Message[]> {
        return this.messageService.findByCriteria(currUser, input);
    }

    @Mutation(() => MessagePayload)
    @UseGuards(GqlAuthGuard)
    addMessage(
        @Args('input') input: AddMessageInput,
        @CurrentUser() currUser: User,
    ): Promise<MessagePayload> {
        return this.messageService.add(input, currUser);
    }

    @Mutation(() => MessagePayload)
    @UseGuards(GqlAuthGuard)
    updateMessage(
        @Args('input') input: UpdateMessageInput,
        @CurrentUser() currUser: User,
    ): Promise<MessagePayload> {
        return this.messageService.update(input, currUser);
    }

    @Mutation(() => MessagePayload)
    @UseGuards(GqlAuthGuard)
    removeMessage(@Args('id') id: string): Promise<MessagePayload> {
        return this.messageService.remove(id);
    }
}

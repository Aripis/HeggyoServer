import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { Message } from './message.model';
import { MessageService } from './message.service';
import { CreateMessageInput } from './messages-input/create-message.input';
import { MessagesByCriteriaInput } from './messages-input/messages-by-criteria.input';
import { UpdateMessageInput } from './messages-input/update-message.input';
import { CreateMessagePayload } from './messages-payload/create-message.payload';
import { RemoveMessagePayload } from './messages-payload/remove-message.payload';
import { UpdateMessagePayload } from './messages-payload/update-message.payload';

@Resolver(() => Message)
export class MessageResolver {
    constructor(private readonly messageService: MessageService) {}

    @Query(() => Message)
    message(@Args('id') uuid: string): Promise<Message> {
        return this.messageService.findOne(uuid);
    }

    @Query(() => [Message])
    @UseGuards(GqlAuthGuard)
    messages(@CurrentUser() currUser: User): Promise<Message[]> {
        return this.messageService.findAll(currUser);
    }

    @Query(() => [Message])
    @UseGuards(GqlAuthGuard)
    messagesByCriteria(
        @CurrentUser() currUser: User,
        @Args('criteria') criteria: MessagesByCriteriaInput,
    ): Promise<Message[]> {
        return this.messageService.findByCriteria(
            currUser,
            criteria.messageType,
            criteria.messageStatus,
        );
    }

    @Mutation(() => CreateMessagePayload)
    @UseGuards(GqlAuthGuard)
    createMessage(
        @Args('createMessageInput') createMessageInput: CreateMessageInput,
        @CurrentUser() currUser: User,
    ): Promise<CreateMessagePayload> {
        return this.messageService.create(createMessageInput, currUser);
    }

    @Mutation(() => RemoveMessagePayload)
    @UseGuards(GqlAuthGuard)
    removeMessage(@Args('id') uuid: string): Promise<RemoveMessagePayload> {
        return this.messageService.remove(uuid);
    }

    @Mutation(() => UpdateMessagePayload)
    updateMessage(
        @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
        @CurrentUser() currUser: User,
    ): Promise<UpdateMessagePayload> {
        return this.messageService.update(updateMessageInput, currUser);
    }
}

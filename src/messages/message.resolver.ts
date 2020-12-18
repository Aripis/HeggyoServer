import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { Message } from './message.model';
import { MessageService } from './message.service';
import { CreateMessageInput } from './messages-input/create-message.input';
import { CreateMessagePayload } from './messages-payload/create-message.payload';

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

    @Mutation(() => CreateMessagePayload)
    @UseGuards(GqlAuthGuard)
    createMessage(
        @Args('createMessageData') message: CreateMessageInput,
        @CurrentUser() currUser: User,
    ): Promise<CreateMessagePayload> {
        return this.messageService.create(message, currUser);
    }

    // @Mutation(() => UpdateMessagePayload)
    // updateMessage(
    //     @Args('parentData') parentData: UpdateMessageInput,
    // ): Promise<UpdateMessagePayload> {
    //     return this.messageService.update(parentData);
    // }
}

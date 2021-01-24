import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateClassInput } from './class-input/create-class.input';
import { Class } from './class.model';
import { ClassesService } from './classes.service';
import { RemoveClassPayload } from './class-payload/remove-class.payload';
import { UpdateClassPayload } from './class-payload/update-class.payload';
import { UpdateClassInput } from './class-input/update-class.input';
import { CreateClassPayload } from './class-payload/create-class.payload';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/user.model';
import { CurrentUser } from 'src/auth/currentuser.decorator';

@Resolver(() => Class)
export class ClassesResolver {
    constructor(private readonly classesService: ClassesService) {}

    // TODO: Add guards

    @Query(() => Class)
    @UseGuards(GqlAuthGuard)
    class(@Args('id') uuid: string): Promise<Class> {
        return this.classesService.findOne(uuid);
    }

    @Query(() => [Class])
    @UseGuards(GqlAuthGuard)
    classes(@CurrentUser() currUser: User): Promise<Class[]> {
        return this.classesService.findAll(currUser);
    }

    @Mutation(() => CreateClassPayload)
    @UseGuards(GqlAuthGuard)
    addClass(
        @Args('createClassInput') createClassInput: CreateClassInput,
        @CurrentUser() currUser: User,
    ): Promise<CreateClassPayload> {
        return this.classesService.create(createClassInput, currUser);
    }

    @Mutation(() => UpdateClassPayload)
    @UseGuards(GqlAuthGuard)
    updateClass(
        @Args('updateClassInput') updateClassInput: UpdateClassInput,
    ): Promise<UpdateClassPayload> {
        return this.classesService.update(updateClassInput);
    }

    @Mutation(() => RemoveClassPayload)
    @UseGuards(GqlAuthGuard)
    removeClass(@Args('id') uuid: string): Promise<RemoveClassPayload> {
        return this.classesService.remove(uuid);
    }
}

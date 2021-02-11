import { AddClassInput } from './class-input/add-class.input';
import { UpdateClassInput } from './class-input/update-class.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { ClassPayload } from './class-payload/class.payload';
import { ClassService } from './class.service';
import { User } from 'src/user/user.model';
import { UseGuards } from '@nestjs/common';
import { Class } from './class.model';

@Resolver(() => Class)
export class ClassResolver {
    constructor(private readonly classService: ClassService) {}

    @Query(() => Class)
    @UseGuards(GqlAuthGuard)
    getClass(@Args('id') id: string): Promise<Class> {
        return this.classService.findOne(id);
    }

    @Query(() => [Class])
    @UseGuards(GqlAuthGuard)
    getAllClasses(@CurrentUser() currUser: User): Promise<Class[]> {
        return this.classService.findAll(currUser);
    }

    @Mutation(() => ClassPayload)
    @UseGuards(GqlAuthGuard)
    addClass(
        @Args('input') input: AddClassInput,
        @CurrentUser() currUser: User,
    ): Promise<ClassPayload> {
        return this.classService.add(input, currUser);
    }

    @Mutation(() => ClassPayload)
    @UseGuards(GqlAuthGuard)
    updateClass(@Args('input') input: UpdateClassInput): Promise<ClassPayload> {
        return this.classService.update(input);
    }

    @Mutation(() => ClassPayload)
    @UseGuards(GqlAuthGuard)
    removeClass(@Args('id') id: string): Promise<ClassPayload> {
        return this.classService.remove(id);
    }
}

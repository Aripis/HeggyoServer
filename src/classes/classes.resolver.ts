import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateClassInput } from './class-input/create-class.input';
import { Class } from './class.model';
import { ClassesService } from './classes.service';
import { RemoveClassPayload } from './class-payload/remove-class.payload';
import { UpdateClassPayload } from './class-payload/update-class.payload';
import { UpdateClassInput } from './class-input/update-class.input';
import { CreateClassPayload } from './class-payload/create-class.payload';

@Resolver(() => Class)
export class ClassesResolver {
    constructor(private readonly classesService: ClassesService) {}

    // TODO: Add guards

    @Query(() => Class)
    async class(@Args('id') uuid: string): Promise<Class> {
        return await this.classesService.findOne(uuid);
    }

    @Query(() => Class)
    async classes(): Promise<Class[]> {
        return await this.classesService.findAll();
    }

    @Mutation(() => CreateClassPayload)
    addClass(
        @Args('createClassInput') createClassInput: CreateClassInput,
    ): Promise<CreateClassPayload> {
        return this.classesService.create(createClassInput);
    }

    @Mutation(() => UpdateClassPayload)
    updatreClass(
        @Args('updateClassInput') updateClassInput: UpdateClassInput,
    ): Promise<UpdateClassPayload> {
        return this.classesService.update(updateClassInput);
    }

    @Mutation(() => RemoveClassPayload)
    removeClass(@Args('id') uuid: string): Promise<RemoveClassPayload> {
        return this.classesService.remove(uuid);
    }
}

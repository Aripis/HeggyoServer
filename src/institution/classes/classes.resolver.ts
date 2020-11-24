import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClassInput } from './class.input';
import { Class } from './class.model';
import { ClassesService } from './classes.service';

@Resolver(() => Class)
export class ClassesResolver {
    constructor(private readonly classesService: ClassesService) {}

    @Query(() => Class)
    async class(@Args('id') uuid: string): Promise<Class> {
        return await this.classesService.findOne(uuid);
    }

    @Mutation(() => Class)
    async addClass(@Args('classData') classData: ClassInput): Promise<Class> {
        return await this.classesService.create(classData);
    }

    @Mutation(() => Boolean)
    removeClass(@Args('id') uuid: string): Promise<void> {
        return this.classesService.remove(uuid);
    }
}

import { UpdateInstitutionInput } from './institution-input/update-institution.input';
import { AddInstitutionInput } from './institution-input/add-institution.input';
import { InstitutionPayload } from './institution-payload/institution.payload';
import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { InstitutionService } from './institution.service';
import { Institution } from './institution.model';
import { User } from 'src/user/user.model';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class InstitutionResolver {
    constructor(private readonly institutionService: InstitutionService) {}

    @Query(() => Institution)
    @UseGuards(GqlAuthGuard)
    getInstitution(@CurrentUser() currUser: User): Promise<Institution> {
        return this.institutionService.findOne(currUser);
    }

    @Mutation(() => InstitutionPayload)
    addInstitution(
        @Args('input') input: AddInstitutionInput,
    ): Promise<InstitutionPayload> {
        return this.institutionService.add(input);
    }

    @Mutation(() => InstitutionPayload)
    @UseGuards(GqlAuthGuard)
    updateInstitution(
        @Args('input') input: UpdateInstitutionInput,
    ): Promise<InstitutionPayload> {
        return this.institutionService.update(input);
    }

    @Mutation(() => InstitutionPayload)
    @UseGuards(GqlAuthGuard)
    removeInstitution(
        @CurrentUser() currUser: User,
    ): Promise<InstitutionPayload> {
        return this.institutionService.remove(currUser);
    }
}

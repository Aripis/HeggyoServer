import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionInput } from './institution-input/create-institution.input';
import { Institution } from './institution.model';
import { UpdateInstitutionPayload } from './institution-payload/update-institution.payload';
import { UpdateInstitutionInput } from './institution-input/update-institution.input';
import { RemoveInstitutionPayload } from './institution-payload/remove-institution.payload';
import { CreateInstitutionPayload } from './institution-payload/create-institution.payload';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/currentuser.decorator';
import { User } from 'src/users/user.model';

@Resolver()
export class InstitutionsResolver {
    constructor(private readonly institutionsService: InstitutionsService) {}

    @Query(() => Institution)
    @UseGuards(GqlAuthGuard)
    institution(@CurrentUser() user: User): Promise<Institution> {
        return this.institutionsService.findOne(user);
    }

    @Query(() => [Institution])
    @UseGuards(GqlAuthGuard)
    institutions(/*FIXME: shouldn't be able to get other institutions. ONlY system can*/): Promise<
        Institution[]
    > {
        return this.institutionsService.findAll();
    }

    @Mutation(() => CreateInstitutionPayload)
    addInstitution(
        @Args('createInstitutionInput')
        createInstitutionInput: CreateInstitutionInput,
    ): Promise<CreateInstitutionPayload> {
        return this.institutionsService.create(createInstitutionInput);
    }

    // TODO: shouldn't be able to remove it so easily
    @Mutation(() => RemoveInstitutionPayload)
    @UseGuards(GqlAuthGuard)
    removeInstitution(
        @CurrentUser() currUser: User,
    ): Promise<RemoveInstitutionPayload> {
        return this.institutionsService.remove(currUser);
    }

    @Mutation(() => UpdateInstitutionPayload)
    @UseGuards(GqlAuthGuard)
    updateInstitution(
        @Args('updateInstitutionInput')
        updateInstitutionInput: UpdateInstitutionInput,
    ): Promise<UpdateInstitutionPayload> {
        return this.institutionsService.update(updateInstitutionInput);
    }
}

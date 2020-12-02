import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionInput } from './institution-input/create-institution.input';
import { Institution } from './institution.model';
import { UpdateInstitutionPayload } from './institution-payload/update-institution.payload';
import { UpdateInstitutionInput } from './institution-input/update-institution.input';
import { RemoveInstitutionPayload } from './institution-payload/remove-institution.payload';
import { CreateInstitutionPayload } from './institution-payload/create-institution.payload';

@Resolver()
export class InstitutionsResolver {
    constructor(private readonly institutionsService: InstitutionsService) {}

    @Query(() => Institution)
    institution(@Args('id') uuid: string): Promise<Institution> {
        return this.institutionsService.findOne(uuid);
    }

    @Query(() => [Institution])
    institutions(): Promise<Institution[]> {
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
    removeInstitution(
        @Args('id') uuid: string,
    ): Promise<RemoveInstitutionPayload> {
        return this.institutionsService.remove(uuid);
    }

    @Mutation(() => UpdateInstitutionPayload)
    updateInstitution(
        @Args('updateInstitutionInput')
        updateInstitutionInput: UpdateInstitutionInput,
    ): Promise<UpdateInstitutionPayload> {
        return this.institutionsService.update(updateInstitutionInput);
    }
}

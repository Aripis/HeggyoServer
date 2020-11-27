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
    async institutionById(@Args('id') uuid: string): Promise<Institution> {
        const institution = await this.institutionsService.findOne(uuid);
        return institution;
    }

    @Query(() => Institution)
    async institutionByEmail(
        @Args('email') email: string,
    ): Promise<Institution> {
        const institution = await this.institutionsService.findOne(email);
        return institution;
    }

    @Query(() => String)
    async institutionAlias(@Args('id') uuid: string): Promise<string> {
        const institutionToken = await this.institutionsService.findOne(uuid);
        return institutionToken.alias;
    }

    @Query(() => [Institution])
    async institutions(): Promise<Institution[]> {
        const institutions = await this.institutionsService.findAll();
        return institutions.map(institution => {
            return institution;
        });
    }

    @Mutation(() => CreateInstitutionPayload)
    async addInstitution(
        @Args('newInstitutionData') newInstitutionData: CreateInstitutionInput,
    ): Promise<CreateInstitutionPayload> {
        return this.institutionsService.create(newInstitutionData);
    }

    // TODO: shouldn't be able to remove it so easily
    @Mutation(() => RemoveInstitutionPayload)
    async removeInstitution(
        @Args('id') uuid: string,
    ): Promise<RemoveInstitutionPayload> {
        return this.institutionsService.remove(uuid);
    }

    @Mutation(() => UpdateInstitutionPayload)
    async updateInstitution(
        @Args('institutionData') institutionData: UpdateInstitutionInput,
    ): Promise<UpdateInstitutionPayload> {
        return this.institutionsService.update(institutionData);
    }
}

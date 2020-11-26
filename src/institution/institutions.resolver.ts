import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { InstitutionsService } from './institutions.service';
import { InstitutionInput } from './institution.input';
import { Institution } from './institution.model';

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

    // TODO: create for each mutation Payload
    @Mutation(() => Institution)
    async addInstitution(
        @Args('newInstitutionData') newInstitutionData: InstitutionInput,
    ): Promise<Institution> {
        return this.institutionsService.create(newInstitutionData);
    }

    // TODO: create for each mutation Payload
    @Mutation(() => Boolean)
    async removeInstitution(@Args('id') uuid: string) {
        return this.institutionsService.remove(uuid);
    }

    // TODO: create updateInstitution
}

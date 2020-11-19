/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Int, Resolver, Mutation, Query } from '@nestjs/graphql';
import { InstitutionsService } from './institutions.service';
import { InstitutionInput } from './institution.input';
import { Institution } from './institution.model';

@Resolver()
export class InstitutionsResolver {
    constructor(private readonly institutionsService: InstitutionsService) {}

    @Query(returns => Institution)
    async institutionById(@Args('id') uuid: string): Promise<Institution> {
        const institution = await this.institutionsService.findOne(uuid);
        return institution;
    }

    @Query(returns => Institution)
    async institutionByEmail(
        @Args('email') email: string,
    ): Promise<Institution> {
        const institution = await this.institutionsService.findOne(email);
        return institution;
    }

    @Query(returns => String)
    async institutionToken(@Args('id') uuid: string): Promise<string> {
        const institutionToken = await this.institutionsService.findOne(uuid);
        return institutionToken.registerToken;
    }

    @Query(returns => [Institution])
    async institutions(): Promise<Institution[]> {
        const institutions = await this.institutionsService.findAll();
        return institutions.map(institution => {
            return institution;
        });
    }

    @Mutation(returns => Institution)
    async addInstitution(
        @Args('newInstitutionData') newInstitutionData: InstitutionInput,
    ): Promise<Institution> {
        return this.institutionsService.create(newInstitutionData);
    }

    @Mutation(returns => Boolean)
    async removeInstitution(@Args('id') uuid: string) {
        return this.institutionsService.remove(uuid);
    }
}

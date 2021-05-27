import { GraphQLUpload } from 'graphql-tools';
import { Scalar } from '@nestjs/graphql';

@Scalar('Upload')
export class UploadScalar {
    filename: string;
    createReadStream: Function;
    description = 'File upload scalar type';

    parseValue(value) {
        return GraphQLUpload.parseValue(value);
    }

    serialize(value) {
        return GraphQLUpload.serialize(value);
    }

    parseLiteral(ast) {
        return GraphQLUpload.parseLiteral(ast, ast.value);
    }
}

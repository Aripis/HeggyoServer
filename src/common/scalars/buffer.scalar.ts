import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Buffer', () => Buffer)
export class BufferScalar implements CustomScalar<string, Buffer> {
    description = 'Buffer custom scalar type';

    parseValue(value: string): Buffer {
        return new Buffer(value); // value from the client
    }

    serialize(value: Buffer): string {
        return value.toString(); // value sent to the client
    }

    parseLiteral(ast: ValueNode): Buffer {
        if (ast.kind === Kind.STRING) {
            return new Buffer(ast.value);
        }
        return null;
    }
}

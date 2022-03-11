import { registerEnumType } from '@nestjs/graphql';

enum RatingType {
  TEXT = 'TEXT',
  RELATION = 'RELATION'
}

registerEnumType(RatingType, { name: 'RatingType' });

export { RatingType };

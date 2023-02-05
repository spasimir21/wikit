import { registerEnumType } from '@nestjs/graphql';

enum RatingType {
  TEXT = 'TEXT',
  TEXT_DIFFICULTY = 'TEXT_DIFFICULTY',
  RELATION = 'RELATION',
  IMAGE = 'IMAGE'
}

registerEnumType(RatingType, { name: 'RatingType' });

export { RatingType };

import { registerEnumType } from '@nestjs/graphql';

enum CreationType {
  WIKIT = 'WIKIT',
  TEXT = 'TEXT',
  RELATION = 'RELATION'
}

registerEnumType(CreationType, { name: 'CreationType' });

export { CreationType };

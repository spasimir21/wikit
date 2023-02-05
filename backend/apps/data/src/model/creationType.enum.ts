import { registerEnumType } from '@nestjs/graphql';

enum CreationType {
  WIKIT = 'WIKIT',
  TEXT = 'TEXT',
  RELATION = 'RELATION',
  IMAGE = 'IMAGE'
}

registerEnumType(CreationType, { name: 'CreationType' });

export { CreationType };

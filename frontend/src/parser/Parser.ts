import { generateMatchTypes, Grammar, MatchType } from './grammar';
import { match } from './matcher';

class Parser<TKey extends string = string> {
  private readonly matchTypes: Record<TKey, MatchType>;

  constructor(grammar: Grammar<TKey>) {
    this.matchTypes = generateMatchTypes(grammar);
  }

  parse(source: string) {
    return match(source, 0, '_' as TKey, this.matchTypes)[0];
  }
}

export { Parser };

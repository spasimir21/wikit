import { MatchTree } from './MatchTree';

interface SymbolGrammarType {
  match: string;
}

interface BlockGrammarType {
  match: readonly [string, string];
  cancelPairs?: readonly (readonly [string, string])[];
  matchInside?: readonly string[];
}

type GrammarType = SymbolGrammarType | BlockGrammarType;

type Grammar<TKey extends string = string> = Record<TKey, GrammarType>;

interface SymbolMatchType {
  name: string;
  type: 'symbol';
  symbol: string;
}

interface BlockMatchType {
  name: string;
  type: 'block';
  start: string;
  end: string;
  pairs: {
    opening: Set<string>;
    closing: Record<string, string>;
  };
  recursiveMatches: Record<string, string>;
  matchTree: MatchTree;
}

type MatchType = SymbolMatchType | BlockMatchType;

function generateRootMatchType(grammar: Grammar): BlockMatchType {
  const recursiveMatches = Object.fromEntries(
    Object.keys(grammar).map(type => [
      typeof grammar[type].match === 'string' ? grammar[type].match : grammar[type].match[0],
      type
    ])
  );

  const matchTree = new MatchTree();
  for (const start in recursiveMatches) matchTree.addMatchString(start);

  return {
    name: '_',
    type: 'block',
    start: '',
    end: '',
    pairs: { opening: new Set(), closing: {} },
    recursiveMatches,
    matchTree
  };
}

function generateMatchTypes(grammar: Grammar): Record<string, MatchType> {
  const matchTypes: Record<string, MatchType> = {
    _: generateRootMatchType(grammar)
  };

  for (const typeName in grammar) {
    if (typeof grammar[typeName].match === 'string') {
      matchTypes[typeName] = { name: typeName, type: 'symbol', symbol: grammar[typeName].match as string };
      continue;
    }

    const grammarType = grammar[typeName] as BlockGrammarType;
    const matchTree = new MatchTree();

    const matchType: BlockMatchType = {
      name: typeName,
      type: 'block',
      start: grammarType.match[0],
      end: grammarType.match[1],
      pairs: {
        opening: new Set((grammarType.cancelPairs ?? []).map(pair => pair[0])),
        closing: Object.fromEntries((grammarType.cancelPairs ?? []).map(pair => [pair[1], pair[0]]))
      },
      recursiveMatches: Object.fromEntries(
        (grammarType.matchInside ?? []).map(type => [
          typeof grammar[type].match === 'string' ? grammar[type].match : grammar[type].match[0],
          type
        ])
      ),
      matchTree
    };

    matchTree.addMatchString(matchType.end);
    for (const opening of matchType.pairs.opening) matchTree.addMatchString(opening);
    for (const closing in matchType.pairs.closing) matchTree.addMatchString(closing);
    for (const start in matchType.recursiveMatches) matchTree.addMatchString(start);

    matchTypes[typeName] = matchType;
  }

  return matchTypes;
}

export { generateMatchTypes, Grammar, MatchType, BlockMatchType, SymbolMatchType };

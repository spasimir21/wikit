import { BlockMatchType, MatchType } from './grammar';

interface TextMatch {
  type: 'text';
  content: {
    raw: string;
    cancelled: string;
  };
}

interface RuleMatch<TKey extends string = string> {
  type: TKey;
  content: Match<TKey>[];
}

type Match<TKey extends string = string> = TextMatch | RuleMatch<TKey>;

function match<TKey extends string>(
  source: string,
  offset: number,
  typeName: TKey,
  matchTypes: Record<TKey, MatchType>
): [RuleMatch<TKey>, number] {
  if (matchTypes[typeName].type === 'symbol')
    return [
      {
        type: typeName,
        content: []
      },
      offset
    ];

  const result: RuleMatch<TKey> = {
    type: typeName,
    content: []
  };

  const matchType = matchTypes[typeName] as BlockMatchType;
  let currentTextStart = offset;
  const pairs = [] as string[];

  const insertTextMatch = (matchedText: string) => {
    if (currentTextStart != offset - matchedText.length) {
      const raw = source.substring(currentTextStart, offset - matchedText.length);

      result.content.push({
        type: 'text',
        content: {
          raw,
          cancelled: raw.replace(/\\(.)/g, '$1')
        }
      });
    }
  };

  while (offset < source.length) {
    if (source.charAt(offset) === '\\') {
      offset += 2;
      continue;
    }

    const matchedText = matchType.matchTree.match(source, offset);

    if (matchedText == null) {
      offset++;
      continue;
    }

    offset += matchedText.length;

    if (matchType.pairs.opening.has(matchedText)) {
      pairs.push(matchedText);
      continue;
    }

    if (pairs.length > 0 && matchType.pairs.closing[matchedText] == pairs[pairs.length - 1]) {
      pairs.pop();
      continue;
    }

    if (matchedText == matchType.end) {
      insertTextMatch(matchedText);
      currentTextStart = offset;
      break;
    }

    if (matchType.recursiveMatches[matchedText] != null) {
      insertTextMatch(matchedText);

      const [recursiveResult, newOffset] = match(source, offset, matchType.recursiveMatches[matchedText] as TKey, matchTypes);
      result.content.push(recursiveResult);
      offset = newOffset;
      currentTextStart = offset;
    }
  }

  insertTextMatch('');

  return [result, offset];
}

export { match, RuleMatch, TextMatch, Match };

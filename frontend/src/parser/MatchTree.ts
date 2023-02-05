const $MATCH = Symbol('$MATCH');

class MatchTree {
  private readonly index: any = {};

  addMatchString(match: string) {
    let branch = this.index;

    for (let i = 0; i < match.length; i++) {
      const char = match.charAt(i);

      if (branch[char] == null) branch[char] = {};
      branch = branch[char];

      if (i == match.length - 1) branch[$MATCH] = match;
    }
  }

  match(string: string, offset: number = 0): string | null {
    let candidateMatch: string | null = null;

    let branch = this.index;
    for (let i = offset; i < string.length; i++) {
      const char = string.charAt(i);

      if (branch[char] == null) break;
      branch = branch[char];

      if (branch[$MATCH] != null) candidateMatch = branch[$MATCH];
    }

    return candidateMatch;
  }
}

export { MatchTree };

import { Parser } from '../parser/Parser';

const markupParser = new Parser({
  citations: {
    match: ['!citations{', '}'],
    cancelPairs: [['{', '}']]
  },
  citationReference: {
    match: ['[', ']'],
    cancelPairs: [['[', ']']]
  },
  link: {
    match: ['#', '#']
  },
  inlineLatex: {
    match: ['$', '$']
  },
  blockLatex: {
    match: ['$$', '$$']
  },
  newLine: {
    match: '==='
  },
  bold: {
    match: ['*', '*'],
    matchInside: ['citationReference', 'link', 'inlineLatex', 'blockLatex', 'newLine', 'bold', 'italic']
  },
  italic: {
    match: ['_', '_'],
    matchInside: ['citationReference', 'link', 'inlineLatex', 'blockLatex', 'newLine', 'bold', 'italic']
  }
} as const);

export { markupParser };

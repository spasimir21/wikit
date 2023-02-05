<script setup lang="ts">
import { Match, RuleMatch, TextMatch } from '../parser/matcher';
import CitationReference from './CitationReference.vue';
import { markupParser } from '../markup/markupParser';
import WikitCitations from './WikitCitations.vue';
import WikitLink from './WikitLink.vue';
import { h, ref, watch } from 'vue';
import LaTeX from './LaTeX.vue';

const props = defineProps({
  textId: { type: String, required: true },
  text: { type: String, required: true },
  citations: { type: Object, required: true }
});

const NODE_TYPES = {
  _: 'p',
  bold: 'b',
  italic: 'i'
};

const parsedText = ref(markupParser.parse(props.text));

const matchToNode: (match: Match) => any = (match: Match) => {
  if (match.type === 'text') return (match as TextMatch).content.cancelled;

  if (match.type === 'newLine') return h('br');
  if ((match as RuleMatch).content.length == 0) return '';

  // prettier-ignore
  switch (match.type) {
    case 'citationReference':
      return h(CitationReference, { textId: props.textId, reference: (match.content[0] as TextMatch).content.cancelled });
    case 'citations':
      return h(WikitCitations, { serializedCitations: (match.content[0] as TextMatch).content.cancelled.trim(), citations: props.citations });
    case 'link':
      return h(WikitLink, { wikitTitle: (match.content[0] as TextMatch).content.cancelled.trim() });
    case 'inlineLatex':
      return h(LaTeX, { formula: `$ ${(match.content[0] as TextMatch).content.raw.trim()} $` });
    case 'blockLatex':
      return h(LaTeX, { formula: `$$ ${(match.content[0] as TextMatch).content.raw.trim()} $$` });
    default:
      return h(NODE_TYPES[match.type as keyof typeof NODE_TYPES], { class: 'text' }, (match as RuleMatch).content.map(matchToNode));
  }
};

const textNode = () => matchToNode(parsedText.value);

watch(
  () => props.text,
  () => (parsedText.value = markupParser.parse(props.text))
);
</script>

<template>
  <textNode />
</template>

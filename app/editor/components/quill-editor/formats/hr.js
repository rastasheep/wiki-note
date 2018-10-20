import BlockEmbed from 'quill/blots/block';

class HorizontalRule extends BlockEmbed {}
HorizontalRule.blotName = 'divider';
HorizontalRule.tagName = 'hr';

export default HorizontalRule;

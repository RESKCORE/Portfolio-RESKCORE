import SplitType from 'split-type';

export interface SplitTextOptions {
  type?: 'lines' | 'words' | 'chars' | 'lines,words' | 'lines,words,chars' | 'words,chars';
  linesClass?: string;
  wordsClass?: string;
  charsClass?: string;
  mask?: boolean;
}

export class SplitText {
  element: HTMLElement;
  splitInstance: SplitType | null = null;
  lines: HTMLElement[] = [];
  words: HTMLElement[] = [];
  chars: HTMLElement[] = [];
  masks: HTMLElement[] = [];
  private options: SplitTextOptions;
  private isReverted = false;

  constructor(target: HTMLElement | string, options: SplitTextOptions = {}) {
    const el = typeof target === 'string' ? (document.querySelector(target) as HTMLElement) : target;
    if (!el) {
      throw new Error(`SplitText: target element not found.`);
    }

    this.element = el;
    this.options = {
      type: 'words',
      linesClass: 'split-line',
      wordsClass: 'split-word',
      charsClass: 'split-char',
      mask: true,
      ...options,
    };

    this.init();
  }

  private init() {
    const { type, linesClass, wordsClass, charsClass, mask } = this.options;
    const splitTypes = type || 'words';

    this.splitInstance = new SplitType(this.element, {
      types: splitTypes as any,
      lineClass: linesClass,
      wordClass: wordsClass,
      charClass: charsClass,
    });

    this.lines = (this.splitInstance.lines || []) as HTMLElement[];
    this.words = (this.splitInstance.words || []) as HTMLElement[];
    this.chars = (this.splitInstance.chars || []) as HTMLElement[];

    // If mask is enabled, wrap targets in overflow-hidden containers for clean slide-in clipping
    if (mask) {
      if (splitTypes.includes('lines') && this.lines.length > 0) {
        this.lines.forEach((line) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'split-mask-line overflow-hidden block relative';
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);
          this.masks.push(wrapper);
        });
      } else if (splitTypes.includes('words') && this.words.length > 0) {
        this.words.forEach((word) => {
          const wrapper = document.createElement('span');
          wrapper.className = 'split-mask-word inline-block overflow-hidden align-top relative';
          word.parentNode?.insertBefore(wrapper, word);
          wrapper.appendChild(word);
          this.masks.push(wrapper);
        });
      }
    }
  }

  public revert() {
    if (this.isReverted) return;
    this.isReverted = true;

    // Unwrap any mask elements
    this.masks.forEach((wrapper) => {
      const child = wrapper.firstElementChild;
      if (child && wrapper.parentNode) {
        wrapper.parentNode.insertBefore(child, wrapper);
        wrapper.parentNode.removeChild(wrapper);
      }
    });
    this.masks = [];

    if (this.splitInstance) {
      this.splitInstance.revert();
      this.splitInstance = null;
    }
    this.lines = [];
    this.words = [];
    this.chars = [];
  }
}

const STYLES: string[] = ["style-1", "style-2", "style-3"];
console.debug('styles', STYLES);

class Toggler {
  styles: string[];
  currentIndex: number;
  linkElements: HTMLLinkElement[];

  constructor(styles: string[]) {
    this.styles = styles;
    this.currentIndex = 0;
    this.linkElements = [];
    this.init();
  }

  init(): void {
    for (const style of this.styles) {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `./${style}.css`;
      link.disabled = true;
      document.head.appendChild(link);
      this.linkElements.push(link);
    }

    if (this.linkElements.length > 0) {
      this.linkElements[0].disabled = false; // Enable the first style by default
      console.log('Initialized with style:', this.styles[0]);
    }

    this.drawToggler();
  }

  toggle(): void {
    if (this.linkElements.length === 0) return;

    this.linkElements[this.currentIndex].disabled = true;
    this.currentIndex = (this.currentIndex + 1) % this.linkElements.length;
    this.linkElements[this.currentIndex].disabled = false;

    console.log('Toggled to style:', this.styles[this.currentIndex]);
  }

  drawToggler(): void {
  const container = document.createElement('div');
  this.styles.forEach((style, index) => {
    const link = document.createElement('a');
    link.href = '#';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    link.textContent = style;
    link.style.color = 'green';
    link.style.fontSize = '30px';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleTo(index);
    });
    container.appendChild(link);
  });
  document.body.appendChild(container);
}

toggleTo(index: number): void {
  this.linkElements[this.currentIndex].disabled = true;
  this.linkElements[index].disabled = false;
  this.currentIndex = index;
}

}

const toggler: Toggler = new Toggler(STYLES);


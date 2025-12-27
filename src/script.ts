const Styles: Record<string, string> = {
  "style-1": "./style-1.css",
  "style-2": "./style-2.css",
  "style-3": "./style-3.css",
};

class Toggler {
  styles: Record<string, string>;
  currentStyle: string;
  linkElement: HTMLLinkElement;

  constructor(styles: Record<string, string>) {
    this.styles = styles;

    const firstStyle = Object.keys(this.styles)[0];
    this.currentStyle = firstStyle;

    this.linkElement = document.createElement("link");
    this.linkElement.rel = "stylesheet";
    this.linkElement.href = this.styles[firstStyle];
    document.head.appendChild(this.linkElement);

    this.drawToggler();
  }

  applyStyle(styleName: string): void {
    this.linkElement.remove();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = this.styles[styleName];
    document.head.appendChild(link);

    this.linkElement = link;
    this.currentStyle = styleName;
  }

  drawToggler(): void {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.gap = "20px";
    container.style.marginTop = "20px";

    Object.keys(this.styles).forEach((styleName) => {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = styleName;
      link.style.color = "green";
      link.style.fontSize = "30px";
      link.style.cursor = "pointer";

      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.applyStyle(styleName);
      });

      container.appendChild(link);
    });

    document.body.appendChild(container);
  }
}

const toggler = new Toggler(Styles);

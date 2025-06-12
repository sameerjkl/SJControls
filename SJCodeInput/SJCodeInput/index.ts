import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SJCodeInput
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container: HTMLDivElement;
  private htmlCode = "";
  private cssCode = "";
  private jsCode = "";
  private inputData = "";
  private externalLibs = "";

  private outputData: string;
  private jsReturnOutput: string;
  private notifyOutputChanged: () => void;

  constructor() {
    // Empty
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;

    // Initialize container and append to Power Apps-provided DOM
    this.container = document.createElement("div");
    this.container.className = "sj-code-component";
    container.appendChild(this.container); // ✅ Fix: attach to Power Apps DOM
    this.notifyOutputChanged = notifyOutputChanged;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    const newHtml = context.parameters.htmlCode?.raw || "";
    const newCss = context.parameters.cssCode?.raw || "";
    const newJs = context.parameters.jsCode?.raw || "";
    const newInput = context.parameters.inputData?.raw || "";
    const newLibs = context.parameters.externalLibs?.raw || "";

    const inputsChanged =
      newHtml !== this.htmlCode ||
      newCss !== this.cssCode ||
      newJs !== this.jsCode ||
      newInput !== this.inputData ||
      newLibs !== this.externalLibs;

    if (inputsChanged) {
      this.htmlCode = newHtml;
      this.cssCode = newCss;
      this.jsCode = newJs;
      this.inputData = newInput;
      this.externalLibs = newLibs;

      this.renderDynamicContent();
    }
  }

  private async loadExternalLibraries(): Promise<void> {
    const libs = this.externalLibs
      .split(",")
      .map((lib) => lib.trim())
      .filter((lib) => lib);
    for (const lib of libs) {
      if (lib.endsWith(".css")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = lib;
        document.head.appendChild(link);
      } else {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = lib;
          script.onload = () => resolve(true);
          script.onerror = () => reject(`Failed to load ${lib}`);
          document.body.appendChild(script);
        });
      }
    }
  }

  private async renderDynamicContent(): Promise<void> {
    this.container.innerHTML = "";

    try {
      await this.loadExternalLibraries();
    } catch (e) {
      this.jsReturnOutput = `Library Load Error: ${e}`;
      this.notifyOutputChanged();
      return;
    }

    const style = document.createElement("style");
    style.innerText = this.cssCode;

    const htmlWrapper = document.createElement("div");
    htmlWrapper.innerHTML = this.htmlCode;

    try {
      const scopedAsyncFunction = new Function(
        "inputData",
        `return (async () => { ${this.jsCode} })();`
      );
      const result = await scopedAsyncFunction(this.inputData);
      this.jsReturnOutput = String(result ?? "");
    } catch (e) {
      this.jsReturnOutput = `JS Error: ${e}`;
    }

    this.container.appendChild(style);
    this.container.appendChild(htmlWrapper);

    this.outputData = this.container.innerHTML;
    this.notifyOutputChanged();
  }

  public getOutputs(): IOutputs {
    return {
      outputData: this.outputData,
      jsReturnOutput: this.jsReturnOutput,
    };
  }

  public destroy(): void {
    // Cleanup if necessary
    this.container.innerHTML = "";
  }

  public getVisual(): HTMLElement {
    return this.container;
  }
}

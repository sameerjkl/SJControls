import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SJCodeInput
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container: HTMLDivElement;
  private htmlCode = "";
  private cssCode = "";
  private jsCode = "";
  private inputData = "";

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
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    const newHtml = context.parameters.htmlCode?.raw || "";
    const newCss = context.parameters.cssCode?.raw || "";
    const newJs = context.parameters.jsCode?.raw || "";
    const newInput = context.parameters.inputData?.raw || "";

    const inputsChanged =
      newHtml !== this.htmlCode ||
      newCss !== this.cssCode ||
      newJs !== this.jsCode ||
      newInput !== this.inputData;

    if (inputsChanged) {
      this.htmlCode = newHtml;
      this.cssCode = newCss;
      this.jsCode = newJs;
      this.inputData = newInput;

      this.renderDynamicContent();
    }
  }

  private renderDynamicContent(): void {
    // Clear the container
    this.container.innerHTML = "";

    // Inject CSS
    const style = document.createElement("style");
    style.innerText = this.cssCode;

    // Inject HTML
    const htmlWrapper = document.createElement("div");
    htmlWrapper.innerHTML = this.htmlCode;

    // Append to DOM before executing JS ✅ Important fix
    this.container.appendChild(style);
    this.container.appendChild(htmlWrapper);

    // Run JS after HTML is in DOM
    try {
      const scopedFunction = new Function("inputData", this.jsCode);
      const result = scopedFunction(this.inputData);
      this.jsReturnOutput = String(result ?? "");
    } catch (e) {
      this.jsReturnOutput = `JS Error: ${e}`;
    }

    // Set outputData
    this.outputData = this.container.innerHTML;

    // Notify Power Apps of output change
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

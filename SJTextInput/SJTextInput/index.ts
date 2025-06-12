import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SJTextInput implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private container: HTMLDivElement;
  private inputElement: HTMLInputElement | HTMLTextAreaElement;
  private value: string;
  private notifyOutputChanged: () => void;

  private currentParams = {
    isMultiline: "",
    type: "",
    spellcheck: "",
    maxLength: "",
    pattern: "",
    customCSS: ""
  };

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.container = container;
    this.notifyOutputChanged = notifyOutputChanged;
    this.container.style.display = "flex";
    this.container.style.alignItems = "stretch";
    this.container.style.justifyContent = "stretch";
    this.renderInput(context);
  }

  private renderInput(context: ComponentFramework.Context<IInputs>): void {
    const isMultiline = context.parameters.multiline.raw === "true";
    const type = context.parameters.format?.raw ?? "text";
    const spellcheck = context.parameters.spellcheck.raw === "true";
    const maxLength = context.parameters.maxLength.raw;
    const pattern = context.parameters.pattern.raw;
    const customCSS = context.parameters.customCSS.raw;

    this.currentParams = {
      isMultiline: String(isMultiline),
      type,
      spellcheck: String(spellcheck),
      maxLength: maxLength ?? "",
      pattern: pattern ?? "",
      customCSS: customCSS ?? ""
    };

    if (this.inputElement) {
      this.removeEventListeners();
      this.container.removeChild(this.inputElement);
    }

    this.inputElement = isMultiline ? document.createElement("textarea") : document.createElement("input");

    if (!isMultiline) {
      (this.inputElement as HTMLInputElement).type = type;
    }

    this.inputElement.className = "sj-text-input";
    this.inputElement.value = this.getSanitizedValue(context.parameters.value.raw ?? "");
    this.value = this.inputElement.value;
    this.inputElement.placeholder = context.parameters.placeholder.raw ?? "";
    this.inputElement.spellcheck = spellcheck;

    const disabled = context.mode.isControlDisabled;
    this.inputElement.readOnly = disabled;
    this.inputElement.disabled = disabled;

    if (maxLength !== null && !isNaN(Number(maxLength))) {
      this.inputElement.maxLength = Number(maxLength);
    }

    if (pattern) {
      this.inputElement.setAttribute("pattern", pattern);
    }

    this.inputElement.style.width = "100%";
    this.inputElement.style.height = "100%";
    this.inputElement.style.resize = "none";
    this.inputElement.style.boxSizing = "border-box";

    this.container.appendChild(this.inputElement);
    this.applyCustomCSS(customCSS);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.inputElement.addEventListener("input", this.onInputChange as EventListener);
    this.inputElement.addEventListener("keydown", this.handleKeyDown as EventListener);
    this.inputElement.addEventListener("paste", this.handlePaste as EventListener);
    this.inputElement.addEventListener("blur", this.onBlur as EventListener);
    this.inputElement.addEventListener("focus", this.onFocus as EventListener);
  }

  private removeEventListeners(): void {
    this.inputElement.removeEventListener("input", this.onInputChange as EventListener);
    this.inputElement.removeEventListener("keydown", this.handleKeyDown as EventListener);
    this.inputElement.removeEventListener("paste", this.handlePaste as EventListener);
    this.inputElement.removeEventListener("blur", this.onBlur as EventListener);
    this.inputElement.removeEventListener("focus", this.onFocus as EventListener);
  }
  public refreshData(): void {
    this.value = "";
    if (this.inputElement) {
      this.inputElement.value = "";
    }
    this.notifyOutputChanged();
  }
  

  private handleKeyDown = (e: Event): void => {
    const event = e as KeyboardEvent;
    const regex = this.getCharRegexFromPattern();
    if (!regex || event.key.length > 1) return;

    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  };

  private handlePaste = (e: Event): void => {
    const event = e as ClipboardEvent;
    event.preventDefault();

    const pasted = event.clipboardData?.getData("text") ?? "";
    const regex = this.getCharRegexFromPattern();
    const sanitized = regex ? [...pasted].filter(char => regex.test(char)).join("") : pasted;

    const cursor = this.inputElement.selectionStart ?? this.inputElement.value.length;
    const end = this.inputElement.selectionEnd ?? cursor;

    const newValue =
      this.inputElement.value.substring(0, cursor) +
      sanitized +
      this.inputElement.value.substring(end);

    this.inputElement.value = newValue;
    this.value = newValue;
    this.validatePattern(newValue);
    this.notifyOutputChanged();
  };

  private getCharRegexFromPattern(): RegExp | null {
    const pattern = this.inputElement.getAttribute("pattern");
    if (!pattern) return null;

    try {
      const match = pattern.match(/^\^?(\[.*?\])\*?\$?$/);
      if (!match) return null;
      return new RegExp(match[1]);
    } catch (e) {
      console.warn("Invalid character regex:", pattern);
      return null;
    }
  }

  private onInputChange = (e: Event): void => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const sanitized = this.getSanitizedValue(target.value);
    if (sanitized !== target.value) {
      target.value = sanitized;
    }
    this.value = sanitized;
    this.validatePattern(sanitized);
    this.notifyOutputChanged();
  };

  private getSanitizedValue(value: string): string {
    const regex = this.getCharRegexFromPattern();
    if (!regex) return value;
    return [...value].filter(char => regex.test(char)).join("");
  }

  private validatePattern(value: string): void {
    const pattern = this.inputElement.getAttribute("pattern");
    if (!pattern) return;
    try {
      const regex = new RegExp(`^${pattern}$`);
      const isValid = regex.test(value);
      this.inputElement.style.borderColor = isValid ? "" : "red";
      this.inputElement.setAttribute("aria-invalid", isValid ? "false" : "true");
    } catch (e) {
      console.warn("Pattern validation error:", e);
    }
  }

  private onBlur = (): void => {
    this.validatePattern(this.inputElement.value);
  };

  private onFocus = (): void => {
    console.log("Focused");
  };

  // private applyCustomCSS(cssRaw: string | null): void {
  //   const styleId = "sj-text-input-style";
  //   const oldStyle = document.getElementById(styleId);
  //   if (oldStyle) oldStyle.remove();

  //   const style = document.createElement("style");
  //   style.id = styleId;
  //   style.innerHTML = `
  //     .sj-text-input {
  //       width: 100%;
  //       height: 100%;
  //       box-sizing: border-box;
  //       padding: 8px;
  //       border: 1px solid #ccc;
  //       border-radius: 4px;
  //       font-size: 14px;
  //       transition: border-color 0.2s ease;
  //       ${cssRaw ?? ""}
  //     }

  //     .sj-text-input:hover {
  //       filter: brightness(1.05);
  //       box-shadow: 0 0 5px rgba(0, 120, 212, 0.3);
  //     }

  //     .sj-text-input:focus {
  //       outline: none;
  //       border-color: #005a9e;
  //       box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.2);
  //     }

  //     .sj-text-input:disabled {
  //       background-color: #eee !important;
  //       color: #666 !important;
  //       cursor: not-allowed;
  //     }
  //   `;
  //   document.head.appendChild(style);
  // }

  private applyCustomCSS(cssRaw: string | null): void {
    const styleId = "sj-text-input-style";
    const oldStyle = document.getElementById(styleId);
    if (oldStyle) oldStyle.remove();

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .sj-text-input {
        width: 100%;
        height: 100%;
        padding: 8px;
        
        ${cssRaw ?? ""}
      }    

      .sj-text-input:disabled {
       
              cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }


  public updateView(context: ComponentFramework.Context<IInputs>): void {
    if (this.hasStructuralChange(context)) {
      this.renderInput(context);
      return;
    }

    const newValue = this.getSanitizedValue(context.parameters.value.raw ?? "");
    if (this.inputElement.value !== newValue) {
      this.inputElement.value = newValue;
      this.value = newValue;
    }

    this.inputElement.placeholder = context.parameters.placeholder.raw ?? "";
    const disabled = context.mode.isControlDisabled;
    this.inputElement.readOnly = disabled;
    this.inputElement.disabled = disabled;
    this.inputElement.spellcheck = context.parameters.spellcheck.raw === "true";
  }

  private hasStructuralChange(context: ComponentFramework.Context<IInputs>): boolean {
    return (
      this.currentParams.isMultiline !== String(context.parameters.multiline.raw === "true") ||
      this.currentParams.type !== (context.parameters.format?.raw ?? "text") ||
      this.currentParams.spellcheck !== String(context.parameters.spellcheck.raw === "true") ||
      this.currentParams.maxLength !== (context.parameters.maxLength.raw ?? "") ||
      this.currentParams.pattern !== (context.parameters.pattern.raw ?? "") ||
      this.currentParams.customCSS !== (context.parameters.customCSS.raw ?? "")
    );
  }

  public getOutputs(): IOutputs {
    return {
      value: this.value
    };
  }

  public destroy(): void {
    this.removeEventListeners();
  }
}

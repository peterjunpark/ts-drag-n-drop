import { ProjectComponent } from "../utils/models";
import { Validatable, validate } from "../utils/validator";
import { Autobind } from "../utils/decorators";
import { projectState } from "../utils/state";

export default class ProjectInput extends ProjectComponent<
  HTMLDivElement,
  HTMLFormElement
> {
  titleInput: HTMLInputElement;
  descInput: HTMLTextAreaElement;
  pplInput: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.titleInput = this.element.querySelector("#title") as HTMLInputElement;
    this.descInput = this.element.querySelector(
      "#description"
    ) as HTMLTextAreaElement;
    this.pplInput = this.element.querySelector("#people")! as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.handleSubmit);
  }

  renderContent() {}

  private getUserInput(): [string, string, number] | void {
    const enteredTitle: Validatable = {
      value: this.titleInput.value,
      required: true,
    };
    const enteredDesc: Validatable = {
      value: this.descInput.value,
      required: true,
      minLength: 5,
      maxLength: 500,
    };
    const enteredPpl: Validatable = {
      value: +this.pplInput.value,
      required: true,
      min: 1,
      max: 9,
    };

    if (
      !validate(enteredTitle) ||
      !validate(enteredDesc) ||
      !validate(enteredPpl)
    ) {
      alert("invalid value");
      return;
    }
    return [
      enteredTitle.value as string,
      enteredDesc.value as string,
      enteredPpl.value as number,
    ];
  }

  private clearInputs() {
    this.titleInput.value = "";
    this.descInput.value = "";
    this.pplInput.value = "";
  }

  @Autobind
  private handleSubmit(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, ppl] = userInput;
      projectState.addProject(title, desc, ppl);
      this.clearInputs();
    }
  }
}

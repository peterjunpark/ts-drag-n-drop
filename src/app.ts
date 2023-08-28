import { Validatable, validate, Autobind } from "./utils";

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  sectionEl: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.sectionEl = importedNode.firstElementChild as HTMLElement;
    this.sectionEl.id = `${this.type}-projects`;

    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.sectionEl.querySelector("ul")!.id = listId;
    this.sectionEl.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.sectionEl);
  }
}

class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  formEl: HTMLFormElement;
  titleInput: HTMLInputElement;
  descInput: HTMLTextAreaElement;
  pplInput: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.formEl = importedNode.firstElementChild as HTMLFormElement;
    this.formEl.id = "user-input";

    this.titleInput = this.formEl.querySelector("#title") as HTMLInputElement;
    this.descInput = this.formEl.querySelector(
      "#description"
    ) as HTMLTextAreaElement;
    this.pplInput = this.formEl.querySelector("#people")! as HTMLInputElement;

    this.configure();
    this.attach();
  }

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
      console.log(title, desc, ppl);
      this.clearInputs();
    }
  }

  private configure() {
    this.formEl.addEventListener("submit", this.handleSubmit);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
  }
}

const projectInput = new ProjectInput();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  const { value, required, minLength, maxLength, min, max } = validatableInput;

  if (required) {
    isValid = isValid && !!value.toString().trim().length;
  }

  if (minLength != null && typeof value === "string") {
    isValid = isValid && value.trim().length >= minLength;
  }

  if (maxLength != null && typeof value === "string") {
    isValid = isValid && value.trim().length <= maxLength;
  }

  if (min && typeof value === "number") {
    isValid = isValid && value >= min;
  }

  if (max && typeof value === "number") {
    isValid = isValid && value <= max;
  }
  return isValid;
}

// Method decorator to correctly bind "this" context.
function Autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}

// Manage application state with singleton instance of ProjectState.
class ProjectState {
  private static instance: ProjectState;
  private listeners: any[] = [];
  private projects: unknown[] = [];

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addProject(title: string, desc: string, ppl: number) {
    const newProject = {
      id: Math.random().toString(),
      title,
      desc,
      ppl,
    };

    this.projects.push(newProject);

    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }

  addListener(listener: Function) {
    this.listeners.push(listener);
  }
}

const projectState = ProjectState.getInstance();

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  sectionEl: HTMLElement;
  assignedProjects: any[];

  constructor(private type: "active" | "finished") {
    this.templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(this.templateEl.content, true);
    this.sectionEl = importedNode.firstElementChild as HTMLElement;
    this.sectionEl.id = `${this.type}-projects`;

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });
    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listEl.appendChild(listItem);
    }
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
      projectState.addProject(title, desc, ppl);
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

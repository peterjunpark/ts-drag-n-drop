export enum ProjectStatus {
  Active,
  Finished,
}

export class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public ppl: number,
    public status: ProjectStatus
  ) {}
}

export abstract class ProjectComponent<
  T extends HTMLElement,
  U extends HTMLElement
> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateElId: string,
    hostElId: string,
    insertAtStart: boolean,
    newElId?: string
  ) {
    this.templateEl = document.getElementById(
      templateElId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElId)! as T;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElId) {
      this.element.id = newElId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostEl.insertAdjacentElement(
      `${insertAtStart ? "afterbegin" : "beforeend"}`,
      this.element
    );
  }

  abstract configure(): void;

  abstract renderContent(): void;
}

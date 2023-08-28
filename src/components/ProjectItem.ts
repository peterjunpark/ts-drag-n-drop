import { Project, ProjectComponent } from "../utils/models";
import { Autobind } from "../utils/decorators";
import { Draggable } from "../utils/drag-drop";

export default class ProjectItem
  extends ProjectComponent<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get people() {
    return this.project.ppl === 1 ? "1 person" : `${this.project.ppl} people`;
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(e: DragEvent): void {
    // Attach data to the drag event
    e.dataTransfer!.setData("text/plain", this.project.id);
    // Change mouse cursor
    e.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_e: DragEvent): void {
    console.log("dragend");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("p")!.textContent = this.project.desc;
    this.element.querySelector("h3")!.textContent =
      this.people.toString() + " assigned";
  }
}

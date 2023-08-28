import { Project, ProjectStatus } from "./models";

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

// Manage application state with singleton instance of ProjectState.
export class ProjectState extends State<Project> {
  private static instance: ProjectState;
  private projects: Project[] = [];

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => project.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  addProject(title: string, desc: string, ppl: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      ppl,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    this.updateListeners();
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      listener(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();

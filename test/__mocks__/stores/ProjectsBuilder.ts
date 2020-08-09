import { Project } from "~/types";

const mockProjects: Project[] = [
  { projectId: "201108010001", name: "総務（営業）" },
  { projectId: "201203010001", name: "社内教育（一般）" }
];

class ProjectsBuilder {
  public static build(props?: Project[]) {
    return ProjectsBuilder.of(props).build();
  }

  public static of(props?: Project[]): ProjectsBuilder {
    return new ProjectsBuilder(props);
  }

  private static _defaultProps: Project[] = [];

  private props: Project[];

  constructor(props: Project[] = []) {
    this.props = [...ProjectsBuilder._defaultProps, ...props];
  }

  public with1Project() {
    this.props = mockProjects.slice(0, 1);
    return this;
  }

  public with2Projects() {
    this.props = mockProjects.slice(0, 2);
    return this;
  }

  public build(): Project[] {
    return this.props;
  }
}

export { ProjectsBuilder };
export default ProjectsBuilder;

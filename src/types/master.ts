export type Project = {
  projectId: string,
  name: string,
}

export type Usage = {
  usageId: string,
  name: string,
}

export type Objective = {
  objectiveId: string,
  name: string,
}

export type Master = {
  projects: Project[],
  usages: Usage[],
  objectives: Objective[],
}

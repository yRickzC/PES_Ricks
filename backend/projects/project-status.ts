export const projectStatuses = [
  "IDEA",
  "RESEARCH",
  "PROTOTYPE",
  "BUILDING",
  "ACTIVE",
  "SHIPPED",
  "ARCHIVED",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export function isProjectStatus(value: string): value is ProjectStatus {
  return (projectStatuses as readonly string[]).includes(value);
}

export function getNextProjectStatus(
  status: ProjectStatus,
): ProjectStatus | undefined {
  const currentIndex = projectStatuses.indexOf(status);
  return projectStatuses[currentIndex + 1];
}
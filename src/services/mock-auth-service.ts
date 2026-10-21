export type DemoUser = {
  name: string;
  initials: string;
  role: string;
};

export async function signInToDemoWorkspace(): Promise<DemoUser> {
  return {
    name: "Nadeesha P.",
    initials: "NP",
    role: "Planner",
  };
}
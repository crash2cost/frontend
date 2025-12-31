export interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

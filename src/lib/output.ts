export type Link = { href: string; label: string; class?: string; newTab?: boolean };

export type Styled = { text: string; class?: string };
export type Segment = string | Link | Styled;

export type Output = string | Segment[];

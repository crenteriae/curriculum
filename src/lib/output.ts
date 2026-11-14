export type Link = { href: string; label: string; class?: string; newTab?: boolean };

export type Segment = string | Link;

export type Output = string | Segment[];

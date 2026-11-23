import { isTodo } from "@/data/content";

export interface FoundTodo {
  path: string;
  todo: string;
}

/** Walks any content object and returns every todo() marker with where it lives. */
export function collectTodos(value: unknown, path = ""): FoundTodo[] {
  if (isTodo(value)) return [{ path, todo: value.todo }];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => {
      const label =
        item && typeof item === "object" && "slug" in item ? String(item.slug) : String(i);
      return collectTodos(item, `${path}[${label}]`);
    });
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, v]) =>
      collectTodos(v, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

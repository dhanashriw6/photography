// Dependency-free `cn` (class name joiner).
//
// The original used clsx + tailwind-merge. This lightweight version flattens
// arrays/objects/strings the same way clsx does, which is all the landing
// components rely on. If you later need Tailwind conflict de-duplication,
// install `clsx` + `tailwind-merge` and restore the original two-line version.
function toVal(mix) {
  let str = "";
  if (typeof mix === "string" || typeof mix === "number") {
    str += mix;
  } else if (typeof mix === "object" && mix !== null) {
    if (Array.isArray(mix)) {
      for (const item of mix) {
        const inner = toVal(item);
        if (inner) str += (str && " ") + inner;
      }
    } else {
      for (const key in mix) {
        if (mix[key]) str += (str && " ") + key;
      }
    }
  }
  return str;
}

export function cn(...inputs) {
  let str = "";
  for (const arg of inputs) {
    const inner = toVal(arg);
    if (inner) str += (str && " ") + inner;
  }
  return str;
}

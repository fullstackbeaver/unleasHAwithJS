export function convertFromSnakeCaseToCamelCase(value: string): string {
  return value.replace(/([-_][a-z])/gi, (match) => {
    return match.toUpperCase().replace(/[-_]/, "");
  });
}

export function convertToSnakeCase(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "_")
    .toLowerCase();
}

export function convertToCamelCase(value: string): string {
  return value
    .split(/[- ]+/)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

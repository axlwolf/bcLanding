// Utility to extract Handlebars variables from a template string
// Usage: extractHandlebarsVariables(templateString)

export function extractHandlebarsVariables(template: string): string[] {
  // This regex matches {{variable}}, {{#if variable}}, {{#each variable}}, etc.
  // It avoids helpers like {{#if ...}}, {{/if}}, {{else}}, and block params
  const regex = /{{[#/^]?\s*([a-zA-Z0-9_]+)\b/g
  const matches = Array.from(template.matchAll(regex))
  // Only unique variable names
  const vars = Array.from(new Set(matches.map((m) => m[1])))
  // Filter out common helpers
  return vars.filter((v) => !['if', 'each', 'with', 'unless', 'else'].includes(v))
}

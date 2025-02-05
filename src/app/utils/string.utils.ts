import { load } from 'js-yaml';

export function prettifyJson(value: string) {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function compressJson(value: string) {
  return JSON.stringify(JSON.parse(value));
}

export function isValidJson(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidYaml(value: string) {
  try {
    load(value);
    return true;
  } catch {
    return false;
  }
}

export function isJson(value: string): boolean {
  value = value.trim();
  return value.startsWith('{') && value.endsWith('}') || value.startsWith('[') && value.endsWith(']');
}

export function isYaml(value: string): boolean {
  return /:\s*[^:]+/.test(value) && !isJson(value);
}

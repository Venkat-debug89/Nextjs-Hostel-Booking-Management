export const STORAGE_KEYS = {
  data: "hostelhub-data-v1",
  session: "hostelhub-session-v1",
};

export function readStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from browser storage.`, error);
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save ${key} to browser storage.`, error);
  }
}

export function clearStorage(key) {
  if (typeof window !== "undefined") window.localStorage.removeItem(key);
}
// Type Definitions
export interface mathDictEntry {
  equation: string;   // index 0
  factored: string;   // index 1
  solutions: string[]; // index 2
  points: string;     // index 3 ("1","2","3")
}

export type DifficultyLevel = "easy" | "medium" | "hard";

// Browser-safe: loads from public/mathDictionary.txt via fetch
export async function readMathDictionary(): Promise<string[]> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}mathDictionary.txt`);
    if (!response.ok) {
      console.error(
        "Failed to load mathDictionary.txt:",
        response.status,
        response.statusText
      );
      return [];
    }

    const text = await response.text();
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines;
  } catch (err) {
    console.error("Error reading mathDictionary via fetch:", err);
    return [];
  }
}

/*
Parses a line: "x² - 7x + 10 | (x - 2)(x - 5) | 2, 5 | 1"
→ [equation, factored, solutionsArray, points]
*/
export function entryParseLine(
  line: string
): [string, string, string[], string] | [string] {
  const dictionaryEntry = line.split("|").map((part) => part.trim());

  if (dictionaryEntry.length !== 4) {
    return ["Error: Invalid dictionary entry format."];
  }

  const [equation, factored, solutions, points] = dictionaryEntry;
  const solutionsArray: string[] = solutions
    .split(",")
    .map((sol) => sol.trim());

  return [equation, factored, solutionsArray, points];
}

// Formatting methods
export function getEquationFromEntry(entry: mathDictEntry): string {
  if (!entry || entry.equation == null) {
    throw new Error("Equation: Invalid dictionary entry provided.");
  }
  if (typeof entry.equation !== "string") {
    throw new Error("Equation must be a string.");
  }
  return entry.equation;
}

export function getFactoredFromEntry(entry: mathDictEntry): string {
  if (!entry || entry.factored == null) {
    throw new Error("Factor: Invalid dictionary entry provided.");
  }
  if (typeof entry.factored !== "string") {
    throw new Error("Factored form must be a string.");
  }
  return entry.factored;
}

export function getSolutionsFromEntry(entry: mathDictEntry): string[] {
  if (!entry || entry.solutions == null) {
    throw new Error("Solutions: Invalid dictionary entry provided.");
  }
  if (!Array.isArray(entry.solutions)) {
    throw new Error("Solutions must be an array.");
  }
  return entry.solutions;
}

/*
Points per question: "1" easy, "2" medium, "3" hard
*/
export function pointPerQuestion(entry: mathDictEntry): string {
  if (!entry || entry.points == null) {
    throw new Error("Points: Invalid dictionary entry provided.");
  }
  if (typeof entry.points !== "string") {
    throw new Error("Points must be a string.");
  }
  return entry.points;
}

/*
Get difficulty label from entry.points
*/
export function getDifficultyFromEntry(entry: mathDictEntry): DifficultyLevel {
  const points = pointPerQuestion(entry);
  switch (points) {
    case "1":
      return "easy";
    case "2":
      return "medium";
    case "3":
      return "hard";
    default:
      // fallback, shouldn't really happen if dictionary is clean
      return "easy";
  }
}

/*
Generate random entry filtered by difficulty
*/
export function generateRandomEntryByDifficulty(
  entries: mathDictEntry[],
  difficulty: DifficultyLevel
): { index: number; entry: mathDictEntry } | null {
  if (entries.length === 0) {
    return null;
  }

  const filtered = entries.filter(
    (entry) => getDifficultyFromEntry(entry) === difficulty
  );

  if (filtered.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const entry = filtered[randomIndex];
  return { index: randomIndex, entry };
}

// Optional feedback helper; you already had this
export function showFeedback(message: string, isCorrect: boolean): string {
  if (isCorrect) {
    return `✅ ${message}`;
  } else {
    return `❌ ${message}`;
  }
}

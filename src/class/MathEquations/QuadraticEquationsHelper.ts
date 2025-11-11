import {
  readMathDictionary,
  generateRandomEntry,
  getEquationFromEntry,
  getFactoredFromEntry,
  getSolutionsFromEntry,
  pointPerQuestion,
  entryParseLine,
  type mathDictEntry,
} from "./dictionaryMethods";

export type QuadraticQuestion = {
  equation: string;
  factored: string;
  solutions: string[];
  points: number;
};

//converts the string to lowercase and removes spaces for comparison
function normalizeFactored(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "");
}

//removes and spaces in the string for comparison
function normalizeSolution(str: string): string {
  return str.trim();
}

export class QuadraticEquationsHelper {
  private entries: mathDictEntry[] = []; //empty until loaded
  private currentQuestion: QuadraticQuestion | null = null;
  private loadedDictionary = false; //will be set to true once the file is loaded 
  

  /*
  Method Name: ensureLoaded
  Description: This method ensures that the math dictionary file is loaded and parsed into entries.
  If the file is already loaded, it does nothing. Otherwise, it reads the file, parses each line into a mathDictEntry object,
  and stores them in the entries array.
  Returns: void
  */
    // 💡 Changed: Added try/catch fallback so the browser doesn’t crash
  async ensureLoaded(): Promise<void> {
    if (this.loadedDictionary) return;

    let lines: string[] = [];

    try {
      // 💡 Try normal Node-style read
      lines = await readMathDictionary();
    } catch (err) {
      // 💡 Fallback for browsers that can’t use fs/promises
      lines = [
        "x² - 7x + 10 | (x - 2)(x - 5) | 2, 5 | 1",
        "x² - 8x + 12 | (x - 2)(x - 6) | 2, 6 | 1",
        "x² - 9x + 8 | (x - 1)(x - 8) | 1, 8 | 2",
      ];
    }

    const parsed: mathDictEntry[] = [];

    for (const line of lines) {
      const parts = entryParseLine(line);
      if (parts.length === 4) {
        const [equation, factored, solutions, points] = parts;
        parsed.push({ equation, factored, solutions, points });
      }
    }

    this.entries = parsed;
    this.loadedDictionary = true;
  }

  // 💡 Same signature, but type matches QuadraticQuestion
  getNextQuestion(): QuadraticQuestion | null {
    if (!this.loadedDictionary || this.entries.length === 0) {
      return null;
    }

    const random = generateRandomEntry(this.entries);
    if (!random) return null;

    const entry = random.entry;

    const equation = getEquationFromEntry(entry);
    const factored = getFactoredFromEntry(entry);
    const solutions = getSolutionsFromEntry(entry).map((s) => s.trim());
    const pointsStr = pointPerQuestion(entry);
    const points = Number(pointsStr) || 1;

    const question: QuadraticQuestion = {
      equation,
      factored,
      solutions,
      points,
    };

    this.currentQuestion = question;
    return question;
  }


///BUG HERE: TO BE FIXED (x-1)(x-2) not accepted as correct answer for x^2-3x+2but (x-2)(x-1) is accepted
  checkFactored(userInput: string): boolean {
    if (!this.currentQuestion) return false;
    const correct = normalizeFactored(this.currentQuestion.factored);
    const given = normalizeFactored(userInput);
    return correct === given;
  }

  /*
  Method name: checkSolutions
  Description: This method checks if the user's input solutions match the correct solutions for the current question.
  It normalizes both the user's input and the correct solutions by trimming spaces and splitting by commas or spaces.
  It then compares the sets of solutions to determine if they match, regardless of order.
  Parameters: userInput - a string containing the user's input solutions, separated by commas or spaces
  Returns: boolean - true if the user's solutions match the correct solutions, false otherwise
  */
  checkSolutions(userInput: string): boolean {
    if (!this.currentQuestion) return false;

    const correctList = this.currentQuestion.solutions.map(normalizeSolution);

    const separators = /[,\s]+/;
    const rawParts = userInput.split(separators);
    const trimmedParts = rawParts.map(part => part.trim());
    const userParts = trimmedParts.filter(part => part !== "");
    
    const EXPECTED_SOLUTIONS = 2;
    if (userParts.length !== EXPECTED_SOLUTIONS) return false;

    const correctSet = new Set(correctList); //makes a set for correct solutions
    for (const part of userParts) {
      if (!correctSet.has(normalizeSolution(part))) {
        return false;
      }
    }

    return true;
  }


}

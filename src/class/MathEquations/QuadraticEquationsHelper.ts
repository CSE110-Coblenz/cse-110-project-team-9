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
  async ensureLoaded(): Promise<void> {
    if (this.loadedDictionary) return;

    let lines: string[] = [];

    try {
      // 💡 Try to load from dictionaryMethods (in Node tests / non-browser)
      lines = await readMathDictionary();
    } catch (err) {
      // 💡 If that throws, we’ll fallback below
      console.warn("readMathDictionary error, will use fallback questions:", err);
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

  ///Iterate through this method to check bug fixes
  checkFactored(userInput: string): boolean {
    if (!this.currentQuestion) return false;

    const correct = normalizeFactored(this.currentQuestion.factored);
    const given = normalizeFactored(userInput);

    // 💡 First, quick exact check (if they match exactly, we're done)
    if (correct === given) return true;

    // 💡 Extract each "(...)" group from both strings
    const correctParts = correct.match(/\(.*?\)/g) || [];
    const givenParts = given.match(/\(.*?\)/g) || [];

    // 💡 If we couldn't parse them, or counts differ, it's wrong
    if (correctParts.length === 0 || correctParts.length !== givenParts.length) {
      return false;
    }

    // 💡 Sort both arrays so order doesn't matter
    correctParts.sort();
    givenParts.sort();

    // 💡 Join and compare
    return correctParts.join("") === givenParts.join("");
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

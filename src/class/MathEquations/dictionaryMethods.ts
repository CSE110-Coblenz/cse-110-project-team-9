//Import statements (if any) go here
//import {readFile} from "fs/promises";
//import {resolve} from "node:path";

//Type Definitions 
export interface mathDictEntry{
    equation: string; //index 0
    factored: string; //index 1
    solutions: string[]; //index 2
    points: string; //index 3
}

//Reads the dictionaryfile and loads 
export async function readMathDictionary(): Promise<string[]> {
  const filePath = resolve("src/class/MathEquations/mathDictionary.txt");
  const data = await readFile(filePath, "utf8");
  const lines = data.split("\n").map(line => line.trim()).filter(Boolean);
  return lines;
}

//Dictionary Functions

/*
Method Name: entryParseLine
Description: This method parses a line from the dictionary file and seperates it into its components: equation, factored form, and solutions. 
It looks for | as a delimiter to identify the different parts of the entry.
Parameters: line - a string representing a single line from the dictionary file
Returns: An array containing the equation, factored form, and solutions as strings
*/
export function entryParseLine(line: string): [string, string, string[], string] | [string] {
    const dictionaryEntry = line.split("|").map(part => part.trim());

    if (dictionaryEntry.length !== 4) {
        return ["Error: Invalid dictionary entry format."];
    }

    const [equation, factored, solutions, points] = dictionaryEntry;
    const solutionsArray: string[] = solutions.split(",").map(sol => sol.trim());

    return [equation, factored, solutionsArray, points];
}

//To add more methods, follow the structure above.

//Formatting Methods

/*
Method Name: getEquationFromEntry
Description: This method retrieves the equation from a math dictionary entry.
Parameters: mathDictEntry - an object representing a math dictionary entry
Returns: The equation string from the dictionary entry.
*/
export function getEquationFromEntry(entry: mathDictEntry): string {
    if(entry == null || entry.equation == null) {
        throw new Error("Equation: Invalid dictionary entry provided.");
    }

    if (typeof entry.equation !== "string") {
        throw new Error("Equation must be a string.");
    }

    const equation = entry.equation;
    return equation;

}

/*
Method Name:getFactoredFromEntry
Description: This method retrieves the factored form from a math dictionary entry.
Parameters: mathDictEntry - an object representing a math dictionary entry
Returns: The factored form string from the dictionary entry.
*/
export function getFactoredFromEntry(entry: mathDictEntry): string {
    if(entry == null || entry.factored == null) {
        throw new Error("Factor: Invalid dictionary entry provided.");
    }

    if (typeof entry.factored !== "string") {
        throw new Error("Factored form must be a string.");
    }

    const factored = entry.factored;
    return factored;

}

/*
Method Name: getSolutionsFromEntry
Description: This method retrieves the solutions from a math dictionary entry.
Parameters: mathDictEntry - an object representing a math dictionary entry
Returns: An array of solution strings from the dictionary entry.
*/
export function getSolutionsFromEntry(entry: mathDictEntry): string[] {
    if(entry == null || entry.solutions == null) {
        throw new Error("Solutions: Invalid dictionary entry provided.");
    }

    if (!Array.isArray(entry.solutions)) {
        throw new Error("Solutions must be an array.");
    }

    return entry.solutions;
}

/*
Method Name: pointPerQuestion
Description: This method calculates the points per question based on the number value provided. 1 is easy, 2 is medium, and 3 is hard.
Prameters: mathDictionationary - last index of each line in the dictornary file
Returns: A number representing the points per question
*/
export function pointPerQuestion(entry: mathDictEntry): string {
    if(entry == null || entry.points == null) {
        throw new Error("Points: Invalid dictionary entry provided.");
    }

    if (typeof entry.points !== "string") {
        throw new Error("Points must be a string.");
    }

    return entry.points;
}

/*
Method Name: genrateRandomEntry
Description: This method generates a random math dictionary entry from a specified dictionary file.
returns: An entry from the dictionary file 
*/
export function generateRandomEntry(entries: mathDictEntry[]): { index: number; entry: mathDictEntry } | null {
    if (entries.length === 0) {
        return null; // No entries available
    }
    const randomIndex = Math.floor(Math.random() * entries.length);
    const randomEntry = { index: randomIndex, entry: entries[randomIndex] };
    return randomEntry;
}

/*
Method Name: getQuestionInformation
Description: This method calls the other formatting methods to retrieve all necessary information from a math dictionary entry.
This method will return the equation, factored form, solutions, and points per question.
Parameters: const randomEntry - an object representing a random math dictionary entry
Returns: An object containing the equation, factored form, solutions, and points per question.
*/
export function getQuestionInformation(randomEntry: { index: number; entry: mathDictEntry }): { equation: string; factored: string; solutions: string[]; points: string } {
    const equation = getEquationFromEntry(randomEntry.entry);
    const factored = getFactoredFromEntry(randomEntry.entry);
    const solutions = getSolutionsFromEntry(randomEntry.entry);
    const points = pointPerQuestion(randomEntry.entry);

    return {
        equation,
        factored,
        solutions,
        points
    };
}
/*
Method Name: showFeedback
Method name: This method takes in the user's answer and displays feedback indicating whether the answer is correct or incorrect.
This compares the user's answer to the correct answer and provides appropriate feedback.
Parameters: the user's answer as a string and a boolean indicating correctness
Returns: a feedback message to be displayed to the user
*/

export function showFeedback(message: string, isCorrect: boolean) {
    if(isCorrect) {
        return `✅ ${message}`;
    } else {
        return `❌ ${message}`;
    }
}
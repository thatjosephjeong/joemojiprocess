import * as readline from "readline";

export async function askForQuestion(query : string) {
    const iterations_string : string = await askQuestion(query);
    const iterations = parseInt(iterations_string);
    return iterations;
}

function askQuestion(query : string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer : Promise<string> = new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    })) 
    return answer
}

const fs = require('fs');
const readline = require('readline');

async function findMissingNumbers(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let xor_all = 0;
    let xor_arr = 0;
    let n = 0;


    for await (const line of rl) {
        //parse to 10 base
        const num = parseInt(line, 10);
        n++;
        xor_all ^= n;
        xor_arr ^= num;
    }

    n += 2;
    //xor last 2 numbers
    xor_all ^= (n - 1) ^ n;

    let xor_missing = xor_all ^ xor_arr;
    let set_bit = xor_missing & ~(xor_missing - 1);

    let A = 0;
    let B = 0;

    for (let i = 1; i <= n; i++) {
        if (i & set_bit) A ^= i;
        else B ^= i;
    }

    const arrStream = fs.createReadStream(filePath);
    const arrRl = readline.createInterface({
        input: arrStream,
        crlfDelay: Infinity
    });

    for await (const line of arrRl) {
        const num = parseInt(line, 10);
        if (num & set_bit) A ^= num;
        else B ^= num;
    }

    return [A, B];
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Provide the file containing the numbers: ", async (filePath) => {
    const missingNumbers = await findMissingNumbers(filePath);
    console.log("Missing numbers are: ", missingNumbers);
    rl.close();
});

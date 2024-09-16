const fs = require('fs');

// Function to convert a number from a given base to base 10 (decimal)
function decodeValue(base, value) {
    try {
        return parseInt(value, base); // Converts the string to an integer based on the given base
    } catch (e) {
        console.error(`Error converting value '${value}' in base ${base}: ${e.message}`);
        return 0;
    }
}

// Function to compute Lagrange Interpolation and extract the constant term
function lagrangeInterpolation(points) {
    const k = points.length;
    let secret = 0.0;

    for (let i = 0; i < k; ++i) {
        const xi = points[i][0];
        const yi = points[i][1];
        let term = yi;

        for (let j = 0; j < k; ++j) {
            if (i !== j) {
                const xj = points[j][0];
                term *= (0 - xj);
                term /= (xi - xj);
            }
        }
        secret += term;
    }

    return secret;
}

// Function to parse the input, decode the values, and calculate the secret
function findSecret(data, k) {
    // Collect the points (x, y)
    const points = [];
    for (const [x, { base, value }] of Object.entries(data)) {
        const y = decodeValue(base, value);
        points.push([parseInt(x), y]);
    }

    // Ensure we only use the first k points for the interpolation
    points.length = k;

    // Calculate the secret using Lagrange Interpolation
    return lagrangeInterpolation(points);
}

// Read JSON file and process the test case
function processTestCase(filename) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const json = JSON.parse(data);
        const { n, k } = json.keys;
        const dataPoints = {};

        for (let i = 1; i <= n; ++i) {
            dataPoints[i] = json[i];
        }

        const secret = findSecret(dataPoints, k);
        console.log(`The secret constant term is: ${secret}`);
    });
}

// Replace 'testcase2.json' with the path to your JSON file
processTestCase('/mnt/data/testcase2.json');


const lkey = process.env.LANGUAGE_KEY;
const lendpoint = process.env.LANGUAGE_ENDPOINT;

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const client = new TextAnalyticsClient(lendpoint, new AzureKeyCredential(lkey));

// const documents = [
//     {
//         text: "The food and service were unacceptable, but the concierge were nice",
//         id: "0",
//         language: "en"
//     },
//     {
//         text:
//             "The rooms were beautiful but dirty. The AC was good and quiet, but the elevator was broken",
//         id: "1",
//         language: "en"
//     },
//     {
//         text: "The breakfast was good, but the toilet was smelly",
//         id: "2",
//         language: "en"
//     },
//     {
//         text: "Loved this hotel - good breakfast - nice shuttle service.",
//         id: "3",
//         language: "en"
//     },
//     {
//         text: "I had a great unobstructed view of the Microsoft campus",
//         id: "4",
//         language: "en"
//     }
// ];

const run = async () => {
    let documents= [
        {
            text: 'I went to the friends house-warming party. There were so many people out there… I did not expect it. Everyone was having fun, talking with each other, but I knew just a few people. I felt lonely, anxious and afraid, I couldn’t speak. Then I started crying and went home. ',
            id: "1",
            language: "en"
        }
    ];
    
    const results = await client.analyzeSentiment(documents, { includeOpinionMining: true });

    printResponse(results);
}

printResponse = (results) => {
    
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log(`- Document ${result.id}`);
        if (!result.error) {
            console.log(`\tOverall Sentiment: ${result.sentiment}`);
            console.log("\tSentiment confidence scores:", result.confidenceScores);
            console.log("\tSentences");
            for (const { sentiment, confidenceScores, opinions, text } of result.sentences) {
                console.log(`\t- Sentence: ${text}`);
                console.log(`\t- Sentence sentiment: ${sentiment}`);
                console.log("\t  Confidence scores:", confidenceScores);
                console.log("\t  Mined opinions");
                for (const { target, assessments } of opinions) {
                    console.log(`\t\t- Target text: ${target.text}`);
                    console.log(`\t\t  Target sentiment: ${target.sentiment}`);
                    console.log("\t\t  Target confidence scores:", target.confidenceScores);
                    console.log("\t\t  Target assessments");
                    for (const { text, sentiment } of assessments) {
                        console.log(`\t\t\t- Text: ${text}`);
                        console.log(`\t\t\t  Sentiment: ${sentiment}`);
                    }
                }
            }
        } else {
            console.error(`\tError: ${result.error}`);
        }
    }
}

run();

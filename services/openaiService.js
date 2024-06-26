const axios = require('axios');
const logger = require('../logger/logger');
require('dotenv').config();

const fetchChatCompletion = async (content) => {
    try {
        const response = await axios.post('https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: content }
            ]
        }, {
            headers: {
                'x-rapidapi-key': process.env.OPENAI_API_KEY,
                'x-rapidapi-host': "chatgpt-best-price.p.rapidapi.com",
                'Content-Type': 'application/json'
            }
        });

        const responseContent = response.data.choices[0].message.content;
        return responseContent;
    } catch (error) {
        logger.error('Error fetching chat completion:', error);
        throw new Error('Error fetching chat completion');
    }
};


const analyzeEmailContent = async (emailSubject) => {
    try {
        console.log(emailSubject);
        const content = `Based on given context: categorize this into "Interested, NotInterested, MoreInfo". if it is important then "Intrested", if it is not important "NotIntrested" , if it is neither then "MoreInfo"  Email subject: ${emailSubject}`;
        const responseContent = await fetchChatCompletion(content);
        const key = extractKeyword(responseContent);
        return key;
    } catch (error) {
        logger.error('Error analyzing email content:', error);
        return;
    }
};

function extractKeyword(responseContent) {
    const keywords = ["Interested", "NotInterested", "MoreInfo"];
    for (const keyword of keywords) {
        if (responseContent.includes(keyword)) {
            return keyword;
        }
    }
    return null; // or return a default value or error message if needed
}


const generateReply = async (emailSubject,receiver) => {
    try {
        const content = `Based on this context: ${emailSubject}, generate a suitable and official reply body of a email, dont mention "Dear " receiver: ${receiver}`;
        const responseContent = await fetchChatCompletion(content);

        // Extract only the email body (excluding subject and signature)
        const startIndex = responseContent.indexOf('Dear');
        const endIndex = responseContent.lastIndexOf('Best regards');
        let emailBody = responseContent.substring(startIndex, endIndex).trim();

        // Remove anything within square brackets []
        emailBody = emailBody.replace(/\[.*?\]/g, '');

        // Trim any leading or trailing whitespace
        emailBody = emailBody.trim();

        return emailBody;
    } catch (error) {
        logger.error('Error generating reply:', error);
        throw new Error('Error generating reply');
    }
};




module.exports = { analyzeEmailContent, generateReply };

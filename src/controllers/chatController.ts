import { Request, Response } from 'express';
import OpenAI from 'openai';

const baseURL = "https://integrate.api.nvidia.com/v1";
const apiKey = process.env.NVIDIA_API_KEY;

export const chatWithMintSense = async (req: Request, res: Response) => {
    const { message } = req.body;

    console.log("---------- CHAT DEBUG ----------");
    console.log("Message received:", message);
    console.log("API Key exists:", !!apiKey);
    console.log("Base URL:", baseURL);

    if (!apiKey) {
        console.error("ERROR: API Key missing");
        return res.status(500).json({ error: 'NVIDIA API Key not configured' });
    }

    const client = new OpenAI({
        baseURL,
        apiKey
    });

    try {
        console.log("Sending request to OpenAI/NVIDIA...");
        const completion = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [{ role: "user", content: message }],
            temperature: 0.7,
            top_p: 1,
            max_tokens: 1024,
            stream: true
        });
        console.log("Request sent. Waiting for stream...");

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('AI Error:', error);
        // If headers haven't been sent, send JSON error. 
        // If streaming started, we might need a different strategy, but mostly it fails before.
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to communicate with AI' });
        } else {
            res.end();
        }
    }
};

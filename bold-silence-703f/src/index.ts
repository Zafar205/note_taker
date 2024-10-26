import OpenAI from 'openai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
	OPENAI_API_KEY: string;
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	"/*",
	cors({
		origin: '*', // Allow requests from your Next.js app
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'], // Add Content-Type to the allowed headers to fix CORS
		allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	}));

app.post('/chatToDocument', async (c) => {
  try {
    const { documentData, question } = await c.req.json();
    
    // Using Cloudflare's AI model
    const response = await c.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        {
          role: 'system',
          content: `You are an assistant helping with document queries. Context: ${documentData}`
        },
        {
          role: 'user',
          content: question
        }
      ]
    });
    return c.json({ message: response });
	
  } catch (error) {
    return c.json({ error: "An error occurred" }, 500);
  }
});

app.post('/translateDocument', async (c) => {
	const { documentData, targetLang } = await c.req.json();

	// Generate a summary of the document
	const summaryResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
	});

	// Translate the summary into another language
	const response = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summaryResponse.summary,
		source_lang: 'english',
		target_lang: targetLang,
	});

	return new Response(JSON.stringify(response))
});

export default app;
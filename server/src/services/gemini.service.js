const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
      this.model = this.client.getGenerativeModel({
        model: this.modelName,
      });
    }
  }

  ensureConfigured() {
    if (!this.groqApiKey && (!this.apiKey || !this.model)) {
      const error = new Error('AI service (Gemini or Groq) is not configured');
      error.statusCode = 500;
      throw error;
    }
  }

  async generateText(prompt, options = {}) {
    this.ensureConfigured();

    if (this.groqApiKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: options.temperature ?? 0.3
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API call failed: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }

    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.4,
        topP: options.topP ?? 0.9,
        topK: options.topK ?? 32,
        maxOutputTokens: options.maxOutputTokens ?? 2048,
      },
    });

    return result.response.text();
  }

  async generateFinanceSummary(payload) {
    this.ensureConfigured();

    const prompt = `
You are a CFO-style financial planning assistant.
Analyze the structured finance data below and produce:
1. Executive summary
2. Key risks
3. Recommendations
4. Scenario comparison
5. Short conclusion

Data:
${JSON.stringify(payload, null, 2)}

Rules:
- Use plain business language.
- Be specific with numbers.
- Do not invent metrics not present in the input.
- If uncertainty exists, say so clearly.
`;

    const text = await this.generateText(prompt, {
      temperature: 0.3,
      maxOutputTokens: 2500,
    });

    return text;
  }

  async answerWhatIfQuestion(context, question) {
    this.ensureConfigured();

    const prompt = `
You are a financial planning assistant.
Use only the context below to answer the user's what-if question.

Context:
${JSON.stringify(context, null, 2)}

Question:
${question}

Instructions:
- Ground the answer only in the given data.
- Mention trade-offs and risks.
- Keep the answer concise but analytical.
`;

    return this.generateText(prompt, {
      temperature: 0.2,
      maxOutputTokens: 1200,
    });
  }
}

module.exports = new GeminiService();
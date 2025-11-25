import { GoogleGenAI, Type } from "@google/genai";
import type { Answers, Question, Recommendation } from '../types';

declare const process: {
  env: {
    API_KEY?: string;
  };
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const MEMBERSHIP_TIERS_CONTEXT = `
Here are the available membership tiers:

**1. Tier: Starter**
- **Price:** $9/month
- **Target Audience:** Beginners who want to "dip their toes in." Perfect for members who want to try out the ecosystem without committing to full resources.
- **Value Proposition:** Low risk, quick wins, and a gentle introduction to AI.
- **Key Features:**
  - Access to 2 live training calls per week.
  - Community discussions and help threads.
  - A simple step-by-step "AI Pathfinder" roadmap.
  - Monthly "Quick Win Challenge" to apply learnings immediately.
  - Replay access for the calls they can attend.
- **Summary:** Lightweight access with limited replays and community threads.

**2. Tier: Growth**
- **Price:** $49/month
- **Target Audience:** The most popular "sweet spot" tier. This is the default recommendation for those ready to apply AI more seriously.
- **Value Proposition:** Balances affordability with strong value. Best value tier with the most access and extras.
- **Key Features:**
  - Unlimited access to ALL daily live calls.
  - Full replay library (12+ months).
  - Exclusive member-only workshops (1-2 per month).
  - 10% discount on add-ons like training intensives.
  - Networking access via small group masterminds and roundtables.
- **Summary:** Full access to content, workshops, and networking. The default go-to.

**3. Tier: Leadership / VIP**
- **Price:** $97/month
- **Target Audience:** The premium "all-in" tier for professionals who want to lead with AI.
- **Value Proposition:** Fast track to insider status and personal connection with leaders. Focus on status and transformation.
- **Key Features:**
  - Everything in Growth, plus:
  - Direct small-group coaching calls weekly.
  - Early access to new content, podcasts, and tools.
  - Monthly advanced resource drops (AI playbooks, advanced templates).
  - Exclusive VIP Lounge for direct networking with leaders.
  - VIP Networking Access for introductions to other executives.
- **Summary:** Premium coaching, advanced resources, early access, and exclusive VIP perks.
`;

export const getAiRecommendation = async (answers: Answers, questions: Question[]): Promise<Recommendation> => {
  const formattedAnswers = questions
    .map(q => {
      const answer = answers[q.id];
      return `Question: ${q.text}\nAnswer: ${answer}`;
    })
    .join('\n\n');

  const prompt = `
    You are an expert career counselor specializing in AI education, and you write in the clear, direct, and empathetic style of Donald Miller from StoryBrand.
    Your task is to analyze a user's survey responses and recommend the most suitable membership tier. You are the guide who can help them win.

    First, carefully review the details of the three available membership tiers, which are the tools you can offer the user:
    ${MEMBERSHIP_TIERS_CONTEXT}

    Next, analyze the user's survey results to understand their problem.

    Finally, based on your analysis, recommend ONE of the three tiers ('Starter', 'Growth', or 'Leadership / VIP').
    Your response must be in the JSON format defined by the schema. It should include the recommended level, its price, and a personalized explanation.

    For the 'explanation' field, follow these StoryBrand principles:
    1. Acknowledge the user's primary challenge or goal based on their survey answers. Speak to their problem directly.
    2. Present the recommended membership as the clear plan that will help them succeed. Connect specific features of the tier to their needs.
    3. Paint a picture of success. Describe what their professional life will look like after they've used the plan.
    4. Keep the language simple and clear. Avoid jargon. Use short sentences and paragraphs.
    5. Use markdown for formatting (e.g., using '\\n' for new paragraphs) and keep it to 2-3 paragraphs.

    Survey Results:
    ${formattedAnswers}
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    level: {
                        type: Type.STRING,
                        description: "The recommended membership level. Must be one of: 'Starter', 'Growth', or 'Leadership / VIP'."
                    },
                    price: {
                        type: Type.STRING,
                        description: "The monthly price of the recommended tier (e.g., '$9/month')."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A detailed, multi-paragraph explanation for the recommendation, formatted with markdown newlines and written in the style of Donald Miller (StoryBrand). It should connect the user's answers to the tier's features and provide an inspiring outlook."
                    }
                },
                required: ["level", "price", "explanation"]
            }
        }
    });

    const jsonText = response.text?.trim() ?? '';
    const result = JSON.parse(jsonText);
    
    // Basic validation to ensure the result matches the Recommendation type
    if (result && typeof result.level === 'string' && typeof result.price === 'string' && typeof result.explanation === 'string') {
        return result as Recommendation;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get recommendation from AI service.");
  }
};

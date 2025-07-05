const Skill_Based_Quiz_Prompt = `
Create a quiz to evaluate a student's knowledge in the following skill(s): {{skills}}.
Generate 10 multiple-choice questions, covering beginner to intermediate concepts.

Each question must include:
- "id": A unique identifier (can be a number or string)
- "question": A clear question string
- "options": An object with keys "A", "B", "C", and "D", each containing a string
- "correctAnswer": One of "A", "B", "C", or "D"
- "explanation": A brief explanation of the correct answer

Respond with **only a JSON array**, inside a Markdown code block.  
**Strictly Do not include any introductory or extra text.**

Example output:

\`\`\`json
[
  {
    "id": "1",
    "question": "What is a closure in JavaScript?",
    "options": {
      "A": "A function without return",
      "B": "A block of code",
      "C": "A function that retains access to its lexical scope",
      "D": "A variable declaration"
    },
    "correctAnswer": "C",
    "explanation": "Closures allow functions to retain access to variables from their scope even after the outer function has returned."
  }
]
\`\`\`
`;

const Analysis_Prompt = `You are an expert educational analyst AI.

A student completed a quiz on the topic: {{skills}}.

Below is the quiz data in JSON format. Each item includes:
- The question text
- A list of answer options
- The correct answer
- The student's selected answer

{{quizData}}

Please perform a detailed analysis of the student's performance. Your analysis should include:

1. **Correct Understanding**: Identify which questions were answered correctly and what concepts or subtopics they demonstrate mastery of.
2. **Misunderstood Concepts**: For incorrect answers, identify the misunderstood concepts or knowledge gaps.
3. **Subtopic Breakdown**: From the analysis, infer which specific subtopics the student is weak in and might need to review.
4. **Learning Recommendations**: Suggest what areas or subtopics the student should focus on to improve.

### Expected Output Format (strict JSON):
{
  "summary": "Brief overview of how the student performed overall.",
  "strongTopics": ["Subtopic 1", "Subtopic 2", ...],
  "weakTopics": ["Subtopic 3", "Subtopic 4", ...],
  "reasoning": "Detailed reasoning for how you determined the student's strengths and weaknesses based on the answers and concepts involved."
}

Only use information that can be inferred from the quiz content. Be as specific and pedagogically helpful as possible.

Please provide a clear and concise analysis, ensuring that the student's performance is accurately represented in the output.

**strictly do not include any introductory or extra text rather than Expected output**
`


const Roadmap_Prompt = `
A student completed a quiz on the topic: {{skills}}.

this was quiz he attempted on that skills :
{{quizData}}

here the analysis :
{{analysisData}}

Create a detailed and personalized learning roadmap to help the user master these skills based data provided, 

Structure your analysis to include:
1. Learning stages (Beginner, Intermediate, Advanced)
2. Topics to cover in each stage
3. Estimated duration for each stage
4. Practical projects or tasks to build hands-on experience
5. High-quality, free learning resources (YouTube videos, blogs, or course links)

Respond with **only a JSON object**, wrapped inside a \`\`\`json code block.

Format:
\`\`\`json
{
  "roadmap": [
    {
      "stage": "Beginner",
      "topics": ["List of beginner topics"],
      "duration": "Estimated time to complete",
      "resources": "Free, high-quality resources" [ {url: link , title: title}, ...],
      "projects": "Simple practice tasks or projects" [ {name: name, description: description}, ...]
    },
    {
      "stage": "Intermediate",
      "topics": ["List of intermediate topics"],
      "duration": "Estimated time to complete",
      "resources": "Free, high-quality resources",[ {url: link , title: title}, ...],
      "projects": "Moderate-level tasks or projects"[ {name: name, description: description}, ...]
    },
    {
      "stage": "Advanced",
      "topics": ["List of advanced topics"],
      "duration": "Estimated time to complete",
      "resources": "Free, high-quality resources",[ {url: link , title: title}, ...],
      "projects": "Challenging real-world projects"[ {name: name, description: description}, ...]
    }
  ]
}
\`\`\`

strictly Do not include any other text or explanation outside the code block.
`;


const generatePrompt = (template, data) => {
    if (template === "skill-based-quiz") {
        const skills = Array.isArray(data.name)
            ? data.name.join(", ")
            : JSON.stringify(data);
        return Skill_Based_Quiz_Prompt.replace("{{skills}}", skills);
    } else if (template === "Analysis") {
        const quizData = JSON.stringify(data[0], null, 2); 
        const skills = Array.isArray(data[1]?.name)
            ? data[1].name.join(", ")
            : JSON.stringify(data[1]);
        
        const prompt = Analysis_Prompt.replace("{{skills}}", skills).replace("{{quizData}}", quizData);
        return prompt;
    } else if (template === "Roadmap") {
        const quizData = JSON.stringify(data[0], null, 2); 
        const analysisData = JSON.stringify(data[1], null, 2); 
        const skills = Array.isArray(data[2]?.name)
            ? data[2].name.join(", ")
            : JSON.stringify(data[2]);
        
        const prompt = Roadmap_Prompt.replace("{{skills}}", skills).replace("{{quizData}}", quizData).replace("{{analysisData}}",analysisData);
        return prompt;
    }
    return null;
}


export { generatePrompt }



export function extractFromAIResponse({ message }) {
  console.log("➡️ Entered extractFromAIResponse");

  const match = message.match(/```json\s*([\s\S]*?)\s*```/);

  if (!match) {
    console.error("❌ Could not find JSON block in AI response.");
    throw new Error("Could not find JSON block in AI response.");
  }

  try {
    const parsed = JSON.parse(match[1].trim());
    console.log("✅ Parsed JSON from AI response successfully");
    return parsed;
  } catch (error) {
    console.error("❌ Failed to parse quiz JSON:", match[1], error);
    throw new Error("Invalid JSON format in AI response.");
  }
}



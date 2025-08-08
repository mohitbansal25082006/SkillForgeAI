// utils/prompts.ts
export const generateRoadmapPrompt = (topic: string, experience: string, goal: string) => `
You are an expert learning path designer. Create a comprehensive 4-week learning roadmap for someone who wants to learn about "${topic}".

User Profile:
- Experience Level: ${experience}
- Learning Goal: ${goal}

Generate a JSON response with the following structure:
{
  "title": "Catchy title for the roadmap",
  "description": "Brief description of what will be learned",
  "weeks": [
    {
      "week": 1,
      "title": "Week 1 Title",
      "description": "Week 1 description",
      "modules": [
        {
          "title": "Module Title",
          "description": "Module description",
          "resources": [
            {
              "type": "video",
              "title": "Resource Title",
              "url": "https://example.com"
            }
          ],
          "project": "Small project idea for this module"
        }
      ]
    }
  ]
}

Each week should have 3-5 modules. For resources, include a mix of:
- YouTube videos (type: "video")
- Articles or documentation (type: "article")
- Interactive tutorials (type: "tutorial")

Make sure the roadmap is:
1. Progressive (builds on previous knowledge)
2. Practical (includes hands-on projects)
3. Comprehensive (covers all essential topics)
4. Tailored to the user's experience level

Return ONLY valid JSON, no additional text or explanations.
`;
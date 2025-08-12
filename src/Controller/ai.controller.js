const Groq = require('groq-sdk');
const { ProjectModel } = require('../models/project.model');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateModule = async (req, res) => {
  try {
    const getProject = await ProjectModel.findById(req.params.projctId);
    if (!getProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const prompt = `
      You are a project manager AI. Read the following project document carefully.
      Then break it into modules and tasks with descriptions, priorities, and estimated hours.
      Respond ONLY in the following JSON format without any extra explanation or text:
      {
        "projectName": "",
        "description": "",
        "modules": [
          {
            "moduleName": "",
            "description": "",
            "tasks": [
              {
                "taskName": "",
                "description": "",
                "priority": "High | Medium | Low",
                "estimatedHours": 0
              }
            ]
          }
        ]
      }

      PROJECT DOCUMENT: ${getProject.description}
      PROJECT NAME: ${getProject.projectName}
    `;

    const chat = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    let responseText = chat.choices[0].message.content;

    // Extract JSON part using regex
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "No valid JSON found in AI response" });
    }

    const structuredData = JSON.parse(jsonMatch[0]);

    console.log("structuredData", structuredData);
    return res.json(structuredData);

  } catch (err) {
    console.error("Error in generateModule:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  generateModule
};

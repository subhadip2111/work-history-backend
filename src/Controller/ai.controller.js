const Groq = require('groq-sdk');
const { ProjectModel } = require('../models/project.model');
const { ProjectTaskModuleModel } = require('../models/prokectTaskModule');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateModule = async (req, res) => {
  try {
    const getProject = await ProjectModel.findById(req.params.projectId);
    if (!getProject) {
      return res.status(404).json({ error: "Project not found" });
    }
const existTaskModule=await ProjectTaskModuleModel.find({projectId:getProject._id}).sort({createdAt:-1})
if(existTaskModule.length>0){
  return res.status(200).json({message:"Module and Task already generated",data:existTaskModule})
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

      PROJECT DESCRIPTION: ${getProject.description}
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
    if (structuredData.modules && structuredData.modules.length > 0) {
      structuredData.modules.forEach(async (module) => {
     await   ProjectTaskModuleModel.create({
          projectId: getProject._id,
            moduleName: module.moduleName,
              description: module.description,
          
            
              tasks: module.tasks.map(task => ({
                taskName: task.taskName,
                description: task.description,
                priority: task.priority,
                estimatedHours: task.estimatedHours
              }))
          
        })
      })


    }
    console.log("structuredData", structuredData);
    return res.json(structuredData);

  } catch (err) {
    console.error("Error in generateModule:", err);
    res.status(500).json({ error: err.message });
  }
};


const getModulesAndTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const projectModules = await ProjectTaskModuleModel.find({ projectId }).sort({createdAt:-1});
    if (!projectModules || projectModules.length === 0) {
      return res.status(404).json({ message: "No modules found for this project" });
    }
   return  res.status(200).json({ data: projectModules });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving modules", error: error.message });
  }
};
module.exports = {
  generateModule,
  getModulesAndTasks
};

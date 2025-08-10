const { ProjectModel } = require("../models/project.model");

const mongoose = require('mongoose');

const addNewProject=async(req, res) => {
  try {
    const projectData = req.body;
    console.log("Project Data:", projectData);
    const newProject = await ProjectModel.create(projectData);
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  } 
}

const getALlProjects = async (req, res) => {
    const createorId=await req.params._id; 
  try {
    const projects = await ProjectModel.find({
        'createdBy': createorId 
    }).sort({ createdAt: -1 }); 
    res.status(200).json({ message: 'Projects retrieved successfully', projects });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving projects', error: error.message });
  }
}


const getMyProjects = async (req, res) => {
  try {
    const userId = req.params.id; // Or from req.user if using auth

    const projects = await ProjectModel.find({
      $or: [
        { "teamAssignments.frontend.memberId": new mongoose.Types.ObjectId(userId) },
        { "teamAssignments.backend.memberId": new mongoose.Types.ObjectId(userId) },
        { "teamAssignments.fullstack.memberId": new mongoose.Types.ObjectId(userId) },
        { "teamAssignments.designer.memberId": new mongoose.Types.ObjectId(userId) },
        { "teamAssignments.qa.memberId": new mongoose.Types.ObjectId(userId) },
        { "teamAssignments.devops.memberId": new mongoose.Types.ObjectId(userId) }
      ]
    });

    res.status(200).json({
      message: "My projects retrieved successfully",
      projects
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving my projects",
      error: error.message
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project retrieved successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving project', error: error.message });
  }
}
module.exports = {
  addNewProject,
  getALlProjects,
  getProjectById,
  getMyProjects
  // Other controller methods can be added here
};
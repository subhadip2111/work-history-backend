    const express = require('express');

const router = express.Router();
const projectController = require('../Controller/projectController');
const userController = require('../Controller/userController');
const userActivityController = require('../Controller/userActivityController');
const aiController=require('../Controller/ai.controller')
// Route to add a new project
router.post('/organization/project', projectController.addNewProject);
 router.get('/organization/:organizationId/projects', projectController.getOrganizationAllProjects);

// Route to get all projects by creator ID
router.get('/projects/:id', projectController.getALlProjects);

// Route to get projects assigned to the logged-in user
 router.get('/my-projects/:id', projectController.getMyProjects);

// Route to get a project by its ID
 router.get('/project/:id', projectController.getProjectById);

// add the user controller routes here


router.post('/register',userController.registerUser )
router.get('/organization/:organizationId/members', userController.getAllMembers);
router.get('/organization/:organizationId/dashboard', userController.getDashBoardData);



router.get('/admin/:token', userController.getAdminInfobyToken);
router.get('/developer/:token', userController.getDeveloperInfo);

router.get('/developer/profile/:id', userController.getDeveloperInfobyId);


// user activity

router.post('/useractivity/:githubId',userActivityController.insertUserActivity );

router.get('/useractivity/:githubId',userActivityController.getUserActivity );

router.post('/generate/task/:projctId',aiController.generateModule)
module.exports = router;    
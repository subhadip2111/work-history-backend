const { ProjectModel } = require('../models/project.model');
const UserModel = require('../models/user.model');

const { Octokit } = require("@octokit/rest");

const registerUser = async (req, res) => {
    try {
        let userData = req.body;
        // firsst check if the user already exists
        const existingUser = await UserModel.findOne({ githubId: userData.id });
        if (existingUser) {
            Object.assign(existingUser, userData);
            await existingUser.save();
            return res.status(200).json({ message: 'User already exists, updated successfully', user: existingUser });

        }
        userData.githubId = userData.id
        if (userData.isOrgAdmin === true) {
            userData.workHistoryRole = 'admin';
        } else {
            userData.workHistoryRole = 'member';
        }

        console.log("User Data after role assignment:", userData);
        const newUser = await UserModel.create(userData);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

const getAllMembers = async (req, res) => {
    const { organizationId } = req.params;

    try {
        const members = await UserModel.find({
            organizations: {
                $elemMatch: {
                    organizationId: organizationId,
                }
            },


        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Members retrieved successfully',
            members
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving members',
            error: error.message
        });
    }
};


const getAdminInfobyToken = async (req, res) => {
    try {
        const token = req.params.token; // Assuming user ID is stored in req.user
        const user = await UserModel.findOne({ githubAccessToken: token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
}

const getDeveloperInfo = async (req, res) => {
    try {
        const token = req.params.token; // Assuming user ID is stored in req.user
        const user = await UserModel.findOne({ githubAccessToken: token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
}
const getDeveloperInfobyId = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id", id)
        const user = await UserModel.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
}

const getDashBoardData = async (req, res) => {
    try {
        const organizationId = req.params.organizationId;
        // const adminId = req.params.adminId;


        const getTotalproject = await ProjectModel.find({ organizationId: organizationId })
        const members = await UserModel.find({
            organizations: {
                $elemMatch: {
                    organizationId: organizationId,
                }
            },
        })


        return res.status(200).json({ message: 'Dashboard data retrived ',data:{totalProject:getTotalproject.length,totalMember:members.length }});
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
}


const linkToGithub = async (req, res) => {
  const { uid, githubToken } = req.body;

  if (!uid || !githubToken) {
    return res.status(400).json({ error: "Missing uid or githubToken" });
  }

  const octokit = new Octokit({ auth: githubToken });

  try {
    // Get all repos where user has admin access
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      per_page: 100,
    });

    const createdWebhooks = [];
    const skippedRepos = [];
    const failedRepos = [];

    for (const repo of repos) {
      if (!repo.permissions.admin) {
        continue; // only allow repos where user is admin
      }

      try {
        // 1️⃣ Get existing hooks
        const { data: hooks } = await octokit.repos.listWebhooks({
          owner: repo.owner.login,
          repo: repo.name,
        });

        const alreadyExists = hooks.find(
          (hook) =>
            hook.config.url === `${process.env.DEV_URL}/github/webhook`
        );

        if (alreadyExists) {
          console.log(`⚠️ Webhook already exists for ${repo.full_name}`);
          skippedRepos.push({
            repo: repo.full_name,
            webhookId: alreadyExists.id,
          });
          continue; // skip creating new
        }

        // 2️⃣ Create webhook if not exists
        const response = await octokit.repos.createWebhook({
          owner: repo.owner.login,
          repo: repo.name,
          config: {
            url: `${process.env.DEV_URL}/github/webhook`,
            content_type: "json",
            secret: process.env.GITHUB_WEBHOOK_SECRET,
            insecure_ssl: "0",
          },
          events: ["push", "pull_request", "create"],
        });

        createdWebhooks.push({
          repo: repo.full_name,
          webhookId: response.data.id,
        });

        console.log(`✅ Webhook created for ${repo.full_name}`);
      } catch (err) {
        console.error(`❌ Failed for ${repo.full_name}:`, err.message);
        failedRepos.push({
          repo: repo.full_name,
          error: err.message,
        });
      }
    }

    res.json({
      success: true,
      created: createdWebhooks,
      skipped: skippedRepos,
      failed: failedRepos,
    });
  } catch (err) {
    console.error("GitHub API error:", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    registerUser,
    getAllMembers,
    getAdminInfobyToken,
    getDeveloperInfo,
    getDeveloperInfobyId,
    getDashBoardData,
    linkToGithub
    // Other user controller methods can be added here
};

const UserModel = require("../models/user.model");
const { UserActivityModel } = require("../models/userActivity.model");

const insertUserActivity=async(req,res)=>{
    let   reqData=req.body
    const githubId=req.params.githubId

    const getUser=await UserModel.findOne({githubId:githubId});
if(!getUser){
return res.status(400).json({message:"user Not found!"})
}
    reqData.user=getUser._id;
    console.log("userobject",reqData)

    const setUserActivityData=await UserActivityModel.create(reqData);
    return res.status(200   ).json({data:setUserActivityData,message:"user activity data insert successfully"})
}


const getUserActivity=async(req,res)=>{
    const userActivity=await UserActivityModel.findOne({githubId:req.params.githubId});
    return res.status(200).json({
        data:userActivity,
        message:"useractivity get successfully "
    })
}
module.exports={
    insertUserActivity,getUserActivity
}
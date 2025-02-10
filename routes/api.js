'use strict';

const IssuesModel = require(process.cwd() + '/models/Issue.js');
const ProjectModel = require(process.cwd() + '/models/Project.js');


module.exports = function (app) {

  app.route('/api/issues/:project')
  
   .get(async (req, res) => {
    let projectName = req.params.project;
    try {
      const project = await ProjectModel.findOne({name: projectName})
        if(!project){
          res.json([{error: "project not found" }])
          return;
        } else {
          const issue = await IssuesModel.find({
            projectId: project._id,
            ...req.query,
          });

          if(!issue){
            res.json([{error: "no issues found"}]);
            return;
          }
        
        res.json(issue);
        return;
        }
    } catch (error) {
        res.json({ error: "error could't get _id "+ _id });
    }
    })

    
    .post( async (req, res) => {
      let project = req.params.project;
      const {issue_title , issue_text, created_on , updated_on , created_by , assigned_to, open, status_text } = req.body
      try {
        if(!issue_title || !issue_text || !created_by){
          throw new Error("required field(s) missing")
        }

        const existingProjectModel = await ProjectModel.findOne({ name: project });
        if (!existingProjectModel){
          const existingProjectModel = new ProjectModel({ name: project })
          await existingProjectModel.save();
        }

        const newIssue = new IssuesModel({
          projectId   : existingProjectModel._id ,
          issue_title: issue_title || "",
          issue_text: issue_text || "",  
          created_on: new Date(),  
          updated_on: new Date(),  
          created_by: created_by || "",  
          assigned_to: assigned_to || "", 
          open: true,         
          status_text: status_text || "", 
        });
        const savedIssue = await newIssue.save();
        res.json(savedIssue)
      
      } catch (error){
        res.json({error: error.message})
      }
    })
    
    .put(async (req, res) => {
      let projectName = req.params.project;
      
      const {
        _id,
        issue_title , 
        issue_text, 
        created_on , 
        updated_on , 
        created_by , 
        assigned_to, 
        open, 
        status_text 
      } = req.body

      if(!_id) {
        res.json({ error: 'missing _id' });
        return;
      }

      if(
        !issue_title  && 
        !issue_text   &&  
        !created_on   && 
        !updated_on   && 
        !created_by   && 
        !assigned_to  && 
        !open         &&
        !status_text)
        {
          res.json({ error: 'no update field(s) sent', '_id': _id });
          return;
        }

      try{
        const project = await ProjectModel.findOne({name: projectName})
        if(!project){
          res.json([{error: "project not found" }])
          return;
        } else {
          let issue = await IssuesModel.findByIdAndUpdate(_id, {
            ...req.body,
            updated_on: new Date(),
          });
          await issue.save();
          res.json({  result: 'successfully updated', '_id': _id })
        }
      }catch(error){
        res.json({ error: 'could not update', '_id': _id })
      }
    })
    
    .delete( async (req, res) => {
      let project = req.params.project;
      const { _id } = req.body;
      try{
        if(!_id){
          res.json({ error: 'missing _id' })
        }
        const deleteIssue = await IssuesModel.findByIdAndDelete(_id);
        
        if(!deleteIssue){
          res.json({ error: 'could not delete', '_id': _id })
        }
        
        res.json({ result: 'successfully deleted', '_id': _id })

      }catch(error){
        res.json({ error: 'could not delete', '_id': _id })
      }

    });
    
};

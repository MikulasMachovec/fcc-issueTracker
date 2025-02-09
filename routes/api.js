'use strict';

const IssuesModel = require(process.cwd() + '/models/Issue.js');
const ProjectModel = require(process.cwd() + '/models/Project.js');


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let projectName = req.params.project;
      try {
        const projectDoc = await ProjectModel.findOne({name: projectName})  
          if (!projectDoc){
            res.json([{error:'Project not found'}])
            return;
          }
        
        const filters = {projectId: projectDoc._id,... req.query}
        
          if ('open' in filters) {
            filters.open = filters.open === 'true';
          }
        
        const issuesResult = await IssuesModel.find(filters)
          if(!issuesResult){
            res.json([{error: 'No issues found'}])
            return;
          }
        console.log(issuesResult)
        res.json(issuesResult)
      
      } catch (error){
      res.json({error: error.message});
      }
    })
    
    .post( async function (req, res){
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
          issue_title,
          issue_text,  
          created_on,  
          updated_on,  
          created_by,  
          assigned_to, 
          open,        
          status_text, 
        });
        
        const savedIssue = await newIssue.save();
        res.json(savedIssue)
      
      } catch (error){
        res.json({error: error.message})
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
    })
    
    .delete(function (req, res){
      let project = req.params.project;
    });
    
};

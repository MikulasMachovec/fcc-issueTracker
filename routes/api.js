'use strict';

const IssueModel = require(process.cwd() + '/models/Issue.js');
const ProjectModel = require(process.cwd() + '/models/Project.js');


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      try{
        let project = req.params.project;
        const filters = { ...req.query, project };

        if (filters.open !== undefined){
          filters.open = filters.open === 'true'; 
        }
        
        const issues = await IssueModel.find(filters)
        res.json(issues);
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
        console.log(existingProjectModel)
        if (!existingProjectModel){
          const existingProjectModel = new ProjectModel({ name: project })
          await existingProjectModel.save();
        }

        const newIssue = new IssueModel({
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
        console.log(savedIssue)
        res.json(savedIssue)
      
      } catch (error){
        res.json({error: error.message})
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      //console.log("put "+ project)
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      //console.log("delete "+ project)
    });
    
};

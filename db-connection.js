const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueModel = require(process.cwd() + '/models/Issue.js');
const ProjectModel = require(process.cwd() + '/models/Project.js');


module.exports = function (app) {
    (async () => {
        try {
            if (!process.env.DB) throw new Error("Database URL (DB) is missing in environment variables.");

            await mongoose.connect(process.env.DB);
            console.log('Database connected successfully');
            
            app.locals.IssueModel = IssueModel;
            app.locals.ProjectModel = ProjectModel;
        
        } catch (error) {
            console.error( error.message );
        }
    })();
};

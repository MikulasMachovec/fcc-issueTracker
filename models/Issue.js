const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema(
    {
        projectId   : { type: String, required: true },
        issue_title : { type: String, required: true },
        issue_text  : { type: String, required: true },
        created_on  : Date,
        updated_on  : Date,
        created_by  : { type: String, required: true },
        assigned_to : String,
        open        : Boolean,
        status_text : String,
    },
    { versionKey: false }
);

const IssuesModel = mongoose.model('Issues', issueSchema);

module.exports = IssuesModel;

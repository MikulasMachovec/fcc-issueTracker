const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProjectSchema = new Schema(
    {
        name: { type: String, required: true }
    },
    { versionKey: false }
)

const ProjectModel = mongoose.model('Project Names', ProjectSchema);

module.exports = ProjectModel;

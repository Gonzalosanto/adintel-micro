import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FilenameSchema = new Schema({
    id: {unique:true, type: Number, required: true},
    filename: {type: String, required: true},
    path: String
})

export const URL = mongoose.model("Filename", FilenameSchema);
import sql from 'sequelize'
import {ApplicationBundle} from '../../../models/relational/ApplicationBundle.model'


const Insert = async (values)=>{ return ApplicationBundle.create(values) };

const BulkInsert = async (values)=>{ return ApplicationBundle.bulkCreate(values) };

//Review documentation to check model instance DELETE
// const destroyInstance = async (values)=>{ return ApplicationBundle.destroy(values)};

const SelectAll = async (attributes) => { 
    if(attributes) return ApplicationBundle.findAll(attributes)
    return ApplicationBundle.findAll()
};


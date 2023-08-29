import {AppBundle} from './ApplicationBundle.model.js'
import {AppName} from './ApplicationName.model.js'

//TODO: add every model and associations.
AppBundle.hasOne(AppName,{
    foreignkey: 'name',
});
AppName.hasOne(AppStore,{
    foreignkey: 'store'
});
AppName.belongsTo(AppBundle,{
    foreignkey: 'bundle',
    target_key: 'name'
});
export {AppName, AppBundle}
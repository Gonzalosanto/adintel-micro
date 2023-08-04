import {processFile} from '../../utils/files/fileProcessor.js'

export const saveFileData = () => {
    return processFile(process.env.BUNDLE_LIST, process.env.DELIMITER)
}
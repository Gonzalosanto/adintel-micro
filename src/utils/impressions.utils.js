
/**
 * 
 * @param {object} xml Object that contains Impressions
 * @returns 
 */
const getImpressionsAndEvents = (xml, chain) => {
    const impressions = getImpressions(xml)
    const events = getEvents(xml)
    return {impressions : chain.impressions.concat(impressions), events : chain.events.concat(events)}
}

const getImpressions = (xml) => {
    if(!xml?.VAST?.Ad) throw 'Invalid chain values'
    const baseTag = xml.VAST.Ad.Wrapper ? xml.VAST.Ad.Wrapper : xml.VAST.Ad.InLine;
    if(!baseTag?.Impression) throw 'No Impressions found' 
    let impressions = []
    for(const elem of baseTag?.Impression) {
        impressions.push(elem?._cdata);
    } 
    return impressions
}
/**
 * 
 * @param {object} xml Object that contains a list of impressions and events 
 */
const getEvents = (xml) => {
    if(!xml?.VAST?.Ad) throw 'Invalid chain values'
    const baseTag = xml.VAST.Ad.Wrapper ?? xml.VAST.Ad.InLine;
    const creativesTag = baseTag.Creatives.Creative.Linear
    if(!baseTag?.Creatives?.Creative) throw 'No Creatives found!' 
    
    const extractEvents = (creativesTag) => {
        if(!creativesTag?.TrackingEvents?.Tracking) throw 'No events found!'
        return creativesTag.TrackingEvents.Tracking?.map(elem => elem?._cdata) ?? [];
    }    
    const extractMediaFiles = (creativesTag) => {
        return creativesTag.MediaFiles.MediaFile?.map(elem => elem?._cdata) ?? [];
    }
    const extractVideoClicks = (creativesTag) => {
        let videoclick = [];
        if(!Array.isArray(creativesTag.VideoClicks.ClickThrough)) {
            videoclick.push(creativesTag.VideoClicks.ClickThrough?._cdata);
        } else {
            for (const elem of creativesTag.VideoClicks.ClickThrough) {
                videoclick.push(elem?._cdata);
            }
        }
        return videoclick;
    }
    
    let events = {events:[], mediafile:[], videoclick:[]}
    events.events = extractEvents(creativesTag);
    events.mediafile = creativesTag?.MediaFiles ? extractMediaFiles(creativesTag) : [];
    events.videoclick = creativesTag?.VideoClicks ? extractVideoClicks(creativesTag) : [];
    return events;
}

export {getImpressionsAndEvents}
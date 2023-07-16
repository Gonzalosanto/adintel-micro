import fetch from "node-fetch"
import { debug, error, log, warning } from "../middlewares/logger/index.js"
/**
 * 
 * @param {object} xml Object that contains Impressions
 * @returns 
 */
const getImpressionsAndEvents = (xml, chain) => {
    const impressions = getImpressions(xml)
    const events = getEvents(xml)
    if(!impressions && !events) return chain
    return {
        impressions : chain.impressions.concat(impressions), 
        events : chain.events.concat(events)
    }
}

const getImpressions = (xml) => {
    const VAST = xml?.VAST?.Ad ?? null;
    if(!VAST) return null;
    let baseTag;
    if (xml?.VAST?.Ad?.hasOwnProperty('Wrapper')) { baseTag = VAST.Wrapper }
    else if(xml?.VAST?.Ad?.hasOwnProperty('InLine')){ baseTag = VAST.InLine}
    else {return null}
    if(!baseTag?.Impression) return null;
    const impressionsXML = baseTag?.Impression
    let impressions = []
    if(!Array.isArray(impressionsXML)){impressions.push(impressionsXML?._cdata)}
    else {
        for (let i = 0; i < impressionsXML.length; i++) {
            const impression = impressionsXML[i];
            if(typeof impression == 'object'){
                if(impression['_cdata']) impressions.push(impression['_cdata'])
            }
        }
    }
    return impressions
}
/**
 * 
 * @param {object} xml Object that contains a list of impressions and events 
 */
const getEvents = (xml) => { 
    const extractEventByAttribute = (evt) => {
        const event = {[evt?._attributes?.event] : [evt?._cdata]}
        return event
    } 
    const VAST = xml?.VAST?.Ad ?? null;
    let baseTag;
    if(!xml?.VAST?.Ad) return null;
    if (xml?.VAST?.Ad?.hasOwnProperty('Wrapper')) { baseTag = VAST.Wrapper }
    else if(xml?.VAST?.Ad?.hasOwnProperty('InLine')){ baseTag = VAST.InLine}
    else {return null}
    const creativesTag = baseTag.Creatives?.Creative?.Linear
    if(!baseTag?.Creatives?.Creative) error('No Creatives found!')
    
    const extractEvents = (creativesTag) => {
        if(!creativesTag?.TrackingEvents?.Tracking) error('No events found!') 
        return creativesTag.TrackingEvents.Tracking?.map(elem => {
            return extractEventByAttribute(elem)
        }) ?? [];
    }
    const extractMediaFiles = (creativesTag) => {
        return creativesTag.MediaFiles.MediaFile?.map(elem => elem?._cdata);
    }
    const extractVideoClicks = (creativesTag) => {
        let videoclick = [];
        if(creativesTag?.VideoClicks?.ClickTracking) {
            if(Array.isArray(creativesTag?.VideoClicks?.ClickTracking)){
                for (const elem of creativesTag?.VideoClicks?.ClickTracking) {
                    videoclick.push(elem?._cdata)
                }
            } else {
                if(creativesTag?.VideoClicks?.ClickTracking?._cdata) videoclick.push(creativesTag?.VideoClicks?.ClickTracking?._cdata)
            }
        }
        if(!Array.isArray(creativesTag.VideoClicks.ClickThrough)) {
            if(creativesTag?.VideoClicks?.ClickThrough?._cdata) videoclick.push(creativesTag?.VideoClicks?.ClickThrough?._cdata);
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
const trigger = async (chain) => {
    let res = {}
    const {impressions, events} = chain ?? {}
    res.impressions = await triggerImpressions(impressions)
    res.events = await triggerEvents(events)
    return res;
}
const triggerImpressions = async(impressions)=>{
    let results = [];
    for (let i = 0; i < impressions.length; i++) {
        //Trigger request function
        results.push( await requestTrigger(impressions[i]))
    }
    return results;
}
const triggerEvents= async (events) => {
    const formatEvents = (events) => {
        let creativeView = [] 
        let start = []
        let midpoint = []
        let firstQuartile = []
        let thirdQuartile = []
        let complete = []
        let video = []
        let mediafile = []
        for (let j = 0; j < events.length; j++) {
            const evt = events[j].events
            video.push(events[j].videoclick ?? '')
            mediafile.push(events[j].mediafile)
            creativeView.push(evt.filter(e=>e.creativeView))
            start.push(evt.filter(e=>e.start))            
            firstQuartile.push(evt.filter(e=>e.firstQuartile))
            midpoint.push(evt.filter(e=>e.midpoint))
            thirdQuartile.push(evt.filter(e=>e.thirdQuartile))
            complete.push(evt.filter(e=>e.complete))
        }
        return {creativeView, start, firstQuartile, midpoint, thirdQuartile, complete, video, mediafile}
    }
    let results = []
    const evts = formatEvents(events)
    const ks = Object.keys(evts);
    let eventsToTrigger = {};
    for (let i = 0; i < ks.length; i++) {
        const key = ks[i];     
        evts[key].flat().map(e => {
            if(key == 'mediafile' || key == 'video'){
                if(e){
                    if(!eventsToTrigger[key]) eventsToTrigger[key] = [e]
                    else eventsToTrigger[key].push(e)
                }                
            } else {
                if(!eventsToTrigger[key]) eventsToTrigger[key] = [e[key]]
                else eventsToTrigger[key].push(e[key])
            }
        })
    }
    for (let j = 0; j < ks.length; j++) {
        for (let x = 0; x < eventsToTrigger[ks[j]].length; x++) {
            const evt = eventsToTrigger[ks[j]];
            //Trigger request function
            results.push(await requestTrigger(evt))
        }
    }
    return results
}

const requestTrigger = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            error(`${JSON.stringify(response)}`)
            error(`HTTP error! URL: ${response.url} Status: ${response.status}`);
        }
        const res = {
            url: response.url,
            status: response.status,
            headers: response.headers
        }
        return res;
      } catch (err) {
        log(err)
        error(`REQUEST TRIGGER FAILED! -> ${err}`)
    }
}

export {getImpressionsAndEvents, trigger}
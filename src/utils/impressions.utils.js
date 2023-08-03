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
    if(!VAST) return [];
    const baseTag = VAST.Wrapper || VAST.InLine;
    if (!baseTag) return null;
    if(!baseTag?.Impression) return null;
    const impressionsXML = baseTag?.Impression
    const impressions = []
    impressions.push(Array.isArray(impressionsXML)
    ? impressionsXML.map((impression) => {return impression?._cdata})
    : [impressionsXML?._cdata])
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
    const extractMediaFiles = (creativesTag) => { //FIX: Bug when some mediafiles are not array
        if(creativesTag?.MediaFiles?.MediaFile && Array.isArray(creativesTag?.MediaFiles?.MediaFile)) {
            return creativesTag?.MediaFiles?.MediaFile?.map(elem => elem?._cdata);
        }
        else {
            log(creativesTag?.MediaFiles?.MediaFile)
            return creativesTag?.MediaFiles.MediaFile
        }
        
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
    const results = await Promise.all(
        impressions.map(async (impression) => {
          return await requestTrigger(impression);
        })
      );
    return results;
}
const triggerEvents= async (events) => {
    const formatEvents = (events) => {
        const eventTypes = [
            "creativeView",
            "start",
            "midpoint",
            "firstQuartile",
            "thirdQuartile",
            "complete",
        ];
        const results = {
            video: [],
            mediafile: [],
        };
        eventTypes.forEach((eventType) => {
            results[eventType] = events.flatMap((event) =>
              event.events
                .filter((e) => e.hasOwnProperty(eventType))
                .map((e) => e[eventType])
            );
          });
        return results;
        // let creativeView = [] 
        // let start = []
        // let midpoint = []
        // let firstQuartile = []
        // let thirdQuartile = []
        // let complete = []
        // let video = []
        // let mediafile = []
        // for (let j = 0; j < events.length; j++) {
        //     const evt = events[j].events
        //     video.push(events[j].videoclick ?? '')
        //     mediafile.push(events[j].mediafile)
        //     creativeView.push(evt.filter(e=>e.creativeView))
        //     start.push(evt.filter(e=>e.start))            
        //     firstQuartile.push(evt.filter(e=>e.firstQuartile))
        //     midpoint.push(evt.filter(e=>e.midpoint))
        //     thirdQuartile.push(evt.filter(e=>e.thirdQuartile))
        //     complete.push(evt.filter(e=>e.complete))
        // }
        // return {creativeView, start, firstQuartile, midpoint, thirdQuartile, complete, video, mediafile}
    }
    const eventsToTrigger = formatEvents(events)
    const ks = Object.keys(eventsToTrigger);
    const promises = [];
    for (let j = 0; j < ks.length; j++) {
        const evt = eventsToTrigger[ks[j]];
        for (const e of evt) {
            promises.push(requestTrigger(e[0]));
        }
    }
    return Promise.all(promises);
}
const requestTrigger = async (url) => {
    const controller = new AbortController()
    const timeout = setTimeout(()=>controller.abort(), 10000);
    try {
        const response = await fetch(url, {signal: controller.signal});
        if (!response.ok) {
            error(`HTTP error! URL: ${response.url} Status: ${response.status}`);
        }
        const res = {
            url: response.url,
            status: response.status,
            headers: response.headers
        }
        clearTimeout(timeout)
        return res;
      } catch (err) {
        error(`REQUEST TRIGGER FAILED! -> ${err}`)
        clearTimeout(timeout)
    }
}

export {getImpressionsAndEvents, trigger}
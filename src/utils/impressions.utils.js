
/**
 * 
 * @param {object} chain Object that contains Impressions
 * @returns 
 */
const mapImpressionsAndEvents = (chain) => {
    const impressions = getImpressions(chain)
    const eventsByImpression = impressions.map((imp)=>{
        return {impression : imp, events : getEventsByImpression(chain, imp)}
    })
    return eventsByImpression
}

const getImpressions = (chain) => {
    console.log(chain)
}
/**
 * 
 * @param {object} chain Object that contains a list of impressions and events 
 */
const getEventsByImpression = (chain, impression) => {
    console.log(impression)
}

export {mapImpressionsAndEvents}
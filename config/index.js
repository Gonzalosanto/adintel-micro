import 'dotenv/config';

const PORT = process.env.PORT || 8080;
const DEVICE_CATEGORY = 4
const WIDTH = 1920
const HEIGHT = 1080
const VAST_VERSION = '2.0'
const AID = 835805;
const BASE_URL = 'http://s.adtelligent.com';

export { WIDTH, HEIGHT ,BASE_URL, AID, PORT, VAST_VERSION, DEVICE_CATEGORY };
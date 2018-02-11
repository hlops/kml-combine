var Decoder = require('./GG-NmeaDecode');

//console.log('Hello!', new Decoder("$GPRMC,225446.00,A,4916.45,N,12311.12,W,000.5,054.7,191194,020.3,E*68"));

var GpxFileBuilder = require('gpx').GpxFileBuilder;

var builder = new GpxFileBuilder();

var xml = builder.setFileInfo({
    name : 'Test file',
    description : 'A test file generated in javascript',
    creator : 'My Application',
    time : new Date(),
    keywords : ['test', 'javascript']
}).addWayPoints([
    {
        latitude : 50.04243,
        longitude : 4.98264,
        name : 'Waypoint #1',
        elevation : 1.243
    },
    {
        latitude : 50.02394,
        longitude : 4.97745,
        name : 'Waypoint #2',
        elevation : 1.222
    }
]).addRoute(
    {
        name : 'Test route'
    },
    [
        {
            latitude : 50.04243,
            longitude : 4.98264
        },
        {
            latitude : 50.03561,
            longitude : 4.98109
        },
        {
            latitude : 50.02394,
            longitude : 4.97745
        },
    ]
).xml();

console.log(xml);

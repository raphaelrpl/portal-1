/**
 * return colors by band
 */
export const colorsByBand = {
    blue: {
        borderColor: '#0000ff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    red: {
        borderColor: '#ff0000',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    green: {
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    ndvi: {
        borderColor: '#006600',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    evi: {
        borderColor: '#339966',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    coastal: {
        borderColor: '#0033cc',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    redge1: {
        borderColor: '#663300',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    redge2: {
        borderColor: '#cc9900',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    redge3: {
        borderColor: '#cc6600',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    nir: {
        borderColor: '#00ffff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    bnir: {
        borderColor: '#669999',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    wvap: {
        borderColor: '#ff00ff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    swir1: {
        borderColor: '#3333ff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    swir2: {
        borderColor: '#666633',
        backgroundColor: 'rgba(0,0,0,0)'
    }
};

export const bandsBySatSen = {
    "HLS.L30": ["coastal", "blue", "green", "red",  "nir",  "swir1", "swir2", "quality"],
    "HLS.S30": ["coastal", "blue", "green", "red",  "nir",  "swir1", "swir2", "quality"],
    "LC8SR": ["blue", "coastal", "evi", "green", "ndvi", "nir", "quality", "red", "swir1", "swir2"],
    "MOD13Q1": ["ndvi", "evi", "red", "nir", "blue", "swir2", "quality"],
    "MYD13Q1": ["ndvi", "evi", "red", "nir", "blue", "swir2", "quality"],
    "S2SR": ["coastal", "blue", "green", "red", "redge1", "redge2", "redge3", "nir", "bnir", "wvap", "swir1", "swir2", "ndvi", "quality"]
}
const fs = require("fs");
const path = require("path");
const apiList = require('../apiList.js');

describe('List of APIs (apiList.js)', () => {

    it('is not empty', () => {
        expect(apiList.length).toBeGreaterThan(0);
    })

    it('contains APIs with valid ids', () => {
        expect(apiList.filter( api => api.id > 0 )).toHaveLength(apiList.length);
    })

    it('contains APIs with valid links', () => {
        expect(apiList.filter( api => api.link && api.link.length > 0 )).toHaveLength(apiList.length);
    })

    it('contains APIs with valid graphql links', () => {
        expect(apiList.filter( api => api.graphLink === `${api.link}/graphql`)).toHaveLength(apiList.length);
    })

    it('contains APIs with valid titles', () => {
        expect(apiList.filter( api => api.title && api.title.length > 0 )).toHaveLength(apiList.length);
    })

    it('contains APIs with valid descriptions', () => {
        expect(apiList.filter( api => api.desc && api.desc.length > 0 )).toHaveLength(apiList.length);
    })

    it('contains APIs with valid long descriptions', () => {
        expect(apiList.filter( api => api.longDesc && api.longDesc.length > 0 )).toHaveLength(apiList.length);
    })

    it('contains APIs with at least one endpoint', () => {
        expect(apiList.filter( api => api.endPoints && Array.isArray(api.endPoints) && api.endPoints.length > 0 )).toHaveLength(apiList.length);
    })

    it('have valid .json files associated', () => {
        expect(apiList.filter( api => {
            let rawData = fs.readFileSync(path.join(__dirname, `../api/${api.link}.json`));
            return rawData && rawData.length > 0;
        })).toHaveLength(apiList.length);
    })

    it('have valid backup .json files associated', () => {
        expect(apiList.filter( api => {
            let rawData = fs.readFileSync(path.join(__dirname, `../api/${api.link}.json.backup`));
            return rawData && rawData.length > 0;
        })).toHaveLength(apiList.length);
    })

});
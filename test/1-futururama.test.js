const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const { request, expect } = chai

describe(`test`, () => {
	it('should get futurama data', () => {
		return request('http://localhost:5555')
			.get('/futurama/api/characters')
			.set('Accept', 'application/json')
			.then(res => {
				expect(res).to.have.status(200)
				console.log(res.body)
				expect(res.body).to.be.an('array')
			})
			.catch(err => {
				console.log(err)
				throw err
			})
	})
})

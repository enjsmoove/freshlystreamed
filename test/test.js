var superagent = require('superagent')
var chai = require('chai')
var port = 2009
var expect =chai.expect;

describe('homepage', function(){
  it('should respond to GET',function(){
    superagent
      .get('http://localhost:'+port)
      .end(function(res){
        expect(res.status).to.equal(200);
    })
  })
})

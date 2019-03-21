var expect = require("chai").expect; 
var utils= require("../app/utils").utils;

describe("Color Code Converter", function(){
    describe("RGB to Hex conversion", function(){
        it("converts the basic colors", function(){
            expect(utils.add(2,3)).to.equal(5);
        });
    });
});

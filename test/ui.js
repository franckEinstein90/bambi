/*******************************************************************
 * tests for ui module 
 * FranckEinstein90
 * ----------------
 *
 ********************************************************************/

const expect = require('chai').expect;
const validator = require('validator');
const ui = require('../src/client/ui').ui;


describe('ui.UI Object', function() {

 /******************************************************
  * construction tests
  * ***************************************************/
    it("is constructed using a list of handles corresponding to DOM ids", function() {
        let uiTest = ui.newUI({
		id1 : "uiTitle", 
		id2 : "uiBodyLeft", 
		id3 : "uiBodyRight"});

        expect(uiTest).to.not.be.undefined;
	expect(uiTest).to.have.property('id1');
	expect(uiTest.id1).to.equal('uiTitle');
    })
})



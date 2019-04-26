const expect = require('chai').expect;
const dialogForm = require('../src/dialogForm.js').dialogForm;

describe('createNewForm', function() {
    it('is creates a new dialog form' , function() {
        let form = dialogForm.createNewForm("formId");
        expect(form).to.equal("<section ID='formId' class='aui-dialog2 aui-dialog2-medium aui-layer'></section>");
    })
})



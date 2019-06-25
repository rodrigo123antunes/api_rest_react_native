'use strict';
var MagicTest = require('vmagic/test/MagicTest');
var magicTest = new MagicTest();
const {assert} = require('chai');
let areaController = null;
let areaModel = null;
let companyModel = null;
let companyId = null;
let areaId = null;

before(async function () {
    areaController = magicTest.controllerTest("Areas");
    areaModel = magicTest.modelTest("Area");
    companyModel = magicTest.modelTest("Company");

    const appUtil = areaController.component("AppUtil");
    const random = Math.floor(Math.random() * 100);
    const resCompany = await companyModel.save({"name" : "EMV sistemas LTDA", "cnpj" : appUtil.removeSpecialsCharacters(`28.${random}9.998/0001-67`)});
    companyId = resCompany.rows[0].id;

    const resArea = await areaModel.save({"description" : "Setor 1", "company_id" : companyId});
    areaId = resArea.rows[0].id;
});

describe('AreaController - Required field', function () {
    it('It must validate the field id.', function (done) {
        areaController.id = null;

        areaController.put(function (res) {
            assert.equal("Field id cannot be null.", res.error.detail);
            done();
        });
    });

    it('It must validate the field company_id.', function (done) {
        areaController.query = {
            description: "teste",
            company_id: ""
        };

        areaController.search(function (res) {
            assert.equal("Field company_id cannot be null.", res.error.detail);
            done();
        });
    });

});


describe('AreaController', function () {
    it('It must get area by id.', function (done) {
        areaController.query = {
            "id" : areaId
        };

        areaController.findBy(function (res) {
            assert.isTrue(res.data.length > 0);
            done();
        });
    });

    it('must GET a company area.', function (done) {
        areaController.query = {
            "company_id" : companyId
        };

        areaController.get(function (res) {
            assert.isTrue(res.data.length > 0);
            done();
        });
    });

    it('must SAVE a company area.', function (done) {
        areaController.payload = {
            "description": "emv technology",
            "company_id" : companyId
        };

        areaController.post(function (res) {
            assert.isTrue(res.data[0].description === 'emv technology');
            done();
        });
    });

    it('must EDIT a company area.', function (done) {
        areaController.id = areaId;

        areaController.payload = {
            "description": "emv post by put -- edit"
        };

        areaController.put(function(resPut) {
            assert.isTrue(resPut.data[0].description === "emv post by put -- edit");
            done();
        });
    });

    it('must DELETE a company area.', function (done) {
        areaController.payload = {"id": 1};
        areaController.delete(function (res) {
            assert.equal(res.data.command, 'DELETE');
            done();
        });
    });
});

'use strict';
var MagicTest = require('vmagic/test/MagicTest');
var magicTest = new MagicTest();
const {assert} = require('chai');
let sectorController = null;
let sectorModel = null;
let companyModel = null;
let companyId = null;
let sectorId = null;

before(async function () {
    sectorController = magicTest.controllerTest("Sectors");
    sectorModel = magicTest.modelTest("Sector");
    companyModel = magicTest.modelTest("Company");

    const appUtil = sectorController.component("AppUtil");
    const random = Math.floor(Math.random() * 100);
    const resCompany = await companyModel.save({"name" : "EMV sistemas LTDA", "cnpj" : appUtil.removeSpecialsCharacters(`28.${random}9.998/0001-67`)});
    companyId = resCompany.rows[0].id;

    const resSector = await sectorModel.save({"description" : "Setor 1", "company_id" : companyId});
    sectorId = resSector.rows[0].id;
});

describe('SectorController - Required field', function () {
    it('It must validate the field company_id.', function (done) {
        sectorController.query = {};

        sectorController.get(function (res) {
            assert.equal("Field company_id cannot be null.", res.error.detail);
            done();
        });
    });

    it('It must validate the field id.', function (done) {
        sectorController.id = null;

        sectorController.put(function (res) {
            assert.equal("Field id cannot be null.", res.error.detail);
            done();
        });
    });
});


describe('SectorController', function () {
    it('It must get sector by company_id.', function (done) {
        sectorController.query = {
            "company_id" : companyId
        };

        sectorController.findAllCompanyId(function (res) {
            assert.isTrue(res.data.length > 0);
            done();
        });
    });


    it('It must get sector by id.', function (done) {
        sectorController.query = {
            "id" : sectorId
        };

        sectorController.findBy(function (res) {
            assert.isTrue(res.data.length > 0);
            done();
        });
    });

    it('must GET a company sector.', function (done) {
        sectorController.query = {
            "company_id" : companyId
        };

        sectorController.get(function (res) {
            assert.isTrue(res.data.count > 0);
            done();
        });
    });

    it('must SAVE a company sector.', function (done) {
        sectorController.payload = {
            "description": "emv technology",
            "company_id" : companyId
        };

        sectorController.post(function (res) {
            assert.isTrue(res.data[0].description === 'emv technology');
            done();
        });
    });

    it('must EDIT a company sector.', function (done) {
        sectorController.id = sectorId;

        sectorController.payload = {
            "description": "emv post by put -- edit"
        };

        sectorController.put(function(resPut) {
            assert.isTrue(resPut.data[0].description === "emv post by put -- edit");
            done();
        });
    });

    it('must DELETE a company sector.', function (done) {
        sectorController.payload = {"id": 1};
        sectorController.delete(function (res) {
            assert.equal(res.data.command, 'DELETE');
            done();
        });
    });
});

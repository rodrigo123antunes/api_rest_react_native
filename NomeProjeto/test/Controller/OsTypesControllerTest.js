'use strict';
const MagicTest = require('vmagic/test/MagicTest');
const magicTest = new MagicTest();
const {assert, expect} = require('chai');
let osTypesController = null;
let osTypeModel = null;
let companyModel = null;
let companyId = null;
let osTypeId = null;

before(async function () {
    osTypesController = magicTest.controllerTest("OsTypes");
    osTypeModel = magicTest.modelTest("OsType");
    companyModel = magicTest.modelTest("Company");

    const appUtil = osTypesController.component("AppUtil");
    const random = Math.floor(Math.random() * 100);
    const resCompany = await companyModel.save({"name" : "EMV sistemas LTDA", "cnpj" : appUtil.removeSpecialsCharacters(`28.${random}9.998/0001-67`)});
    companyId = resCompany.rows[0].id;

    const resType = await osTypeModel.save({"description" : "Description type", "service" : "PREVENTIVE", "company_id" : companyId});
    osTypeId = resType.rows[0].id;
});

describe('OsTypeController', function () {
    it('It should validate the required field description.', function (done) {
        osTypesController.payload = {};
        osTypesController.post(function (res) {
            assert.equal("Field description cannot be null.", res.error.detail);
            done();
        });
    });

    it('It must SAVE a os type.', function (done) {
        osTypesController.payload = {
            "description": "this is my description",
            "service": "PREVENTIVE",
            "company_id" : companyId
        };
        osTypesController.post(function (res) {
            assert.equal(res.data[0].description, 'this is my description');
            done();
        });
    });

    it('It must EDIT a os type.', function (done) {
        osTypesController.id = osTypeId;

        osTypesController.payload = {
            "description": "this is my description --edit",
            "company_id" : companyId
        };

        osTypesController.put(function(resPut) {
            assert.isTrue(resPut.data[0].description === "this is my description --edit");
            done();
        });
    });

    it('It must DELETE a os type.', function (done) {
        osTypesController.payload = {"id": osTypeId};

        osTypesController.delete(function (resDel) {
            assert.equal(resDel.data.command, 'DELETE');
            done();
        });
    });
});

'use strict';
var MagicTest = require('vmagic/test/MagicTest');
var magicTest = new MagicTest();
const {assert} = require('chai');
let maintenancePlansController = null;
let maintenancePlan = null;
let ostypeModel = null;
let areaModel = null;
let taskModel = null;
let companyModel = null;
let companyId = null;
let maintenancePlanId = null;
let areaId = null;
let ostypeId = null;

before(async function() {
    maintenancePlansController = magicTest.controllerTest("MaintenancePlans");
    maintenancePlan = magicTest.modelTest("MaintenancePlan");
    ostypeModel = magicTest.modelTest("OsType");
    areaModel = magicTest.modelTest("Area");
    taskModel = magicTest.modelTest("Task");
    companyModel = magicTest.modelTest("Company");

    const appUtil = maintenancePlansController.component("AppUtil");
    const random = Math.floor(Math.random() * 100);
    const resCompany = await companyModel.save({"name": "EMV sistemas LTDA", "cnpj": appUtil.removeSpecialsCharacters(`28.${random}9.998/0001-67`)});
    companyId = resCompany.rows[0].id;

    const resArea = await areaModel.save({"description": "Area test", "company_id": companyId});
    areaId = resArea.rows[0].id;

    const resOstype = await ostypeModel.save({"description": "Melhoria massa", "service": "PREVENTIVE", "company_id": companyId});
    ostypeId = resOstype.rows[0].id;

    const resmaintenancePlan = await maintenancePlan.save({
        "area_id": areaId,
        "frequency": 30,
        "tag": random,
        "description": "description",
        "ostype_id": ostypeId,
        "company_id": companyId
    });
    maintenancePlanId = resmaintenancePlan.rows[0].id;
});

describe('MaintenancePlansController - Required field', function () {
    it('It must validate the field id.', function (done) {
        maintenancePlansController.id = null;

        maintenancePlansController.put(function (res) {
            assert.equal("Field id cannot be null.", res.error.detail);
            done();
        });
    });

    it('It must validate the field company_id.', function (done) {
        maintenancePlansController.query = {
            "description": "teste",
            "company_id": ""
        };

        maintenancePlansController.search(function (res) {
            assert.equal("Field company_id cannot be null.", res.error.detail);
            done();
        });
    });

});

describe('MaintenancePlansController', function () {
    it('It must get area by id.', function (done) {
        maintenancePlansController.query = {
            "id" : maintenancePlanId
        };

        maintenancePlansController.findBy(function (res) {
            assert.isTrue(res.data.length > 0);
            done();
        });
    });

    it('must GET a company area.', function (done) {
        maintenancePlansController.query = {
            "company_id" : companyId
        };

        maintenancePlansController.get(function (res) {
            assert.isTrue(res.data.length > 0);
            done();
        });
    });

    it('must SAVE a company area.', function (done) {
        maintenancePlansController.payload = {
            "description": "emv technology",
            "company_id" : companyId
        };

        maintenancePlansController.post(function (res) {
            assert.isTrue(res.data[0].description === 'emv technology');
            done();
        });
    });

    it('must EDIT a company area.', function (done) {
        maintenancePlansController.id = maintenancePlanId;

        maintenancePlansController.payload = {
            "description": "emv post by put -- edit"
        };

        maintenancePlansController.put(function(resPut) {
            assert.isTrue(resPut.data[0].description === "emv post by put -- edit");
            done();
        });
    });

    it('must DELETE a company area.', function (done) {
        maintenancePlansController.payload = {"id": 1};
        maintenancePlansController.delete(function (res) {
            assert.equal(res.data.command, 'DELETE');
            done();
        });
    });
});

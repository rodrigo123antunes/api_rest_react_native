'use strict';
var MagicTest = require('vmagic/test/MagicTest');
var magicTest = new MagicTest();
const {assert} = require('chai');
let companyStructureController = null;
let companyStructureModel = null;
let modelCompanyModel = null;
let companyId = null;
let appUtil = null;

before(async function () {
    companyStructureController = magicTest.controllerTest("CompanyStructure");
    companyStructureModel = magicTest.modelTest("CompanyStructure");
    modelCompanyModel = magicTest.modelTest("Company");

    appUtil = companyStructureController.component("AppUtil");

    const random = Math.floor(Math.random() * 100);
    const resCompany = await modelCompanyModel.save({"name" : "EMV sistemas LTDA", "cnpj" : appUtil.removeSpecialsCharacters(`28.${random}9.998/0001-67`)});
    companyId = resCompany.rows[0].id;
});

describe('CompanyStructureController', function () {

    it('It must SAVE a company structure.', function (done) {
        companyStructureController.payload = {
            "description": "emv technology",
            "company_id" : companyId
        };

        companyStructureController.post(function (res) {
            assert.isTrue(res.rows[0].description === 'emv technology');
            done();
        });
    });

    it('It must EDIT a company structure.', async function () {

        function call(id) {
            companyStructureController.payload = {
                id,
                "description": "emv edit",
                "company_id" : companyId
            };

            return new Promise(resolve => {
                companyStructureController.put(function(resPut) {
                    assert.isTrue(resPut.rows[0].description === 'emv edit');
                    resolve();
                });
            });
        }

        const resStructure = await companyStructureModel.save({"description" : "emv technology save to test put", "company_id" : companyId});
        await call(resStructure.rows[0].id);
    });
});

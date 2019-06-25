'use strict';
var MagicTest = require('vmagic/test/MagicTest');
var magicTest = new MagicTest();
const {assert} = require('chai');
let symptomController = null;
let symptomModel = null;
let companyModel = null;
let companyId = null;
let symptomId = null;

before(async function () {
    symptomController = magicTest.controllerTest("Symptoms");
    symptomModel = magicTest.modelTest("Symptom");
    companyModel = magicTest.modelTest("Company");

    const appUtil = symptomController.component("AppUtil");
    const random = Math.floor(Math.random() * 100);
    const resCompany = await companyModel.save({"name" : "EMV sistemas LTDA", "cnpj" : appUtil.removeSpecialsCharacters(`28.${random}9.998/0001-67`)});
    companyId = resCompany.rows[0].id;

    const resSymptom = await symptomModel.save({"description" : "Sintoma 1", "company_id" : companyId});
    symptomId = resSymptom.rows[0].id;
});

describe('SymptomController', function () {
    it('must GET a symptom.', function (done) {
        symptomController.query = {"company_id" : companyId};
        symptomController.get(function (res) {
            assert.isTrue(res.data.symptoms.length > 0);
            done();
        });
    });

    it('must SAVE a symptom.', function (done) {
        symptomController.payload = {
            "description": "recarregar gás",
            "company_id" : companyId
        };

        symptomController.post(function (res) {
            assert.isTrue(res.data[0].description === 'recarregar gás');
            done();
        });
    });

    it('must EDIT a symptom.', function (done) {
        symptomController.id = symptomId;

        symptomController.payload = {
            "description": "recarregar gás post by put -- edit"
        };

        symptomController.put(function(resPut) {
            assert.isTrue(resPut.data[0].description === "recarregar gás post by put -- edit");
            done();
        });
    });

    it('must DELETE a symptom.', function (done) {
        symptomController.payload = {"id": symptomId};

        symptomController.delete(function (res) {
            assert.equal(res.data.command, 'DELETE');
            done();
        });
    });
});

'use strict';
var MagicTest = require('vmagic/test/MagicTest');
var magicTest = new MagicTest();
const {assert} = require('chai');
let machinesController = null;
let machineModel = null;
let companyModel = null;
let sectorModel = null;
let appUtil = null;
let companyId = null;
let sectorId = null;

before(async function () {
    machinesController = magicTest.controllerTest("Machines");
    machineModel = magicTest.modelTest("Machine");
    companyModel = magicTest.modelTest("Company");
    sectorModel = magicTest.modelTest("Sector");

    appUtil = machinesController.component("AppUtil");

    const random = Math.floor(Math.random() * 100);
    const resCompany = await companyModel.save({"name" : "EMV sistemas LTDA", "cnpj" : appUtil.removeSpecialsCharacters(`28.${random}9.998/0001-67`)});
    companyId = resCompany.rows[0].id;

    const resSector = await sectorModel.save({"description" : "Sector 1", "company_id" : companyId});
    sectorId = resSector.rows[0].id;
});

describe('MachineController - Required field', function () {
    it('It must validate the field code.', function (done) {
        machinesController.payload = {};

        machinesController.post(function (res) {
            assert.equal("Field code cannot be null.", res.error.detail);
            done();
        });
    });

    it('It must validate the field description.', function (done) {
        machinesController.payload = {
            "code" : "123"
        };

        machinesController.post(function (res) {
            assert.equal("Field description cannot be null.", res.error.detail);
            done();
        });
    });
});

describe('MachineController', function () {

    it('It must GET a machine.', function (done) {
        machinesController.query = {};
        machinesController.get(function (res) {
            assert.isFalse(res.length > 0);
            done();
        });
    });

    it('It must SAVE a machine.', function (done) {
        const code = (Math.random() + 1).toString(36).substr(5, 9);
        machinesController.payload = {
            code,
            "description": "esta é uma breve descrição da maquina",
            "url_picture": "http://127.0.0.1/machines/image.png",
            "sector_id": sectorId,
            "company_id" : companyId
        };

        machinesController.post(function (res) {
            console.log(res);
            assert.isTrue(res.data[0].description === "esta é uma breve descrição da maquina");
            done();
        });
    });

    it('It must EDIT a machine.', async function () {
        function call(id) {
            machinesController.id = id;
            machinesController.payload = {
                "code": (Math.random() + 1).toString(36).substr(5, 9),
                "description": "esta é uma breve descrição da maquina -- edit",
                "url_picture": "http://127.0.0.1/machines/image.png",
                "sector_id": sectorId,
                "company_id" : companyId
            };

            return new Promise(resolve => {
                machinesController.put(function(resPut) {
                    assert.isTrue(resPut.data[0].description === "esta é uma breve descrição da maquina -- edit");
                    resolve();
                });
            });
        }

        const resMachine = await machineModel.save({
            "code": (Math.random() + 1).toString(36).substr(5, 9),
            "description": "esta é uma breve descrição da maquina",
            "sector_id" : sectorId,
            "company_id" : companyId
        });

        await call(resMachine.rows[0].id);
    });

    it('must DELETE a machine.', async function () {
        function call(id) {
            machinesController.payload = {
                id
            };

            return new Promise(resolve => {
                machinesController.delete(function (resDelete) {
                    console.log(resDelete);
                    assert.isFalse(resDelete.data.length > 0);
                    resolve();
                });
            });
        }

        const resMachine = await machineModel.save({
            "code": (Math.random() + 1).toString(36).substr(5, 9),
            "description": "esta é uma breve descrição da maquina para deletar",
            "sector_id" : sectorId,
            "company_id" : companyId,
            "note" :"aaaaaaaaaaaaaaaaaa"
        });

        await call(resMachine.rows[0].id);
    });
});

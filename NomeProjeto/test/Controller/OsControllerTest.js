'use strict';
const MagicTest = require('vmagic/test/MagicTest');
const magicTest = new MagicTest();
const {assert} = require('chai');
let osController = null;
let osModel = null;
let osTypeModel = null;
let userModel = null;
let companyModel = null;
let machineModel = null;
let sectorModel = null;
let symptomModel = null;
let areaModel = null;

let osTypeId = null;
let userId = null;
let companyId = null;
let machineId = null;
let sectorId = null;
let symptomId = null;
let areaId = null;
let osId = null;

before(function () {
    osController = magicTest.controllerTest("Os");
    osModel = magicTest.modelTest("Os");
    osTypeModel = magicTest.modelTest("OsType");
    userModel = magicTest.modelTest("User");
    companyModel = magicTest.modelTest("Company");
    machineModel = magicTest.modelTest("Machine");
    sectorModel = magicTest.modelTest("Sector");
    symptomModel = magicTest.modelTest("Symptom");
    areaModel = magicTest.modelTest("Area");
});

beforeEach(async function () {
    const createCompany = await companyModel.save({
        "cnpj": `286899${Math.floor(Math.random() * 36)}000167`,
        "name": "EMV Company Test"
    });

    const createTypeOs = await osTypeModel.save({
        "description": "this is my description",
        "service": "PREVENTIVE",
        "company_id": createCompany.rows[0].id
    });

    const createSector = await sectorModel.save({"description": "emv technology", "company_id": createCompany.rows[0].id});

    const createMachine = await machineModel.save({
        "code": Math.floor(Math.random() * 100000),
        "description": "esta é uma breve descrição da maquina",
        "image_url": "http://127.0.0.1/machines/image.png",
        "sector_id": createSector.rows[0].id,
        "company_id": createCompany.rows[0].id
    });

    const createSymptom = await symptomModel.save({"description": "recarregar gás", "company_id": createCompany.rows[0].id});

    const createArea = await areaModel.save({"description": "pintura", "company_id": createCompany.rows[0].id});

    const createUser = await userModel.save({
        "name": "EMV Technology",
        "email": "email@emvtech.com.br",
        "password": "123456",
        "badge": "00001",
        "perfil": "ADMINISTRATOR",
        "avatar": "http://jira.emvtech.com.br:8080/s/zijbvs/713000/b6b48b2829824b869586ac216d119363/_/images/jira-software.png",
        "company_id": createCompany.rows[0].id
    });

    const postOs = await osModel.save({
        "code": Math.floor(Math.random() * 1000),
        "start_date": "2019-04-24 13:30",
        "planned_date": "2019-04-24",
        "ostype_id": createTypeOs.rows[0].id,
        "machine_id": createMachine.rows[0].id,
        "company_id": createCompany.rows[0].id,
        "machine_status": "STOPPED",
        "status": "REPROGRAMMED",
        "area_id": createArea.rows[0].id,
        "sector_id": createSector.rows[0].id,
        "symptom_id": createSymptom.rows[0].id,
        "description": "sdfjh djshfd jhsdkjsdfj hdsjfhlkjhs",
        "note": "djshfd jhsdkjsdfj hdsjfhlkjhs",
        "gsm_user_id": createUser.rows[0].id,
        "status" : "OPEN",
        "maintainer_id": createUser.rows[0].id
    });

    companyId = createCompany.rows[0].id;
    osTypeId = createTypeOs.rows[0].id;
    sectorId = createSector.rows[0].id;
    machineId = createMachine.rows[0].id;
    symptomId = createSymptom.rows[0].id;
    areaId = createArea.rows[0].id;
    userId = createUser.rows[0].id;
    osId = postOs.rows[0].id;
});

describe('oscontroller - validations', function() {
    it('It should validate the required field start_date.', function (done) {
        osController.payload = {};
        osController.post(function (res) {
            assert.equal('Field start_date cannot be null.', res.error.detail);
            done();
        });
    });

    it('It should validate the required field ostype_id.', function (done) {
        osController.payload = {"start_date": "2019-05-22 08:00:00"};
        osController.post(function (res) {
            assert.equal('Field ostype_id cannot be null.', res.error.detail);
            done();
        });
    });

    it('It should validate the required field sector_id.', function (done) {
        osController.payload = {"start_date": "2019-05-22 08:00:00", "ostype_id": 9};
        osController.post(function (res) {
            assert.equal('Field sector_id cannot be null.', res.error.detail);
            done();
        });
    });

    it('It should validate the required field company_id.', function (done) {
        osController.payload = {"start_date": "2019-05-22 08:00:00", "ostype_id": 9, "sector_id": 12, "symptom_id": 10};
        osController.post(function (res) {
            assert.equal('Field company_id cannot be null.', res.error.detail);
            done();
        });
    });

    it('It should validate the required field code.', function (done) {
        osController.payload = {};
        osController.put(function (res) {
            assert.equal('Field code cannot be null.', res.error.detail);
            done();
        });
    });

    it('It should validate the required field ostype_id.', function (done) {
        osController.payload = {"code": "13"};
        osController.put(function (res) {
            assert.equal('Field ostype_id cannot be null.', res.error.detail);
            done();
        });
    });

    it('It should validate the required field sector_id.', function (done) {
        osController.payload = {"code": "13", "ostype_id": 9};
        osController.put(function (res) {
            assert.equal('Field sector_id cannot be null.', res.error.detail);
            done();
        });
    });

});

describe('OsController', function () {
    it('It must RETURN a os by id.', function (done) {
        osController.query = {"id": osId, "company_id": companyId};

        osController.get(function (res) {
            assert.isTrue(res.data.os.length > 0);
            done();
        });
    });

    it('It must RETURN all os`s by company_id.', function (done) {
        osController.query = {"company_id": companyId};

        osController.findAll(function (res) {
            assert.isTrue(res.data.rows.length > 0);
            done();
        });
    });

    it('It must SAVE a os.', function (done) {
        osController.payload = {
            "code": Math.floor(Math.random() * 1000),
            "start_date": "2019-04-24 13:30",
            "planned_date": "2019-04-24 18:30",
            "ostype_id": osTypeId,
            "machine_id": machineId,
            "company_id": companyId,
            "machine_status": "STOPPED",
            "status": "REPROGRAMMED",
            "area_id": areaId,
            "sector_id": sectorId,
            "symptom_id": symptomId,
            "description": "sdfjh djshfd jhsdkjsdfj hdsjfhlkjhs",
            "note": "djshfd jhsdkjsdfj hdsjfhlkjhs",
            "gsm_user_id": userId,
            "maintainer_id": userId,
            "status" : "OPEN"
        };

        osController.post(function (res) {
            assert.isTrue(res.data.rows[0].description === "sdfjh djshfd jhsdkjsdfj hdsjfhlkjhs");
            done();
        });
    });

    it('It must EDIT a os type.', async function () {
        function call(id) {
            osController.id = id;
            osController.payload = {
                "code": Math.floor(Math.random() * 1000),
                "start_date": "2019-04-24 13:30",
                "planned_date": "2019-04-24 18:30",
                "ostype_id": osTypeId,
                "machine_id": machineId,
                "company_id": companyId,
                "machine_status": "STOPPED",
                "status": "REPROGRAMMED",
                "area_id": areaId,
                "sector_id": sectorId,
                "symptom_id": symptomId,
                "description": "sdfjh djshfd jhsdkjsdfj hdsjfhlkjhs",
                "note": "djshfd jhsdkjsdfj hdsjfhlkjhs",
                "gsm_user_id": userId,
<<<<<<< HEAD
                "maintainer_id": userId,
=======
                "maintainer_id": userId
>>>>>>> develop
            };

            return new Promise(resolve => {
                osController.put(function(resPut) {
                    assert.equal(resPut.data.command, "UPDATE");
                    resolve();
                });
            });
        }

        const resOs = await osModel.save({
            "code": Math.floor(Math.random() * 36),
            "start_date": "2019-04-24 13:30",
            "planned_date": "2019-04-24 18:30",
            "ostype_id": osTypeId,
            "machine_id": machineId,
            "company_id": companyId,
            "machine_status": "STOPPED",
            "status": "REPROGRAMMED",
            "area_id": areaId,
            "sector_id": sectorId,
            "symptom_id": symptomId,
            "description": "sdfjh djshfd jhsdkjsdfj hdsjfhlkjhs",
            "note": "djshfd jhsdkjsdfj hdsjfhlkjhs",
            "gsm_user_id": userId,
<<<<<<< HEAD
=======
            "maintainer_id" : userId,
            "status" : "OPEN"
>>>>>>> develop
        });

        await call(resOs.rows[0].id);
    });

    it('It must DELETE a os.', async function () {
        function call(id) {
            osController.payload = {
                id
            };

            return new Promise(resolve => {
                osController.delete(function (resDelete) {
                    assert.isFalse(resDelete.data.length > 0);
                    resolve();
                });
            });
        }

        const resOs = await osModel.save({
            "code": Math.floor(Math.random() * 36),
            "start_date": "2019-04-24 13:30",
            "planned_date": "2019-04-24 18:30",
            "ostype_id": osTypeId,
            "machine_id": machineId,
            "company_id": companyId,
            "machine_status": "STOPPED",
            "status": "REPROGRAMMED",
            "area_id": areaId,
            "sector_id": sectorId,
            "symptom_id": symptomId,
            "description": "sdfjh djshfd jhsdkjsdfj hdsjfhlkjhs",
            "note": "djshfd jhsdkjsdfj hdsjfhlkjhs",
            "gsm_user_id": userId,
<<<<<<< HEAD
=======
            "maintainer_id" : userId,
            "status" : "OPEN"
>>>>>>> develop
        });

        await call(resOs.rows[0].id);
    });
});

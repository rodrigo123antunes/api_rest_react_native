'use strict';
var MagicTest = require('vmagic/test/MagicTest');
var magicTest = new MagicTest();
const {assert} = require('chai');
let hoursWorkedController = null;
let hoursModel = null;
let companyModel = null;
let companyId = null;
let userModel = null;
let osModel = null;
let osTypeModel = null;
let machineModel = null;
let sectorModel = null;
let symptomModel = null;
let areaModel = null;
let userId = null;
let userId2 = null;
let hoursWorkedId = null;
let osId = null;

before(async function () {
    hoursWorkedController = magicTest.controllerTest("HoursWorked");
    hoursModel = magicTest.modelTest("Hours");
    companyModel = magicTest.modelTest("Company");
    userModel = magicTest.modelTest("User");
    osModel = magicTest.modelTest("Os");
    osTypeModel = magicTest.modelTest("OsType");
    machineModel = magicTest.modelTest("Machine");
    sectorModel = magicTest.modelTest("Sector");
    symptomModel = magicTest.modelTest("Symptom");
    areaModel = magicTest.modelTest("Area");

    const appUtil = hoursWorkedController.component("AppUtil");
    const random = Math.floor(Math.random() * 100);
    const resCompany = await companyModel.save({"name" : "EMV sistemas LTDA", "cnpj" : appUtil.removeSpecialsCharacters(`28.${random}9.998/0001-67`)});
    companyId = resCompany.rows[0].id;

    const resUser = await userModel.save({
        "name": "EMV Technology",
        "email": "email@emvtech.com.br",
        "password": "123456",
        "badge": "00001",
        "perfil": "ADMINISTRATOR",
        "avatar": "http://jira.emvtech.com.br:8080/s/zijbvs/713000/b6b48b2829824b869586ac216d119363/_/images/jira-software.png",
        "company_id": companyId
    });

    userId = resUser.rows[0].id;

    const resUser2 = await userModel.save({
        "name": "EMV Technology",
        "email": "email@emvtech.com.br",
        "password": "123456",
        "badge": "00001",
        "perfil": "ADMINISTRATOR",
        "avatar": "http://jira.emvtech.com.br:8080/s/zijbvs/713000/b6b48b2829824b869586ac216d119363/_/images/jira-software.png",
        "company_id": companyId
    });

    userId2 = resUser2.rows[0].id;

    const createTypeOs = await osTypeModel.save({
        "description": "this is my description",
        "service": "PREVENTIVE",
        "company_id": resCompany.rows[0].id
    });

    const createSector = await sectorModel.save({"description": "emv technology", "company_id": resCompany.rows[0].id});

    const createMachine = await machineModel.save({
        "code": Math.floor(Math.random() * 100000),
        "description": "esta é uma breve descrição da maquina",
        "image_url": "http://127.0.0.1/machines/image.png",
        "sector_id": createSector.rows[0].id,
        "company_id": resCompany.rows[0].id
    });

    const createSymptom = await symptomModel.save({"description": "recarregar gás", "company_id": resCompany.rows[0].id});

    var createArea = await areaModel.save({"description": "pintura", "company_id": resCompany.rows[0].id});

    const postOs = await osModel.save({
        "code": Math.floor(Math.random() * 1000),
        "start_date": "2019-04-24 13:30",
        "planned_date": "2019-04-24 18:30",
        "ostype_id": createTypeOs.rows[0].id,
        "machine_id": createMachine.rows[0].id,
        "company_id": resCompany.rows[0].id,
        "machine_status": "STOPPED",
        "area_id": createArea.rows[0].id,
        "sector_id": createSector.rows[0].id,
        "symptom_id": createSymptom.rows[0].id,
        "description": "sdfjh djshfd jhsdkjsdfj hdsjfhlkjhs",
        "note": "djshfd jhsdkjsdfj hdsjfhlkjhs",
        "gsm_user_id": resUser.rows[0].id,
        "maintainer_id" : resUser.rows[0].id,
        "status" : "OPEN"
    });
    osId = postOs.rows[0].id;

    const resHoursWorked = await hoursModel.save({
        "start_date": "2019-05-05 15:30",
        "end_date": "2019-05-06 15:30",
        "description": "dsadsfdsf dsfds sdfds fdsf dsfdsfs fdds fsdf sfsdfs sdf sdf sdf sdf sdf dsfdsf.",
        "gsm_user_id": userId,
        "company_id" : companyId,
        "os_id": osId
    });
    hoursWorkedId = resHoursWorked.rows[0].id;
});

describe('hoursWorkedController', function () {
    it('It must get hoursWorked by id.', function (done) {
        hoursWorkedController.query = {
            "id" : hoursWorkedId
        };

        hoursWorkedController.findBy(function (res) {
            assert.isTrue(res.data.length > 0);
            done();
        });
    });

    it('must GET a company hoursWorked.', function (done) {
        hoursWorkedController.query = {
            "company_id" : companyId
        };

        hoursWorkedController.get(function (res) {
            assert.isTrue(res.data.hoursWorked.length > 0);
            done();
        });
    });

    it('must SAVE a hoursWorked.', function (done) {
        hoursWorkedController.payload = {
            "start_date": "2019-05-05 15:30",
            "end_date": "2019-05-06 15:30",
            "description": "dsadsfdsf dsfds sdfds fdsf dsfdsfs fdds fsdf sfsdfs sdf sdf sdf sdf sdf dsfdsf.",
            "users": [{id: userId, hourcost: 20}, {id: userId2, hourcost: 15}],
            "company_id" : companyId,
            "os_id": osId
        };

        hoursWorkedController.post(function (res) {
            assert.equal(res.data[0].command, 'INSERT');
            done();
        });
    });

});

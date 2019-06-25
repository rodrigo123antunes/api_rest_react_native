'use strict';
const MagicTest = require('vmagic/test/MagicTest');
const magicTest = new MagicTest();
const {assert, expect} = require('chai');
let usersController = null;
let userModel = null;
let companyModel = null;
let appUtil = null;
let companyId = null;

before(async function () {
    usersController = magicTest.controllerTest("Users");
    userModel = magicTest.modelTest("User");
    companyModel = magicTest.modelTest("Company");
    appUtil = usersController.component("AppUtil");

    const random = Math.floor(Math.random() * 100);

    const resCompany = await companyModel.save({"cnpj" : appUtil.removeSpecialsCharacters(`28.689.9${random}/0001-67`), "name" : "EMV Company Test"});
    companyId = resCompany.rows[0].id;

    await userModel.save({
        "name": "EMV Technology",
        "email": "user@emvtech.com.br",
        "password": "abc123",
        "badge": "00001",
        "perfil": "ADMINISTRATOR",
        "avatar": "http://jira.emvtech.com.br:8080/s/zijbvs/713000/b6b48b2829824b869586ac216d119363/_/images/jira-software.png",
        "company_id" : companyId
    });
});

describe('UsersController', function () {
    it('It should validate the required field email.', function (done) {
        usersController.query = {
            "name": "EMV Technology",
            "email": "",
            "password": "abc123",
            "badge": "00001",
            "perfil": "ADMINISTRATOR",
            "avatar": "http://jira.emvtech.com.br:8080/s/zijbvs/713000/b6b48b2829824b869586ac216d119363/_/images/jira-software.png"
        };

        usersController.get(function (err) {
            expect(err.error.detail).to.equal("Field email cannot be null.");
            done();
        });
    });

    it('It should validate the required field password.', function (done) {
        usersController.query = {
            "email": "email@emvtech.com.br",
            "password": ""
        };

        usersController.get(function (err) {
            expect(err.error.detail).to.equal("Field password cannot be null.");
            done();
        });
    });

    it('It must RETURN a user.', async function () {
        function call() {
            return new Promise(resolve => {
                usersController.query = {
                    "email": "email@emvtech.com.br",
                    "password": "123"
                };
                usersController.get(function (res) {
                    assert.isTrue(res.data.length > 0);
                    resolve();
                });
            });
        }

        try {
            const random = Math.floor(Math.random() * 100);

            const resCompany = await companyModel.save({"cnpj" : appUtil.removeSpecialsCharacters(`28.684.9${random}/0001-67`), "name" : "EMV Company Test"});

            const hasPassword = appUtil.md5("123");
            const data = {
                "name": "EMV Technology",
                "email": "email@emvtech.com.br",
                "password": hasPassword,
                "badge": "00001",
                "perfil": "ADMINISTRATOR",
                "avatar": "http://jira.emvtech.com.br:8080/s/zijbvs/713000/b6b48b2829824b869586ac216d119363/_/images/jira-software.png",
                "company_id" : resCompany.rows[0].id
            };

            await userModel.save(data);

            await call();
        } catch (err) {
            assert.fail("Insert failed.");
        }
    });

    it('It must RETURN all users.', function (done) {
        usersController.query = {
            "company_id" : companyId
        };
        usersController.findAll(function (res) {
            assert.isTrue(res.data.users.length > 0);
            done();
        });
    });

    it('It must SAVE a user.', function (done) {
        const random = Math.floor(Math.random() * 100);
        usersController.payload = {
            "cnpj" : `28.689.957/0001-${random}`,
            "company_name" : "EMV sistemas LTDA.",
            "name": "EMV Technology",
            "email": "email@emvtech.com.br",
            "password": "abc123",
            "badge": "00001",
            "perfil": "ADMINISTRATOR",
            "avatar": "http://jira.emvtech.com.br:8080/s/zijbvs/713000/b6b48b2829824b869586ac216d119363/_/images/jira-software.png"
        };
        usersController.post(res => {
            assert.equal(res.data.command, 'INSERT');
            done();
        });
    });

    it('It must DELETE a user.', function (done) {
        usersController.payload = {"id": 1};
        usersController.delete(function (res) {
            assert.equal(res.command, 'DELETE');
            done();
        });
    });
});

'use strict';
var vMagicAppController = require('vmagic/AppController');

class TasksController extends vMagicAppController {
    init() {
        //nome do arquivo na pasta Model
        this.model('Task');
        this.mysql = this.component('MySQL');
        this.logger = this.component('Logger');
    }

    //Função para trazer todos os registros do banco.
    get(callback) {
        this.Task.findAll().
            then(res => {
                this.logger.info(res);
                callback(res);
            }).
            catch(err => {
                this.statusCode = 500;
                this.logger.error(err);
                callback(err);
            });
    }

    //Função para trazer todos os registros onde o id seja igual ao this.query.id
    findBy(callback) {
        this.Task.findBy({"id": this.query.id}).
            then(res => {
                this.logger.info(res);
                callback(res);
            }).
            catch(err => {
                this.statusCode = 500;
                this.logger.error(err);
                callback(err);
            });
    }

    //função para inserir um novo registro no banco
    post(callback) {
        this.Task.save(this.payload).
            then(res => {
                this.logger.info(res);
                callback(res);
            }).
            catch(err => {
                this.logger.error(err);
                callback(err);
            });
    }

    //Função para editar um registro onde o id seja igual a this.payload.id
    put(callback) {
        var conditions = {
            "id" : this.id
        }

        var values = {
            "name": this.payload.name,
            "description": this.payload.description,
        }

        this.Task.update(values, conditions).
            then(res => {
                this.logger.info(res);
                callback(res);
            }).
            catch(err => {
                this.logger.error(err);
                callback(err);
            });
    }

    ///função para excluir um registro onde o id seja igual a this.payload.id;
    delete(callback) {
        this.Task.delete({"id": this.payload.id}).
            then(res => {
                this.logger.info(res);
                callback(res);
            }).
            catch(err => {
                this.logger.error(err);
                callback(err);
            });
    }

}
module.exports = TasksController;

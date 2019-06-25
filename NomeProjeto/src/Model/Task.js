'use strict';
var AppModel = require('vmagic/AppModel');

class Task extends AppModel {
    init() {
        this.useTable = 'tasks';
        this.logger = this.component('Logger');
    }
}
module.exports = Task;

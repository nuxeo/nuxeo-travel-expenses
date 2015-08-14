/*
 * (C) Copyright 2015 Nuxeo SA (http://nuxeo.com/) and contributors.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Lesser General Public License
 * (LGPL) version 2.1 which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/lgpl-2.1.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 */

(function(document) {
  'use strict';

  var TASKS = {
    'create': 'Task4fb',
    'accept': 'Task12ef',
    'accountancy': 'Task1431'
  };

  var app = document.querySelector('#app');
  app.selectedTab = 0;
  app.task = null;

  app.toolbarTitle = function (task) {
    return task ? task.name : 'Travel Expenses';
  };
  app.toolbarIcon = function(task) {
    return task ? 'arrow-back' : 'menu';
  };
  app.back = function () {
    app.task = null;
  };
  app.refresh = function () {
    location.reload();
  };

  app.isStep = function (key, task) {
    return task && TASKS[key] === task.nodeName;
  };

  HTMLImports.whenReady(function() {
    app.formatDate = Polymer.Base.formatDate = function (str) {
      return (str) ? new Date(str).toLocaleString() : '';
    };

    app.i18n = Polymer.Base.i18n = function (key) {
      return {
          'wf.actors': 'Actors',
          'wf.dueDate': 'Due date',
          'wf.directive': 'Directive,',
          'wf.travelExpenseValidation': 'Travel expense validation',
          'wf.travelExpenses.create': 'Create expense',
          'wf.travelExpenses.validate': 'Validate expense',
          'wf.travelExpenses.accountancy': 'Account for expense',
          'wf.travelExpenses.submitExpense': 'Submit for validation',
          'wf.travelExpenses.customerCode': 'Set customer code',
          'wf.travelExpenses.submit': 'Submit',
          'wf.travelExpenses.cancel': 'Cancel',
          'wf.travelExpenses.done': 'Done',
          'wf.travelExpenses.label': 'Label',
          'wf.travelExpenses.amount': 'Amount',
          'wf.travelExpenses.description': 'Description',
          'wf.travelExpenses.nature': 'Nature',
          'wf.travelExpenses.department': 'Department',
          'wf.travelExpenses.file': 'File'
        }[key] || key;
    };
  });

})(document);

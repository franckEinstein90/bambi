"use strict";
const bambi = require('../bambi.js').bambi;

const eventCategories = require('../events/eventCategories').eventCategories

const dateUtils = require('../time/dateUtils').dateUtils;
const moment = require('moment');

const ui = require('../ui.js').ui;
const dayUI = require('./dayUI.js').dayUI;

//related dialogs
const eventDialogUI = require('../dialogs/eventDialogUI').eventDialogUI;

const calendarSideBarUI = (function() {
    let containerHeight, uiSideBar, sidebarTitle, 
        filterPane
    
    uiSideBar = ui.newUI({
            calendarSidebar: "calendar-sidebar",
            sidebarInner: "sidebar-inner",
            sideBarHeading: "sidebar-heading",
            createNewDayEvent: "add-event-today"
        });

    sidebarTitle = function(){
        return `${bambi.clientData["weekDays"][dateUtils.today.weekIDX]} ${dateUtils.today.monthIDX}`
    }  

    filterPane = function(){
        let categories = eventCategories.listCategoriesLabel()
        categories.unshift( {id:"all", label:"show all"} )

        categories = categories.map(catDescription => [
                `<div class="checkbox">`,
                `<input class="checkbox" type="checkbox" name="${catDescription.label}" `, 
                `id="category-${catDescription.id}">`, 
                `<label for="${catDescription.label}">${catDescription.label}</label>`, 
                `</div>`].join(''))

        return [   
             `<div id="filter-pane">`, 
             `<h4>Category filter</h4>`,
             `<form class"aui"><fieldset class="group">${categories.join("")}</fieldset></form>`,
            `</div>`].join('')
    }
    return {
        onReady: function(calendar) {
            containerHeight = AJS.$("#calendar-container").height() -
                AJS.$("#calendar-container-header").height();
            try {
                AJS.$("#calendar-sidebar").css("height", containerHeight);
                AJS.$("#calendar-sidebar").html("<div class='sidebarInner' id='sidebar-inner'></div>");
                AJS.$("#sidebar-inner").append("<h2 id='sidebar-heading'>aaa</h2>");
                AJS.$("#sidebar-heading").html(sidebarTitle());
                AJS.$("#sidebar-inner").append("<button id='add-event-today' class='aui-button'>Add an event</button>");
                AJS.$("#add-event-today").click(function(e) {
                    e.preventDefault();
                    eventDialogUI.showNew();
                });
                AJS.$("#sidebar-inner").append(filterPane())

            } catch (e) {
                console.log("error " + e);
                throw e;
            }
        }
    }
})()


module.exports = {
    calendarSideBarUI,
}

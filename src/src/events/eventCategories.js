"use strict"; 
/***********************************************
 * eventCategories:  categorizes events into sets
 * ********************************************/

const eventCategories = (function (){
	let categories = new Map()

	return {
		addCategory: function({categoryID, label, cssDecorator}){
			categories.set(categoryID, {
				label:label, 
				cssDescorator:cssDecorator })
		}
	}
})()

module.exports = {
	eventCategories
} 

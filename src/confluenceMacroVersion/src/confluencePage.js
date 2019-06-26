const confluencePage = (function () {
               let _pageID = undefined,  
		   _path = "", 
		   _title = "", 
		   _version = undefined, 
		   _content = "", 
               	   setValues = function(){
                 	_path = contextPath + "/rest/api/content/" + _pageID;
                 	let result = jQuery.getValues(_path + "?expand=body.storage,version");
                 	_title = result["title"];
                 	_version = result["version"]["number"];
                 	_content = result["body"]["storage"]["value"];
               };
	       return{
		onReady : function(pageID){
		   _pageID = pageID;
		   setValues();	
	       }, 
		pageID : function() {return _pageID;},
		path: function() {return _path;}, 
		title: function() {return _title;}, 
		version: function() {return _version;}, 
		content: function() {return _content;}
	}
})();

module.exports = {
   confluencePage 
}

var Events = (function(){
  function generateUUID() {
      var d = new Date().getTime();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
          d += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
  };
  return {
    Event: function(){
      this.id = generateUUID();
      this.status = "ongoing";
      this.flip = function(){
        console.log("flipping status");
      };
    }
  }
})();

module.exports = {Events};

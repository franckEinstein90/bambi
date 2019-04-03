var dateUtils = require('./dateUtils.js').dateUtils;

var calendarSettings = (function() {
    let today = new Date(),
  month = today.getMonth(),
  year = today.getFullYear(),
  firstDayOfMonth = dateUtils.firstDayOfMonth(this.year, this.month),
  monthLength = dateUtils.monthLength(this.year, this.month);

    return {
        setMonth: function(y, m) {
            year = y;
            month = m;
        },
        getYear: function() {
            return year;
        },
        setValues: function(year, month) {
            this.month = month;
            this.year = year;
            this.firstDayOfMonth = dateUtils.firstDayOfMonth(this.year, this.month);
            this.monthLength = dateUtils.monthLength(this.year, this.month);
        }
    };
})();

//end calendarSettings
module.exports = calendarSettings;

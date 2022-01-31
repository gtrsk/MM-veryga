Module.register("MM-veryga",{

	defaults: {
	},

  getScripts: function() {
    return ["moment.js"]
  },


	getDom: function() {
		var wrapper = document.createElement("div");
    wrapper.id = "MMv_wrapper"
    wrapper.style = ""

    var canvas = document.createElement("canvas")
    canvas.width = 60
    canvas.height = 50
    canvas.id = "veryga_times"

    var ctx = canvas.getContext("2d");


    ctx.font="17px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";

    var  data = this.updateCalc()
    ctx.fillText(data.wait, 5, 20);
    ctx.fillStyle = "green";
    ctx.textAlign = "left";
    ctx.fillText(data.closes, 5, 40);
    wrapper.appendChild(canvas)
		return wrapper;
	},

  start: function () {
    Log.info("Starting module: " + this.name);
    moment().locale("lt")
  },


  updateCalc: function () {
    let currentTime = moment()
    let weekday = currentTime.format("E")
    let closingHour = (weekday == 7)? 16 : 20
    let todayClosingHour = moment().startOf('day').add(closingHour, 'hour')
    let todayOpeningTime = moment().startOf('day').add(10, 'hour')
    let tomorrowOpeningTime = moment().startOf('day').add(1, 'day').add(10, 'hour')

    let untilOpensToday = moment.duration(todayOpeningTime.diff(currentTime));
    let opens = untilOpensToday > 0 ? untilOpensToday : moment.duration(tomorrowOpeningTime.diff(currentTime));
    let opensInHr = Math.floor(opens.asHours())
    let opensInHrNice = moment().startOf('day').add(opensInHr, 'hour').format("HH")
    let opensInMins = Math.floor(opens.asMinutes() - (opensInHr * 60))
    let opensInMinsNice = moment().startOf('day').add(opensInMins, 'minute').format('mm')

    let closesToday = moment.duration(todayClosingHour.diff(currentTime));
    let closesAsMins = closesToday.asMinutes()
    let closesInHr = Math.floor(closesToday.asHours())
    let closesInHrNice = moment().startOf('day').add(closesInHr, 'hour').format("HH")
    let closesInMins = Math.floor(closesAsMins - (closesInHr * 60))
    let closesInMinsNice = moment().startOf('day').add(closesInMins, 'minute').format('mm')
    let wait = String(opensInHrNice) + ":" + String(opensInMinsNice)
    let closesTime =  (closesAsMins < 0) ? "Veryga": String(closesInHrNice) + ":" + String(closesInMinsNice)

    return { wait: wait, closes: closesTime}
  }
});

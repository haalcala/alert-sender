/**
 * Created by harold on 2/9/15.
 */

var alert_sender = require("../index.js");

describe("test", function() {
	describe("configure aws ses", function() {
		it("should configure ses successfully", function () {
			alert_sender.configure({
				sns: {
					"type"				: "sns",
					"accessKeyId"		: "",
					"secretAccessKey"	: "",
					"region"			: "",
					"topic"				: "",
				}
			});
		});

		it("should send an alert", function(done) {
			alert_sender.send("Test " + new Date(), {subject: "This is the subject"});

			setTimeout(function () {
				done();
			}, 1000);
		});
	});
});
To install:

	npm install alert-sender --save

Usage:

	var alert_sender = require("alert-sender");

To configure:

	alert_sender.configure({
		sns: {
			"type"				: "sns",
			"accessKeyId"		: "",
			"secretAccessKey"	: "",
			"region"			: "",
			"topic"				: "",
		},
		ses: { // not supported yet
			"type"				: "ses",
			"accessKeyId"		: "",
			"secretAccessKey"	: "",
			"region"			: "",
			"sender"			: "",
		}
		smtp: { // not supported yet
			host				: "",
			port				: "",
			username			: "",
			password			: "",
			sender				: "",
		},
		vcube_gate: { // not supported yet
			username			: "",
			password			: "",
			group_name 			: "",
		}
	});

In the above codes, the 'sns' becomes the default channel because it's the first one or if the only configuration in the list. Alternatively, you can say default_channel = 'sns'

To send:

	alert_sender.send("Test " + new Date());

or

	alert_sender.send("Test " + new Date(), "sns");

More advanced configuration later



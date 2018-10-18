var sns, sns_topic, AWS, default_channel, _configuration;

var validations = {
	sns : {
		accessKeyId : {
			required: true
		},
		secretAccessKey : {
			required: true
		},
		region : {
			required: true
		},
		topic : {
			required: true
		},
	}
};

var allowed_types = ["sns"];

exports.configure = function(__configuration) {
	_configuration = __configuration;

	if (_configuration) {
		default_channel = _configuration.default_channel;

		for (var name in _configuration) {
			var configuration =_configuration[name];
			var validation = validations[name];

			var type = configuration.type;

			if (!type && allowed_types.indexOf(name) > -1) {
				type = name;
			}

			if (!type || allowed_types.indexOf(name) == -1) {
				// throw "unknown type '" + configuration.type + "'";
				continue;
			}

			console.log("validation", validation);
			console.log("type", type);

			if (validation) {
				for (var property in validation) {
					var criteria = validation[property];

					if (criteria) {
						for (var key in criteria) {
							var value = criteria[key];

							console.log("configuration["+property+"]", configuration[property]);

							if (key == "required") {
								if (!configuration[property] || typeof(configuration[property]) == "undefined") {
									throw "Missing required parameter " + name + "." + property;
								}
							}
						}
					}
				}
			}

			if (!default_channel) {
				default_channel = name;
			}

			if (name == "sns") {
				AWS = require('aws-sdk');

				var config = {
					"accessKeyId"		: configuration.accessKeyId,
					"secretAccessKey"	: configuration.secretAccessKey,
					"region"			: configuration.region,
				};

				console.log("config", config);

				AWS.config.update(config);

				sns = new AWS.SNS();

				sns_topic = configuration.topic;
			}
		}
	}
};

var channel_last_sent = exports.channel_last_sent = {};
var channel_log_start = exports.channel_log_start = {};
var channel_log_count = exports.channel_log_count = {};

exports.send = function (message, options, channel) {
	console.log("options", options);

	if (!channel && typeof(options) == "string") {
		channel = options;
		options = null;
	}

	if (!channel) {
		channel = default_channel;
	}

	console.log("channel", channel);
	console.log("sns_topic", sns_topic);
	console.log("sns", sns);

	options = options || {};

	if (!_configuration[channel]) {
		throw "No such channel '" + channel + "'";
	}

	if (!channel_log_start[channel] || (new Date() - channel_log_start[channel]) > 60000) {
		channel_log_count[channel] = 0;
		channel_log_start[channel] = new Date();
	}

	channel_log_count[channel]++;

	if (channel_log_count[channel] > 10 && ((new Date() - channel_log_start[channel]) < 60000)) {
		return console.log("Error: alert-sender.send was called more than 10 times in a minute");
	}

	if (options.subject && options.subject.length > 100) {
		options.subject = options.subject.substr(0, 100);
	}

	if (channel == "sns") {
		var sns_params = {TopicArn: sns_topic, Message: message, Subject: "No Subject"};

		if (options.subject) {
			sns_params.Subject = options.subject;
		}

		sns.publish(
			sns_params,
			function(err, data) {
				if (err) {
					console.log("Error sending a message "+err);
				}
				else {
					console.log("Sent message " + JSON.stringify(data));
					console.log("message: " + message);
				}
			}
		);
	}

};
"use strict";
var isBot = require("isbot");
var userAgentLib = require("useragent");



const parseBotAgent = userAgent =>
{
	if (userAgent != null)
	{
		userAgent = userAgentLib.parse(userAgent).family.toLowerCase();

		if (userAgent!=="other" && isBot(userAgent))
		{
			return userAgent;
		}
	}

	return "robots";
};



module.exports = parseBotAgent;

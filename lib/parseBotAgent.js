"use strict";
var isBot = require("isbot");



function parseBotAgent(userAgent)
{
	var result;
	
	if (userAgent != null)
	{
		result = isBot(userAgent);
		
		if (result !== false)
		{
			result = result.toLowerCase();
		}
		else
		{
			result = null;
		}
	}
	
	return result==null ? "robots" : result;
}



module.exports = parseBotAgent;

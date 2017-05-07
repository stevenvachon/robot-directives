"use strict";
const group = require("./group");



const parseDirectives = (bot, prefix, values, instance) =>
{
	if (bot==null || values==null || values.length<1)
	{
		return false;
	}
	else
	{
		if (instance.directives[bot] == null)
		{
			instance.directives[bot] = group.blank();
		}

		const target = instance.directives[bot];

		if (prefix != null)
		{
			if (prefix === "unavailable_after")
			{
				target.unavailable_after = new Date( values[0] ).getTime();
			}
		}
		else
		{
			values.forEach(value => group.set(target, value.trim(), instance.options));
		}

		return true;
	}
};



module.exports = parseDirectives;

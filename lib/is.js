"use strict";
const constants = require("./constants");
const removeNo = require("./removeNo");



const is = (target, directive, options, inverted, one) =>
{
	const expected = inverted!==true;

	if (Array.isArray(directive))
	{
		const numDirectives = directive.length;

		for (let i=0; i<numDirectives; i++)
		{
			if (is_single(target, directive[i], options) !== expected)
			{
				if (one !== true)
				{
					return false;
				}
			}
			else if (one === true)
			{
				return true;
			}
		}

		return one!==true;
	}
	else
	{
		return is_single(target, directive, options) === expected;
	}
};



const is_single = (target, directive, options) =>
{
	switch (directive)
	{
		case constants.ALL:
		{
			return target.all===true && isAvailable(target,options);
		}

		case constants.ARCHIVE:
		case constants.CACHE:
		{
			return target.archive===true && target.cache===true && target.index!==false && isAvailable(target,options);
		}

		case constants.FOLLOW:
		case constants.NONE:
		{
			return target[directive] === true;
		}

		case constants.IMAGEINDEX:
		case constants.ODP:
		case constants.SNIPPET:
		case constants.TRANSLATE:
		{
			return target[directive]===true && target.index!==false && isAvailable(target,options);
		}

		case constants.INDEX:
		{
			return target.index===true && isAvailable(target,options);
		}

		case constants.NOARCHIVE:
		case constants.NOCACHE:
		{
			return target.archive===false || target.cache===false || !isAvailable(target,options);
		}

		case constants.NOFOLLOW:
		{
			return target.follow === false;
		}

		case constants.NOIMAGEINDEX:
		case constants.NOODP:
		case constants.NOSNIPPET:
		case constants.NOTRANSLATE:
		{
			return target[ removeNo(directive) ]===false || target.index===false || !isAvailable(target,options);
		}

		case constants.NOINDEX:
		{
			return target.index===false || !isAvailable(target,options);
		}

		default:
		{
			return false;
		}
	}
};



const isAvailable = (target, options) => target.unavailable_after > options.currentTime();



module.exports = is;

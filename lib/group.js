"use strict";
const constants = require("./constants");
const removeNo = require("./removeNo");



const blank = () =>
{
	return {
		all: null,
		archive: null,
		cache: null,
		follow: null,
		imageindex: null,
		index: null,
		none: null,
		odp: null,
		snippet: null,
		translate: null,
		unavailable_after: null
	};
};



const initial = () =>
{
	const result = blank();

	setToAll(result);

	result.unavailable_after = Infinity;

	return result;
};



const isAll = target =>
{
	return target.archive===true &&
	       target.cache===true &&
	       target.follow===true &&
	       target.imageindex===true &&
	       target.index===true &&
	       target.none!==true && // TODO :: ===false should be fine now?
	       target.odp===true &&
	       target.snippet===true &&
	       target.translate===true;
};



const isNone = target => target.follow===false && target.index===false;



const merge = (target, source, options) => Object.keys(source).forEach(key =>
{
	const directive = source[key];

	if (directive === true)
	{
		set(target, key, options);
	}
	else if (directive === false)
	{
		// "noall", "nonone" and "nounavailable_after" will be ignored
		set(target, `no${key}`, options);
	}
});



const set = (target, directive, options) =>
{
	// https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives
	// http://www.webgnomes.org/blog/robots-meta-tag-definitive-guide/
	switch (directive)
	{
		case constants.ALL:
		{
			if (!options.allIsReadonly && !options.restrictive)
			{
				setToAll(target);
			}

			break;
		}

		case constants.ARCHIVE:
		case constants.CACHE:
		{
			if ((target.archive!==false && target.cache!==false && target.index!==false) || !options.restrictive)
			{
				target.archive = true;
				target.cache = true;
				target.index = true;
				target.none = false;
				target.all = isAll(target);
			}

			break;
		}

		case constants.FOLLOW:
		case constants.INDEX:
		{
			if (target[directive]!==false || !options.restrictive)
			{
				target[directive] = true;
				target.none = false;
				target.all = isAll(target);
			}

			break;
		}

		case constants.IMAGEINDEX:
		case constants.ODP:
		case constants.SNIPPET:
		case constants.TRANSLATE:
		{
			if ((target[directive]!==false && target.index!==false) || !options.restrictive)
			{
				target[directive] = true;
				target.index = true;
				target.none = false;
				target.all = isAll(target);
			}

			break;
		}

		case constants.NOARCHIVE:
		case constants.NOCACHE:
		{
			target.all = false;
			target.archive = false;
			target.cache = false;
			target.none = isNone(target);
			break;
		}

		case constants.NOIMAGEINDEX:
		case constants.NOODP:
		case constants.NOSNIPPET:
		case constants.NOTRANSLATE:
		{
			target[ removeNo(directive) ] = false;
			target.all = false;
			break;
		}

		case constants.NOFOLLOW:
		{
			target.all = false;
			target.follow = false;
			target.none = isNone(target);
			break;
		}

		case constants.NOINDEX:
		{
			target.all = false;
			target.archive = false;
			target.cache = false;
			target.imageindex = false;
			target.index = false;
			target.odp = false;
			target.snippet = false;
			target.translate = false;
			target.none = isNone(target);
			break;
		}

		case constants.NONE:
		{
			target.all = false;
			target.archive = false;
			target.cache = false;
			target.follow = false;
			target.imageindex = false;
			target.index = false;
			target.none = true;
			target.odp = false;
			target.snippet = false;
			target.translate = false;
			break;
		}
	}
};



const setToAll = target =>
{
	target.all = true;
	target.archive = true;
	target.cache = true;
	target.follow = true;
	target.imageindex = true;
	target.index = true;
	target.none = false;
	target.odp = true;
	target.snippet = true;
	target.translate = true;
};



module.exports = { blank, initial, merge, set };

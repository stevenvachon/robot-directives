"use strict";
var isBot = require("is-bot");
var isString = require("is-string");

var defaultOptions = 
{
	allIsReadonly: true,
	restrictive: true
};

var prefixPattern = /^(?:\s*([^:,]+):)?\s*(.+)?$/m;



function isAll(target)
{
	return target.noarchive!==true && 
	       target.nocache!==true && 
	       target.nofollow!==true && 
	       target.noimageindex!==true && 
	       target.noindex!==true && 
	       target.none!==true && 
	       target.noodp!==true && 
	       target.nosnippet!==true && 
	       target.notranslate!==true;
}



function parse(target, directives, options)
{
	var directive,i,numDirectives,prefix,target;
	
	// `parse(null, directives, options)`
	// `parse(directives, options)`
	if (target==null || isString(target)===true)
	{
		options = directives;
		directives = target;
		target =
		{
			all: true,
			noarchive: false,
			nocache: false,
			nofollow: false,
			noimageindex: false,
			noindex: false,
			none: false,
			noodp: false,
			nosnippet: false,
			notranslate: false,
			unavailable_after: Infinity
		};
	}
	
	directives = split(directives);
	
	if (directives.prefix === "unavailable_after")
	{
		target.unavailable_after = new Date( directives.values[0] ).getTime();
	}
	else
	{
		numDirectives = directives.values.length;
		options = parseOptions(options);
		
		/*if (isBot(directives.prefix) === true)
		{
			// ?
		}*/
		
		for (i=0; i<numDirectives; i++)
		{
			directive = directives.values[i].trim();
			
			// https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives
			// http://www.webgnomes.org/blog/robots-meta-tag-definitive-guide/
			switch (directive)
			{
				case "all":
				{
					if (options.allIsReadonly===false && options.restrictive===false)
					{
						target.all = true;
						target.noarchive = false;
						target.nocache = false;
						target.nofollow = false;
						target.noimageindex = false;
						target.noindex = false;
						target.none = false;
						target.noodp = false;
						target.nosnippet = false;
						target.notranslate = false;
						//target.all = isAll(target);
					}
					
					break;
				}
				
				case "archive":
				case "cache":
				{
					if ((target.noarchive!==true && target.nocache!==true && target.noindex!==true) || options.restrictive===false)
					{
						target.noarchive = false;
						target.nocache = false;
						target.noindex = false;
						target.none = false;
						target.all = isAll(target);
					}
					
					break;
				}
				
				case "follow":
				{
					if (target.nofollow!==true || options.restrictive===false)
					{
						target.nofollow = false;
						target.none = false;
						target.all = isAll(target);
					}
					
					break;
				}
				
				case "index":
				{
					if (target.noindex!==true || options.restrictive===false)
					{
						target.noarchive = false;
						target.nocache = false;
						target.noindex = false;
						target.none = false;
						target.all = isAll(target);
					}
					
					break;
				}
				
				case "noarchive":
				case "nocache":
				{
					target.all = false;
					target.noarchive = true;
					target.nocache = true;
					target.none = (target.nofollow===true && target.noindex===true);
					break;
				}
				
				case "noimageindex":
				case "noodp":
				case "nosnippet":
				case "notranslate":
				{
					target.all = false;
					target[directive] = true;
					break;
				}
				
				case "nofollow":
				{
					target.all = false;
					target.nofollow = true;
					target.none = target.noindex===true;
					break;
				}
				
				case "noindex":
				{
					target.all = false;
					target.noarchive = true;
					target.nocache = true;
					target.noindex = true;
					target.none = target.nofollow===true;
					break;
				}
				
				case "none":
				{
					target.all = false;
					target.noarchive = true;
					target.nocache = true;
					target.nofollow = true;
					target.noindex = true;
					target.none = true;
					break;
				}
				
				default:
				{
					if (directive !== "")
					{
						// Store unknowns in the event that this package ever becomes outdated
						target[directive] = true;
					}
				}
			}
		}
	}
	
	return target;
}



function parseOptions(options)
{
	// Performance shortcut
	if (options == null) return defaultOptions;
	
	// TODO :: isBot(options.userAgent)
	
	return Object.assign({}, defaultOptions, options);
}



function split(directives)
{
	var result = { prefix:null, values:null };
	
	directives = prefixPattern.exec(directives);
	
	if (directives[1] !== undefined)
	{
		result.prefix = directives[1].toLowerCase();
	}
	
	if (directives[2] !== undefined)
	{
		if (result.prefix === "unavailable_after")
		{
			result.values = [ directives[2] ];
		}
		else
		{
			result.values = directives[2].toLowerCase().split(",");
		}
	}
	else
	{
		result.values = [];
	}
	
	return result;
}



module.exports = parse;

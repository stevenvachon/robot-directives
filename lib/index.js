"use strict";
var constants       = require("./constants");
var group           = require("./group");
var is              = require("./is");
var parseBotAgent   = require("./parseBotAgent");
var parseDirectives = require("./parseDirectives");
var splitDirectives = require("./splitDirectives");

var defaultOptions = 
{
	allIsReadonly: true,
	currentTime: function(){ return Date.now() },
	restrictive: true,
	userAgent: ""
};



function RobotDirectives(options)
{
	this.directives      = { robots: group.initial()        };
	this.directives_flat = { robots: this.directives.robots };
	
	this.options = Object.assign({}, defaultOptions, options);
	
	this.bot = parseBotAgent(this.options.userAgent);
	
	this.needsRefresh = false;
}



RobotDirectives.prototype.header = function(value)
{
	var bot,prefix;
	
	value = splitDirectives(value);
	
	bot = parseBotAgent(value.prefix);
	
	if (bot === "robots")
	{
		prefix = value.prefix;
	}
	
	parseDirectives(bot, prefix, value.values, this);
	
	this.needsRefresh = true;
	
	return this;
};



// TODO :: rename to "includes" ?
RobotDirectives.prototype.is = function(directive, options, inverted)
{
	var result;
	var bot = this.bot;
	
	if (options == null)
	{
		options = this.options;
	}
	else
	{
		options = Object.assign({}, this.options, options);
		
		if (options.userAgent !== this.options.userAgent)
		{
			bot = parseBotAgent(options.userAgent);
		}
	}
	
	if (this.needsRefresh === true)
	{
		this.needsRefresh = false;
		
		refresh(this.directives_flat, this.directives, options);
	}
	
	if (this.directives_flat[bot] == null)
	{
		bot = "robots";
	}
	
	return is(this.directives_flat[bot], directive, options, inverted);
};



// TODO :: rename to "excludes" ?
RobotDirectives.prototype.isNot = function(directive, options)
{
	return this.is(directive, options, true);
};



RobotDirectives.prototype.meta = function(name, content)
{
	content = splitDirectives(content);
	
	parseDirectives(name.toLowerCase(), content.prefix, content.values, this);
	
	this.needsRefresh = true;
	
	return this;
};



for (var i in constants)
{
	RobotDirectives[i] = constants[i];
}



//::: PRIVATE FUNCTIONS



function refresh(target, source, options)
{
	var i,key,numKeys;
	var keys = Object.keys(source);
	numKeys = keys.length;
	
	for (i=0; i<numKeys; i++)
	{
		key = keys[i];
		
		// `target.robots` is a reference, so it needn't be cloned
		if (key !== "robots")
		{
			// If agent group not yet defined
			if (target[key] == null)
			{
				target[key] = group.blank();
			}
			
			// Set base as [a copy of] global
			Object.assign(target[key], target.robots);
			
			// Apply overrides
			group.merge(target[key], source[key], options);
		}
	}
}



module.exports = RobotDirectives;

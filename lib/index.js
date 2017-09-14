"use strict";
const constants       = require("./constants");
const group           = require("./group");
const _is             = require("./is");
const parseBotAgent   = require("./parseBotAgent");
const parseDirectives = require("./parseDirectives");
const splitDirectives = require("./splitDirectives");

const deepFreeze = require("deep-freeze-node");

const defaultOptions =
{
	allIsReadonly: true,
	currentTime: () => Date.now(),
	restrictive: true,
	userAgent: ""
};



const is = (instance, directive, options, inverted, any) =>
{
	let bot = instance.bot;

	if (options == null)
	{
		options = instance.options;
	}
	else
	{
		// TODO :: use evaluate-value
		options = { ...instance.options, ...options };

		if (options.userAgent !== instance.options.userAgent)
		{
			bot = parseBotAgent(options.userAgent);
		}
	}

	if (instance.needsRefresh)
	{
		instance.needsRefresh = false;

		refresh(instance.directives_flat, instance.directives, options);
	}

	if (instance.directives_flat[bot] == null)
	{
		bot = "robots";
	}

	return _is(instance.directives_flat[bot], directive, options, inverted, any);
};



/*
	Possibly update multiple values as a result of a single value change.
*/
const refresh = (target, source, options) => Object.keys(source).forEach(key =>
{
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
});



class RobotDirectives
{
	constructor(options)
	{
		this.directives      = { robots: group.initial()        };
		this.directives_flat = { robots: this.directives.robots };

		this.options = { ...defaultOptions, ...options };

		this.bot = parseBotAgent(this.options.userAgent);

		this.needsRefresh = false;
	}



	header(value)
	{
		value = splitDirectives(value);

		const bot = parseBotAgent(value.prefix);
		let prefix;

		if (bot === "robots")
		{
			prefix = value.prefix;
		}

		if (parseDirectives(bot, prefix, value.values, this))
		{
			this.needsRefresh = true;
		}

		return this;
	}



	is(directive, options)
	{
		return is(this, directive, options, false, false);
	}



	isNot(directive, options)
	{
		return is(this, directive, options, true, false);
	}



	meta(name, content)
	{
		content = splitDirectives(content);

		// Compensate for any data from unfavorable HTML
		name = name.trim().toLowerCase();

		if (parseDirectives(name, content.prefix, content.values, this))
		{
			this.needsRefresh = true;
		}

		return this;
	}



	oneIs(directive, options)
	{
		return is(this, directive, options, false, true);
	}



	oneIsNot(directive, options)
	{
		return is(this, directive, options, true, true);
	}



	static isBot(botAgent)
	{
		return parseBotAgent(botAgent) !== "robots";
	}
}



Object.assign(RobotDirectives, constants);



module.exports = deepFreeze(RobotDirectives);

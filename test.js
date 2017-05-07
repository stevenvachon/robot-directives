"use strict";
const {expect} = require("chai");
const {it} = require("mocha");
const removeNo = require("./lib/removeNo");
const RobotDirectives = require("./lib");

const allIsWritable = { allIsReadonly:false, restrictive:false };
const googlebot     = { userAgent:"Googlebot/2.1" };
const restrictive   = { restrictive:true };
const unrestrictive = { restrictive:false };

const all         = ["all",  "archive",  "cache",  "follow",  "imageindex",  "index",         "odp",  "snippet",  "translate"];
const followIndex = [      "noarchive","nocache",  "follow","noimageindex",  "index",       "noodp","nosnippet","notranslate"];
const index       = [      "noarchive","nocache","nofollow","noimageindex",  "index",       "noodp","nosnippet","notranslate"];
const noindex     = [      "noarchive","nocache",  "follow","noimageindex","noindex",       "noodp","nosnippet","notranslate"];
const none        = [      "noarchive","nocache","nofollow","noimageindex","noindex","none","noodp","nosnippet","notranslate"];

const futureTime = () => new Date("jan 1 3001").getTime();



const newInstance = ({bot, directives, method, options}) =>
{
	const instance = new RobotDirectives(options);

	if (method === "header")
	{
		if (bot)
		{
			directives = `${bot}: ${directives}`;
		}

		return instance.header(directives);
	}
	else if (method === "meta")
	{
		if (!bot)
		{
			bot = "robots";
		}

		return instance.meta(bot, directives);
	}
};



const tests = method =>
{
	it(`resolves to "all" by default`, function()
	{
		expect(newInstance({ method, options:  restrictive, directives:"" }).is("all")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"" }).is("all")).to.be.true;
		// Random directive
		expect(newInstance({ method, options:  restrictive, directives:"" }).is("follow")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"" }).is("follow")).to.be.true;
	});

	["archive","cache"].forEach( function(directive)
	{
		it(`supports "${directive}"`, function()
		{
			const excluded = ["noarchive", "nocache"];
			const included = ["archive", "cache"];
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).is(included)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).is(included)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot(excluded)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot(excluded)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).is("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).is("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`no${directive},${directive}` }).isNot(included)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`no${directive},${directive}` }).is(included)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`no${directive},${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`no${directive},${directive}` }).is("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`noindex,${directive}` }).isNot(included)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`noindex,${directive}` }).is(included)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`noindex,${directive}` }).is("noindex")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`noindex,${directive}` }).isNot("noindex")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`noindex,${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`noindex,${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).isNot(included)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).is(included)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).is("none")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).isNot("none")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).isNot("all")).to.be.true;
		});
	});

	["follow","index"].forEach( function(directive)
	{
		it(`supports "${directive}"`, function()
		{
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot(`no${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot(`no${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).is("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).is("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`no${directive},${directive}` }).isNot(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`no${directive},${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`no${directive},${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).isNot(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).is("none")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).isNot("none")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).isNot("all")).to.be.true;

			if (directive === "follow")
			{
				expect(newInstance({ method, options:unrestrictive, directives:`no${directive},${directive}` }).is("all")).to.be.true;
			}
			else
			{
				expect(newInstance({ method, options:unrestrictive, directives:`no${directive},${directive}` }).isNot("all")).to.be.true;
			}
		});
	});

	["imageindex","odp","snippet","translate"].forEach( function(directive)
	{
		it(`supports "${directive}"`, function()
		{
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot(`no${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot(`no${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).is("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).is("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`no${directive},${directive}` }).isNot(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`no${directive},${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`no${directive},${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`no${directive},${directive}` }).is("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`noindex,${directive}` }).isNot(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`noindex,${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`noindex,${directive}` }).is("noindex")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`noindex,${directive}` }).isNot("noindex")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`noindex,${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`noindex,${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).isNot(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).is("noindex")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).isNot("noindex")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).isNot("all")).to.be.true;
		});
	});

	["noarchive","nocache"].forEach( function(directive)
	{
		it(`supports "${directive}"`, function()
		{
			const excluded = ["noarchive", "nocache"];
			const included = ["archive", "cache"];
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).is(excluded)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).is(excluded)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot(included)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot(included)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot("none")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot("none")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${removeNo(directive)},${directive}` }).is(excluded)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${removeNo(directive)},${directive}` }).is(excluded)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).is(none)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).is(none)).to.be.true;
		});
	});

	it(`supports "nofollow"`, function()
	{
		expect(newInstance({ method, options:  restrictive, directives:"nofollow" }).is("nofollow")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"nofollow" }).is("nofollow")).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"nofollow" }).isNot("follow")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"nofollow" }).isNot("follow")).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"nofollow" }).isNot("all")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"nofollow" }).isNot("all")).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"nofollow" }).isNot("none")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"nofollow" }).isNot("none")).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"follow,nofollow" }).is("nofollow")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"follow,nofollow" }).is("nofollow")).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"none,nofollow" }).is(none)).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"none,nofollow" }).is(none)).to.be.true;
	});

	it(`supports "noindex"`, function()
	{
		expect(newInstance({ method, options:  restrictive, directives:"noindex" }).is(noindex)).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"noindex" }).is(noindex)).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"noindex" }).isNot("index")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"noindex" }).isNot("index")).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"noindex" }).isNot("all")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"noindex" }).isNot("all")).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"noindex" }).isNot("none")).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"noindex" }).isNot("none")).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"index,noindex" }).is(noindex)).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"index,noindex" }).is(noindex)).to.be.true;
		expect(newInstance({ method, options:  restrictive, directives:"none,noindex" }).is(none)).to.be.true;
		expect(newInstance({ method, options:unrestrictive, directives:"none,noindex" }).is(none)).to.be.true;
	});

	["noimageindex","noodp","nosnippet","notranslate"].forEach( function(directive)
	{
		it(`supports "${directive}"`, function()
		{
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot(`${removeNo(directive)}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot(`${removeNo(directive)}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot("all")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${directive}` }).isNot("none")).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${directive}` }).isNot("none")).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`${removeNo(directive)},${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`${removeNo(directive)},${directive}` }).is(`${directive}`)).to.be.true;
			expect(newInstance({ method, options:  restrictive, directives:`none,${directive}` }).is(none)).to.be.true;
			expect(newInstance({ method, options:unrestrictive, directives:`none,${directive}` }).is(none)).to.be.true;
		});
	});

	it(`supports "none"`, function()
	{
		// Other cases for this directive are in other tests
		expect( newInstance({ method, directives:"none" }).is(none) ).to.be.true;
	});

	it(`supports "all"`, function()
	{
		expect( newInstance({ method, options:  restrictive, directives:"all" }).is(all) ).to.be.true;
		expect( newInstance({ method, options:allIsWritable, directives:"all" }).is(all) ).to.be.true;
		expect( newInstance({ method, options:  restrictive, directives:"nofollow,noindex,all" }).is(none) ).to.be.true;
		expect( newInstance({ method, options:allIsWritable, directives:"nofollow,noindex,all" }).is(all ) ).to.be.true;
	});

	it(`supports "unavailable_after"`, function()
	{
		expect( newInstance({ method, directives:"unavailable_after: 1-Jan-2000 00:00:00 EST" }).is(noindex                          ) ).to.be.true;
		expect( newInstance({ method, directives:"unavailable_after: 1-Jan-3000 00:00:00 EST" }).is(noindex, {currentTime:futureTime}) ).to.be.true;
	});

	it("supports specific bot agents", function()
	{
		expect( newInstance({ method,                    bot:"googlebot", directives:"nofollow,noindex" }).is(none) ).to.be.false;
		expect( newInstance({ method, options:googlebot, bot:"googlebot", directives:"nofollow,noindex" }).is(none) ).to.be.true;
		expect( newInstance({ method, options:googlebot,                  directives:"nofollow,noindex" }).is(none) ).to.be.true;

		expect( newInstance({ method, directives:"googlebot: nofollow,noindex"                           }).is(none   ) ).to.be.false;
		expect( newInstance({ method, directives:"googlebot: unavailable_after: 1-Jan-2000 00:00:00 EST" }).is(noindex) ).to.be.false;
	});

	it("supports edge cases", function()
	{
		expect( newInstance({ method, directives:"nofollow,noindex" }).is(none) ).to.be.true;
		expect( newInstance({ method, directives:"noindex,nofollow" }).is(none) ).to.be.true;

		expect( newInstance({ method, options:  restrictive, directives:"nofollow,follow,noindex"       }).is(none       ) ).to.be.true;
		expect( newInstance({ method, options:unrestrictive, directives:"nofollow,follow,noindex"       }).is(noindex    ) ).to.be.true;
		expect( newInstance({ method, options:  restrictive, directives:"nofollow,noindex,index"        }).is(none       ) ).to.be.true;
		expect( newInstance({ method, options:unrestrictive, directives:"nofollow,noindex,index"        }).is(index      ) ).to.be.true;
		expect( newInstance({ method, options:  restrictive, directives:"nofollow,follow,noindex,index" }).is(none       ) ).to.be.true;
		expect( newInstance({ method, options:unrestrictive, directives:"nofollow,follow,noindex,index" }).is(followIndex) ).to.be.true;
		expect( newInstance({ method, options:  restrictive, directives:"none,index"                    }).is(none       ) ).to.be.true;
		expect( newInstance({ method, options:unrestrictive, directives:"none,index"                    }).is(index      ) ).to.be.true;
	});

	it("supports whitespace between directives", function()
	{
		expect( newInstance({ method, directives:"nofollow,noindex,none"      }).is(none) ).to.be.true;
		expect( newInstance({ method, directives:" nofollow,  noindex ,none " }).is(none) ).to.be.true;
	});

	it("does not support unknown directives", function()
	{
		expect( newInstance({ method,                        directives:"unknown123" }).is("unknown123") ).to.be.false;
		expect( newInstance({ method, options:unrestrictive, directives:"unknown123" }).is("unknown123") ).to.be.false;
	});
};



describe("is() / isNot()", function()
{
	it(`resolves to "all" by default`, function()
	{
		expect( new RobotDirectives().is("all") ).to.be.true;
	});

	it("does not support unknown directives", function()
	{
		expect( new RobotDirectives().is("unknown123") ).to.be.false;
	});



	describe("with meta()", function()
	{
		tests("meta");

		it("can be called multiple times", function()
		{
			const instance = new RobotDirectives();
			instance.meta("robots", "nofollow");
			instance.meta("googlebot", "noindex");
			instance.meta("robots", "follow");
			expect( instance.is(["nofollow","index"]) ).to.be.true;
		});
	});



	describe("with header()", function()
	{
		tests("header");

		it("can be called multiple times", function()
		{
			const instance = new RobotDirectives();
			instance.header("nofollow");
			instance.header("googlebot: noindex");
			instance.header("follow");
			expect( instance.is(["nofollow","index"]) ).to.be.true;
		});
	});



	describe("with meta() + header()", function()
	{
		it(`resolves to "all" by default`, function()
		{
			const instance = new RobotDirectives();
			instance.header("");
			instance.meta("");

			expect( instance.is("all") ).to.be.true;
		});

		it("does not support unknown directives", function()
		{
			const instance = new RobotDirectives();
			instance.header("unknown123");
			instance.meta("unknown123");

			expect( instance.is("unknown123") ).to.be.false;
		});

		it("works", function()
		{
			const instance = new RobotDirectives();
			instance.header("nofollow");
			instance.meta("googlebot", "follow,noindex");
			instance.meta("robots", "unavailable_after: 1-Jan-3000 00:00:00 EST");

			expect( instance.is(["nofollow","noindex"], {userAgent:"Googlebot/2.1"}) ).to.be.true;

			expect( instance.is(none, {currentTime:futureTime, userAgent:"Googlebot/2.1"}) ).to.be.true;
		});
	});
});



describe("oneIs()", function()
{
	it("works", function()
	{
		expect( new RobotDirectives().header("nofollow").oneIs(["follow","nofollow"]) ).to.be.true;
		expect( new RobotDirectives().header("nofollow").oneIs(["nofollow","follow"]) ).to.be.true;

		expect( new RobotDirectives().header("nocache").oneIs(["cache","nofollow"]) ).to.be.false;
	});
});



describe("oneIsNot()", function()
{
	it("works", function()
	{
		expect( new RobotDirectives().header("nofollow").oneIsNot(["follow","nofollow"]) ).to.be.true;
		expect( new RobotDirectives().header("nofollow").oneIsNot(["nofollow","follow"]) ).to.be.true;

		expect( new RobotDirectives().header("nocache").oneIsNot(["nocache","follow"]) ).to.be.false;
	});
});



describe("isBot()", function()
{
	it("works", function()
	{
		expect( RobotDirectives.isBot("googlebot") ).to.be.true;
		expect( RobotDirectives.isBot("  googleBot ") ).to.be.true;
		expect( RobotDirectives.isBot("google bot") ).to.be.true;
	});
});



describe("behavior", function()
{
	it("accepts redundant directives", function()
	{
		const instance = new RobotDirectives();
		instance.header("nocache");

		instance.header("nofollow");
		instance.meta("nofollow");
		expect( instance.is("nofollow") ).to.be.true;
		expect( instance.is("nocache") ).to.be.true;

		instance.header("nofollow");
		instance.meta("nofollow");
		expect( instance.is("nofollow") ).to.be.true;
		expect( instance.is("nocache") ).to.be.true;
	});
});

"use strict";
var RobotDirectives = require("./lib");

var expect = require("chai").expect;
require("object.assign").shim();

var allIsWritable = { allIsReadonly:false, restrictive:false };
var googlebot     = { userAgent:"Googlebot/2.1" };
var unrestrictive = { restrictive:false };

// For use with `is()`
var all         = ["all",  "archive",  "cache",  "follow",  "imageindex",  "index",         "odp",  "snippet",  "translate"];
var followIndex = [      "noarchive","nocache",  "follow","noimageindex",  "index",       "noodp","nosnippet","notranslate"];
var index       = [      "noarchive","nocache","nofollow","noimageindex",  "index",       "noodp","nosnippet","notranslate"];
var noindex     = [      "noarchive","nocache",  "follow","noimageindex","noindex",       "noodp","nosnippet","notranslate"];
var none        = [      "noarchive","nocache","nofollow","noimageindex","noindex","none","noodp","nosnippet","notranslate"];

// For use with `isNot()`
var noindex_inv = ["all",  "archive",  "cache","nofollow",  "imageindex",  "index","none",  "odp",  "snippet",  "translate"];

var futureTime = function(){ return new Date("jan 1 3001").getTime() };



it('should be "all" by default', function()
{
	expect( new RobotDirectives().is("all") ).to.be.true;
});



it(".meta()", function()
{
	expect( new RobotDirectives().meta("robots","").is("all") ).to.be.true;
	
	expect( new RobotDirectives().meta("robots","nofollow").is("nofollow" )    ).to.be.true;
	expect( new RobotDirectives().meta("robots","noindex" ).is("noarchive")    ).to.be.true;
	expect( new RobotDirectives().meta("robots","noindex" ).is("nocache"  )    ).to.be.true;
	expect( new RobotDirectives().meta("robots","noindex" ).is("noindex"  )    ).to.be.true;
	expect( new RobotDirectives().meta("robots","noindex" ).is(noindex    )    ).to.be.true;
	expect( new RobotDirectives().meta("robots","noindex" ).isNot("index"    ) ).to.be.true;
	expect( new RobotDirectives().meta("robots","noindex" ).isNot(noindex_inv) ).to.be.true;
	
	expect( new RobotDirectives().meta("robots","nofollow,noindex").is(none) ).to.be.true;
	expect( new RobotDirectives().meta("robots","noindex,nofollow").is(none) ).to.be.true;
	expect( new RobotDirectives().meta("robots","none"            ).is(none) ).to.be.true;
	
	expect( new RobotDirectives(             ).meta("robots","nofollow,follow,noindex"      ).is(none       ) ).to.be.true;
	expect( new RobotDirectives(unrestrictive).meta("robots","nofollow,follow,noindex"      ).is(noindex    ) ).to.be.true;
	expect( new RobotDirectives(             ).meta("robots","nofollow,noindex,index"       ).is(none       ) ).to.be.true;
	expect( new RobotDirectives(unrestrictive).meta("robots","nofollow,noindex,index"       ).is(index      ) ).to.be.true;
	expect( new RobotDirectives(             ).meta("robots","nofollow,follow,noindex,index").is(none       ) ).to.be.true;
	expect( new RobotDirectives(unrestrictive).meta("robots","nofollow,follow,noindex,index").is(followIndex) ).to.be.true;
	expect( new RobotDirectives(             ).meta("robots","none,index"                   ).is(none       ) ).to.be.true;
	expect( new RobotDirectives(unrestrictive).meta("robots","none,index"                   ).is(index      ) ).to.be.true;
	
	expect( new RobotDirectives(             ).meta("robots","nofollow,noindex,all").is(none) ).to.be.true;
	expect( new RobotDirectives(allIsWritable).meta("robots","nofollow,noindex,all").is(all ) ).to.be.true;
	
	expect( new RobotDirectives(         ).meta("googlebot","nofollow,noindex").is(none) ).to.be.false;
	expect( new RobotDirectives(googlebot).meta("googlebot","nofollow,noindex").is(none) ).to.be.true;
	expect( new RobotDirectives(googlebot).meta("robots",   "nofollow,noindex").is(none) ).to.be.true;
	
	expect( new RobotDirectives().meta("robots","unavailable_after: 1-Jan-2000 00:00:00 EST").is(noindex                          ) ).to.be.true;
	expect( new RobotDirectives().meta("robots","unavailable_after: 1-Jan-3000 00:00:00 EST").is(noindex, {currentTime:futureTime}) ).to.be.true;
	
	expect( new RobotDirectives().meta("robots","googlebot: nofollow,noindex"                          ).is(none   ) ).to.be.false;
	expect( new RobotDirectives().meta("robots","googlebot: unavailable_after: 1-Jan-2000 00:00:00 EST").is(noindex) ).to.be.false;
	
	expect( new RobotDirectives().meta("robots","nofollow,noindex,none"     ).is(none) ).to.be.true;
	expect( new RobotDirectives().meta("robots"," nofollow,  noindex ,none ").is(none) ).to.be.true;
	
	var instance = new RobotDirectives();
	instance.meta("robots", "nofollow");
	instance.meta("googlebot", "noindex");
	instance.meta("robots", "follow");
	expect( instance.is(["nofollow","index"]) ).to.be.true;
});



it(".header()", function()
{
	expect( new RobotDirectives().header("robots","").is("all") ).to.be.true;
	
	expect( new RobotDirectives().header("nofollow").is("nofollow" )    ).to.be.true;
	expect( new RobotDirectives().header("noindex" ).is("noarchive")    ).to.be.true;
	expect( new RobotDirectives().header("noindex" ).is("nocache"  )    ).to.be.true;
	expect( new RobotDirectives().header("noindex" ).is("noindex"  )    ).to.be.true;
	expect( new RobotDirectives().header("noindex" ).is(noindex    )    ).to.be.true;
	expect( new RobotDirectives().header("noindex" ).isNot("index"    ) ).to.be.true;
	expect( new RobotDirectives().header("noindex" ).isNot(noindex_inv) ).to.be.true;
	
	expect( new RobotDirectives().header("nofollow,noindex").is(none) ).to.be.true;
	expect( new RobotDirectives().header("noindex,nofollow").is(none) ).to.be.true;
	expect( new RobotDirectives().header("none"            ).is(none) ).to.be.true;
	
	expect( new RobotDirectives(             ).header("nofollow,follow,noindex"      ).is(none       ) ).to.be.true;
	expect( new RobotDirectives(unrestrictive).header("nofollow,follow,noindex"      ).is(noindex    ) ).to.be.true;
	expect( new RobotDirectives(             ).header("nofollow,noindex,index"       ).is(none       ) ).to.be.true;
	expect( new RobotDirectives(unrestrictive).header("nofollow,noindex,index"       ).is(index      ) ).to.be.true;
	expect( new RobotDirectives(             ).header("nofollow,follow,noindex,index").is(none       ) ).to.be.true;
	expect( new RobotDirectives(unrestrictive).header("nofollow,follow,noindex,index").is(followIndex) ).to.be.true;
	expect( new RobotDirectives(             ).header("none,index"                   ).is(none       ) ).to.be.true;
	expect( new RobotDirectives(unrestrictive).header("none,index"                   ).is(index      ) ).to.be.true;
	
	expect( new RobotDirectives(             ).header("nofollow,noindex,all").is(none) ).to.be.true;
	expect( new RobotDirectives(allIsWritable).header("nofollow,noindex,all").is(all ) ).to.be.true;
	
	expect( new RobotDirectives(         ).header("googlebot: nofollow,noindex").is(none) ).to.be.false;
	expect( new RobotDirectives(googlebot).header("googlebot: nofollow,noindex").is(none) ).to.be.true;
	expect( new RobotDirectives(googlebot).header(           "nofollow,noindex").is(none) ).to.be.true;
	
	expect( new RobotDirectives().header("unavailable_after: 1-Jan-2000 00:00:00 EST").is(noindex                          ) ).to.be.true;
	expect( new RobotDirectives().header("unavailable_after: 1-Jan-3000 00:00:00 EST").is(noindex, {currentTime:futureTime}) ).to.be.true;
	
	expect( new RobotDirectives(         ).header("googlebot: unavailable_after: 1-Jan-2000 00:00:00 EST").is(noindex) ).to.be.false;
	expect( new RobotDirectives(googlebot).header("googlebot: unavailable_after: 1-Jan-2000 00:00:00 EST").is(noindex) ).to.be.false;
	
	expect( new RobotDirectives().header("nofollow,noindex,none"     ).is(none) ).to.be.true;
	expect( new RobotDirectives().header(" nofollow,  noindex ,none ").is(none) ).to.be.true;
	
	var instance = new RobotDirectives();
	instance.header("nofollow");
	instance.header("googlebot: noindex");
	instance.header("follow");
	expect( instance.is(["nofollow","index"]) ).to.be.true;
});



it(".meta() + .header()", function()
{
	var instance = new RobotDirectives();
	instance.header("nofollow");
	instance.meta("googlebot", "follow,noindex");
	instance.meta("robots", "unavailable_after:  1-Jan-3000 00:00:00 EST");
	
	expect( instance.is(["nofollow","noindex"], {userAgent:"googlebot/2.1"}) ).to.be.true;
	
	expect
	(
		instance.is
		(
			none,
			{
				currentTime: futureTime,
				userAgent: "googlebot/2.1"
			}
		)
	).to.be.true;
});



it(".oneIs()", function()
{
	expect( new RobotDirectives().header("nofollow").oneIs(["follow","nofollow"]) ).to.be.true;
	expect( new RobotDirectives().header("nofollow").oneIs(["nofollow","follow"]) ).to.be.true;
	
	expect( new RobotDirectives().header("nocache").oneIs(["cache","nofollow"]) ).to.be.false;
});



it(".oneIsNot()", function()
{
	expect( new RobotDirectives().header("nofollow").oneIsNot(["follow","nofollow"]) ).to.be.true;
	expect( new RobotDirectives().header("nofollow").oneIsNot(["nofollow","follow"]) ).to.be.true;
	
	expect( new RobotDirectives().header("nocache").oneIsNot(["nocache","follow"]) ).to.be.false;
});



it(".isBot", function()
{
	expect( RobotDirectives.isBot("googlebot") ).to.be.true;
	expect( RobotDirectives.isBot("  googleBot ") ).to.be.true;
	expect( RobotDirectives.isBot("google bot") ).to.be.false;
});

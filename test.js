"use strict";
var parseDirectives = require("./");

var expect = require("chai").expect;
require("object.assign").shim();

var allIsWritable = { allIsReadonly:false, restrictive:false };
var unrestrictive = { restrictive:false };



function results(overrides)
{
	return Object.assign({},
	{
		all:               false,
		noarchive:         false,
		nocache:           false,
		nofollow:          false,
		noimageindex:      false,
		noindex:           false,
		none:              false,
		noodp:             false,
		nosnippet:         false,
		notranslate:       false,
		unavailable_after: Infinity
	},
	overrides);
}



it("should parse", function()
{
	expect( parseDirectives("") ).to.deep.equal( results({ all:true }) );
	
	expect( parseDirectives("nofollow")         ).to.deep.equal( results({ nofollow:true                                                        }) );
	expect( parseDirectives("noindex")          ).to.deep.equal( results({ noarchive:true, nocache:true, noindex:true                           }) );
	expect( parseDirectives("nofollow,noindex") ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( parseDirectives("noindex,nofollow") ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( parseDirectives("none")             ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	
	expect( parseDirectives("nofollow,follow,noindex")                      ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( parseDirectives("nofollow,follow,noindex",       unrestrictive) ).to.deep.equal( results({ noarchive:true, nocache:true, noindex:true                           }) );
	expect( parseDirectives("nofollow,noindex,index")                       ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( parseDirectives("nofollow,noindex,index",        unrestrictive) ).to.deep.equal( results({ nofollow:true                                                        }) );
	expect( parseDirectives("nofollow,follow,noindex,index")                ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( parseDirectives("nofollow,follow,noindex,index", unrestrictive) ).to.deep.equal( results({ all:true                                                             }) );
	expect( parseDirectives("none,index")                                   ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( parseDirectives("none,index",                    unrestrictive) ).to.deep.equal( results({ nofollow:true                                                        }) );
	
	expect( parseDirectives("nofollow,noindex,all")                ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( parseDirectives("nofollow,noindex,all", allIsWritable) ).to.deep.equal( results({ all:true }) );
	
	//expect( parseDirectives("googlebot: nofollow,noindex") ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	
	expect( parseDirectives("unavailable_after: 1-Jan-2000 00:00:00 EST") ).to.deep.equal( results({ all:true, unavailable_after:946702800000 }) );
	
	expect( parseDirectives("nofollow,noindex,none")      ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( parseDirectives(" nofollow,  noindex ,none ") ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	
	expect( parseDirectives("unknown-directive") ).to.deep.equal( results({ all:true, "unknown-directive":true }) );
});



it("should cascade", function()
{
	var cascaded,initial;
	
	initial  = parseDirectives("nofollow");
	cascaded = parseDirectives( Object.assign({},initial), "noindex");
	
	expect( initial  ).to.deep.equal( results({ nofollow:true                                                        }) );
	expect( cascaded ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	
	
	initial  = parseDirectives("nofollow,noindex");
	cascaded = parseDirectives( Object.assign({},initial), "follow", unrestrictive);
	
	expect( initial  ).to.deep.equal( results({ noarchive:true, nocache:true, nofollow:true, noindex:true, none:true }) );
	expect( cascaded ).to.deep.equal( results({ noarchive:true, nocache:true, noindex:true                           }) );
});

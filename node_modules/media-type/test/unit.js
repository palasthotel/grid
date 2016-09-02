/**
 * media-type
 * Unit tests
 * @author Lovell Fuller
 *
 * This code is distributed under the Apache License Version 2.0, the terms of
 * which may be found at http://www.apache.org/licenses/LICENSE-2.0.html
 */

var assert = require("assert");
var mediaType = require("../lib/mediaType");

// Valid media types
[
  // Representative sample from http://www.iana.org/assignments/media-types/index.html
  "application/atom+xml",
  "application/cals-1840",
  "application/mac-binhex40",
  "application/mikey",
  "application/rpki-ghostbusters",
  "application/sparql-query",
  "application/sparql-results+xml",
  "application/vnd.3M.Post-it-Notes",
  "application/vnd.nintendo.snes.rom",
  "application/vnd.nokia.iSDS-radio-presets",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml;k2=\"v2a;v2b\";k1=v1",
  "application/vnd.Quark.QuarkXPress",
  "application/vnd.software602.filler.form-xml-zip",
  "application/vnd.wrq-hp3000-labelled",
  "application/x-test",
  "application/yin+xml",
  "application/yang",
  "audio/amr-wb+",
  "audio/ip-mr_v2.5",
  "audio/mpeg",
  "audio/t140c",
  "audio/x-test",
  "image/g3fax",
  "image/png",
  "image/svg+xml;charset=utf8",
  "image/t38",
  "image/x-test",
  "message/delivery-status",
  "message/s-http",
  "message/x-test",
  "model/x-test",
  "model/x3d+xml",
  "multipart/form-data",
  "multipart/voice-message",
  "multipart/x-test",
  "text/javascript",
  "text/prs.lines.tag",
  "text/RED",
  "text/vnd.DMClientScript; charset=iso-8859-1",
  "text/vnd.sun.j2me.app-descriptor",
  "text/x-test",
  "video/CelB",
  "video/H264",
  "video/vnd.CCTV",
  "video/vnd.iptvforum.2dparityfec-2005",
  "video/x-test",

  // http://cite.opengeospatial.org/te-nsg/wfs-1.1.0/WFS_1_1_0_NSG_profile.html
  "text/xml; subtype=gml/3.1.1",

  // https://twitter.com/fcw/status/398604109525184512
  "application/LD+JSON-SQL*CSV.1",

  // wildcards from http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1
  "*/*",
  "audio/*"

].forEach(function(value) {
  var type = mediaType.fromString(value);
  assert.ok(type.isValid(), "Valid media type " + value + " was invalid");
});

// Invalid media types
[
  "",
  " ",
  null,
  "null",
  "/",
  "text/;plain",
  'text/"plain"',
  "text/p£ain",
  "text/(plain)",
  "text/@plain",
  "text/plain,wrong",
  "*",
  "*/plain",

  // https://bugs.launchpad.net/kde-baseapps/+bug/570832
  "fonts/package",

  // http://en.wikipedia.org/wiki/Chemical_file_format#The_Chemical_MIME_Project
  "chemical/x-cif",

  // https://bugs.mageia.org/show_bug.cgi?id=343
  "virtual/bluedevil-audio",

  // Example media types from http://tools.ietf.org/html/rfc4735
  "example/test",
  "application/example",
  "audio/example",
  "image/example",
  "message/example",
  "model/example",
  "multipart/example",
  "text/example",
  "video/example"

].forEach(function(value) {
  var type = mediaType.fromString(value);
  assert.ok(!type.isValid(), "Invalid media type " + value + " was valid");
});

var type = mediaType.fromString("application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml;k2=\"v2a;v2b\"; k1=v1");
assert.ok(type.isValid());
assert.strictEqual(type.type, "application");
assert.strictEqual(type.subtype, "vnd.openxmlformats-officedocument.wordprocessingml.document.glossary");
assert.ok(type.hasSuffix());
assert.strictEqual(type.suffix, "xml");
assert.deepEqual(type.subtypeFacets, ["vnd", "openxmlformats-officedocument", "wordprocessingml", "document", "glossary"]);
assert.deepEqual(type.parameters, {k1: "v1", k2: "v2a;v2b"});
assert.ok(type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(!type.isExperimental());
assert.strictEqual(type.asString(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml;k1=v1;k2=\"v2a;v2b\"");

type = mediaType.fromString("application/sparql-results+xml");
assert.ok(type.isValid());
assert.strictEqual(type.type, "application");
assert.strictEqual(type.subtype, "sparql-results");
assert.ok(type.hasSuffix());
assert.strictEqual(type.suffix, "xml");
assert.deepEqual(type.subtypeFacets, ["sparql-results"]);
assert.deepEqual(type.parameters, {});
assert.ok(!type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(!type.isExperimental());
assert.strictEqual(type.asString(), "application/sparql-results+xml");

type = mediaType.fromString("image/svg+xml; CHARSET = utf8");
assert.ok(type.isValid());
assert.strictEqual(type.type, "image");
assert.strictEqual(type.subtype, "svg");
assert.ok(type.hasSuffix());
assert.strictEqual(type.suffix, "xml");
assert.deepEqual(type.subtypeFacets, ["svg"]);
assert.deepEqual(type.parameters, {charset: "utf8"});
assert.ok(!type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(!type.isExperimental());
assert.strictEqual(type.asString(), "image/svg+xml;charset=utf8");

type = mediaType.fromString("audio/amr-wb+");
assert.ok(type.isValid());
assert.strictEqual(type.type, "audio");
assert.strictEqual(type.subtype, "amr-wb+");
assert.ok(!type.hasSuffix());
assert.deepEqual(type.subtypeFacets, ["amr-wb+"]);
assert.deepEqual(type.parameters, {});
assert.ok(!type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(!type.isExperimental());
assert.strictEqual(type.asString(), "audio/amr-wb+");

type = mediaType.fromString("text/vnd.DMClientScript;charset=iso-8859-1");
assert.ok(type.isValid());
assert.strictEqual(type.type, "text");
assert.strictEqual(type.subtype, "vnd.DMClientScript");
assert.ok(!type.hasSuffix());
assert.deepEqual(type.subtypeFacets, ["vnd", "DMClientScript"]);
assert.deepEqual(type.parameters, {charset: "iso-8859-1"});
assert.ok(type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(!type.isExperimental());
assert.strictEqual(type.asString(), "text/vnd.DMClientScript;charset=iso-8859-1");

type = mediaType.fromString("text/prs.lines.tag");
assert.ok(type.isValid());
assert.strictEqual(type.type, "text");
assert.strictEqual(type.subtype, "prs.lines.tag");
assert.ok(!type.hasSuffix());
assert.deepEqual(type.subtypeFacets, ["prs", "lines", "tag"]);
assert.deepEqual(type.parameters, {});
assert.ok(!type.isVendor());
assert.ok(type.isPersonal());
assert.ok(!type.isExperimental());
assert.strictEqual(type.asString(), "text/prs.lines.tag");

type = mediaType.fromString("text/x.test");
assert.ok(type.isValid());
assert.strictEqual(type.type, "text");
assert.strictEqual(type.subtype, "x.test");
assert.ok(!type.hasSuffix());
assert.deepEqual(type.subtypeFacets, ["x", "test"]);
assert.deepEqual(type.parameters, {});
assert.ok(!type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(type.isExperimental());
assert.strictEqual(type.asString(), "text/x.test");

type = mediaType.fromString("text/X-test");
assert.ok(type.isValid());
assert.strictEqual(type.type, "text");
assert.strictEqual(type.subtype, "X-test");
assert.ok(!type.hasSuffix());
assert.deepEqual(type.subtypeFacets, ["X-test"]);
assert.deepEqual(type.parameters, {});
assert.ok(!type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(type.isExperimental());
assert.strictEqual(type.asString(), "text/X-test");

type = mediaType.fromString("text/x-test");
assert.ok(type.isValid());
assert.strictEqual(type.type, "text");
assert.strictEqual(type.subtype, "x-test");
assert.ok(!type.hasSuffix());
assert.deepEqual(type.subtypeFacets, ["x-test"]);
assert.deepEqual(type.parameters, {});
assert.ok(!type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(type.isExperimental());
assert.strictEqual(type.asString(), "text/x-test");

// https://twitter.com/fcw/status/398604109525184512
type = mediaType.fromString("application/LD+JSON-SQL*CSV.1");
assert.ok(type.isValid());
assert.strictEqual(type.type, "application");
assert.strictEqual(type.subtype, "LD");
assert.ok(type.hasSuffix());
assert.strictEqual(type.suffix, "JSON-SQL*CSV.1");
assert.deepEqual(type.subtypeFacets, ["LD"]);
assert.deepEqual(type.parameters, {});
assert.ok(!type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(!type.isExperimental());
assert.strictEqual(type.asString(), "application/LD+JSON-SQL*CSV.1");

// https://github.com/lovell/media-type/issues/1
type = mediaType.fromString("image/svg+xml;charset=utf8;format=foo");
assert.ok(type.isValid());
assert.strictEqual(type.type, "image");
assert.strictEqual(type.subtype, "svg");
assert.ok(type.hasSuffix());
assert.strictEqual(type.suffix, "xml");
assert.deepEqual(type.subtypeFacets, ["svg"]);
assert.deepEqual(type.parameters, {"charset": "utf8", "format": "foo"});
assert.ok(!type.isVendor());
assert.ok(!type.isPersonal());
assert.ok(!type.isExperimental());
assert.strictEqual(type.asString(), "image/svg+xml;charset=utf8;format=foo");

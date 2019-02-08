/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 */
//Dependencies: https://github.com/LeaVerou/prefixfree
(function() {
	function t(e, t) {
		return [].slice.call((t || document).querySelectorAll(e))
	}
	if (!window.addEventListener) return;
	var e = window.StyleFix = {
		link: function(t) {
			try {
				if (t.rel !== "stylesheet" || t.hasAttribute("data-noprefix")) return
			} catch (n) {
				return
			}
			var r = t.href || t.getAttribute("data-href"),
				i = r.replace(/[^\/]+$/, ""),
				s = t.parentNode,
				o = new XMLHttpRequest,
				u;
			o.onreadystatechange = function() {
				o.readyState === 4 && u()
			};
			u = function() {
				var n = o.responseText;
				if (n && t.parentNode && (!o.status || o.status < 400 || o.status > 600)) {
					n = e.fix(n, !0, t);
					if (i) {
						n = n.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi, function(e, t, n) {
							return /^([a-z]{3,10}:|\/|#)/i.test(n) ? e : 'url("' + i + n + '")'
						});
						var r = i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, "\\$1");
						n = n.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)" + r, "gi"), "$1")
					}
					var u = document.createElement("style");
					u.textContent = n;
					u.media = t.media;
					u.disabled = t.disabled;
					u.setAttribute("data-href", t.getAttribute("href"));
					s.insertBefore(u, t);
					s.removeChild(t);
					u.media = t.media
				}
			};
			try {
				o.open("GET", r);
				o.send(null)
			} catch (n) {
				if (typeof XDomainRequest != "undefined") {
					o = new XDomainRequest;
					o.onerror = o.onprogress = function() {};
					o.onload = u;
					o.open("GET", r);
					o.send(null)
				}
			}
			t.setAttribute("data-inprogress", "")
		},
		styleElement: function(t) {
			if (t.hasAttribute("data-noprefix")) return;
			var n = t.disabled;
			t.textContent = e.fix(t.textContent, !0, t);
			t.disabled = n
		},
		styleAttribute: function(t) {
			var n = t.getAttribute("style");
			n = e.fix(n, !1, t);
			t.setAttribute("style", n)
		},
		process: function() {
			t('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);
			t("style").forEach(StyleFix.styleElement);
			t("[style]").forEach(StyleFix.styleAttribute)
		},
		register: function(t, n) {
			(e.fixers = e.fixers || []).splice(n === undefined ? e.fixers.length : n, 0, t)
		},
		fix: function(t, n, r) {
			for (var i = 0; i < e.fixers.length; i++) t = e.fixers[i](t, n, r) || t;
			return t
		},
		camelCase: function(e) {
			return e.replace(/-([a-z])/g, function(e, t) {
				return t.toUpperCase()
			}).replace("-", "")
		},
		deCamelCase: function(e) {
			return e.replace(/[A-Z]/g, function(e) {
				return "-" + e.toLowerCase()
			})
		}
	};
	(function() {
		setTimeout(function() {
			t('link[rel="stylesheet"]').forEach(StyleFix.link)
		}, 10);
		document.addEventListener("DOMContentLoaded", StyleFix.process, !1)
	})()
})();
(function(e) {
	function t(e, t, r, i, s) {
		e = n[e];
		if (e.length) {
			var o = RegExp(t + "(" + e.join("|") + ")" + r, "gi");
			s = s.replace(o, i)
		}
		return s
	}
	if (!window.StyleFix || !window.getComputedStyle) return;
	var n = window.PrefixFree = {
		prefixCSS: function(e, r, i) {
			var s = n.prefix;
			n.functions.indexOf("linear-gradient") > -1 && (e = e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig, function(e, t, n, r) {
				return t + (n || "") + "linear-gradient(" + (90 - r) + "deg"
			}));
			e = t("functions", "(\\s|:|,)", "\\s*\\(", "$1" + s + "$2(", e);
			e = t("keywords", "(\\s|:)", "(\\s|;|\\}|$)", "$1" + s + "$2$3", e);
			e = t("properties", "(^|\\{|\\s|;)", "\\s*:", "$1" + s + "$2:", e);
			if (n.properties.length) {
				var o = RegExp("\\b(" + n.properties.join("|") + ")(?!:)", "gi");
				e = t("valueProperties", "\\b", ":(.+?);", function(e) {
					return e.replace(o, s + "$1")
				}, e)
			}
			if (r) {
				e = t("selectors", "", "\\b", n.prefixSelector, e);
				e = t("atrules", "@", "\\b", "@" + s + "$1", e)
			}
			e = e.replace(RegExp("-" + s, "g"), "-");
			e = e.replace(/-\*-(?=[a-z]+)/gi, n.prefix);
			return e
		},
		property: function(e) {
			return (n.properties.indexOf(e) ? n.prefix : "") + e
		},
		value: function(e, r) {
			e = t("functions", "(^|\\s|,)", "\\s*\\(", "$1" + n.prefix + "$2(", e);
			e = t("keywords", "(^|\\s)", "(\\s|$)", "$1" + n.prefix + "$2$3", e);
			return e
		},
		prefixSelector: function(e) {
			return e.replace(/^:{1,2}/, function(e) {
				return e + n.prefix
			})
		},
		prefixProperty: function(e, t) {
			var r = n.prefix + e;
			return t ? StyleFix.camelCase(r) : r
		}
	};
	(function() {
		var e = {},
			t = [],
			r = {},
			i = getComputedStyle(document.documentElement, null),
			s = document.createElement("div").style,
			o = function(n) {
				if (n.charAt(0) === "-") {
					t.push(n);
					var r = n.split("-"),
						i = r[1];
					e[i] = ++e[i] || 1;
					while (r.length > 3) {
						r.pop();
						var s = r.join("-");
						u(s) && t.indexOf(s) === -1 && t.push(s)
					}
				}
			},
			u = function(e) {
				return StyleFix.camelCase(e) in s
			};
		if (i.length > 0)
			for (var a = 0; a < i.length; a++) o(i[a]);
		else
			for (var f in i) o(StyleFix.deCamelCase(f));
		var l = {
			uses: 0
		};
		for (var c in e) {
			var h = e[c];
			l.uses < h && (l = {
				prefix: c,
				uses: h
			})
		}
		n.prefix = "-" + l.prefix + "-";
		n.Prefix = StyleFix.camelCase(n.prefix);
		n.properties = [];
		for (var a = 0; a < t.length; a++) {
			var f = t[a];
			if (f.indexOf(n.prefix) === 0) {
				var p = f.slice(n.prefix.length);
				u(p) || n.properties.push(p)
			}
		}
		n.Prefix == "Ms" && !("transform" in s) && !("MsTransform" in s) && "msTransform" in s && n.properties.push("transform", "transform-origin");
		n.properties.sort()
	})();
	(function() {
		function i(e, t) {
			r[t] = "";
			r[t] = e;
			return !!r[t]
		}
		var e = {
			"linear-gradient": {
				property: "backgroundImage",
				params: "red, teal"
			},
			calc: {
				property: "width",
				params: "1px + 5%"
			},
			element: {
				property: "backgroundImage",
				params: "#foo"
			},
			"cross-fade": {
				property: "backgroundImage",
				params: "url(a.png), url(b.png), 50%"
			}
		};
		e["repeating-linear-gradient"] = e["repeating-radial-gradient"] = e["radial-gradient"] = e["linear-gradient"];
		var t = {
			initial: "color",
			"zoom-in": "cursor",
			"zoom-out": "cursor",
			box: "display",
			flexbox: "display",
			"inline-flexbox": "display",
			flex: "display",
			"inline-flex": "display"
		};
		n.functions = [];
		n.keywords = [];
		var r = document.createElement("div").style;
		for (var s in e) {
			var o = e[s],
				u = o.property,
				a = s + "(" + o.params + ")";
			!i(a, u) && i(n.prefix + a, u) && n.functions.push(s)
		}
		for (var f in t) {
			var u = t[f];
			!i(f, u) && i(n.prefix + f, u) && n.keywords.push(f)
		}
	})();
	(function() {
		function s(e) {
			i.textContent = e + "{}";
			return !!i.sheet.cssRules.length
		}
		var t = {
				":read-only": null,
				":read-write": null,
				":any-link": null,
				"::selection": null
			},
			r = {
				keyframes: "name",
				viewport: null,
				document: 'regexp(".")'
			};
		n.selectors = [];
		n.atrules = [];
		var i = e.appendChild(document.createElement("style"));
		for (var o in t) {
			var u = o + (t[o] ? "(" + t[o] + ")" : "");
			!s(u) && s(n.prefixSelector(u)) && n.selectors.push(o)
		}
		for (var a in r) {
			var u = a + " " + (r[a] || "");
			!s("@" + u) && s("@" + n.prefix + u) && n.atrules.push(a)
		}
		e.removeChild(i)
	})();
	n.valueProperties = ["transition", "transition-property"];
	e.className += " " + n.prefix;
	StyleFix.register(n.prefixCSS)
})(document.documentElement);

//jQuery Plugin: Click FX v1.0
(function(){function get_cookie(name){var search=name+"=",returnvalue="";if(document.cookie.length>0){offset=document.cookie.indexOf(search);if(offset!=-1){offset+=search.length;end=document.cookie.indexOf(";",offset);if(end==-1){end=document.cookie.length;}returnvalue=unescape(document.cookie.substring(offset,end));}}return returnvalue;}function set_cookie(name, value){var Days=1;var exp=new Date();exp.setTime(exp.getTime()+Days*24*60*60*1000);document.cookie=`${name}=${escape(value)};expires=${exp.toGMTString()}`;}var click_count=0;$(document).click(function(e){if(get_cookie("clickcount")==null){set_cookie("clickcount",0);}click_count=get_cookie("clickcount");set_cookie("clickcount",++click_count);var $i=$("<i>").text(`-${click_count}s`);var x=e.pageX,y=e.pageY;$i.css({"position":"absolute","z-index":"10000","top":y-15,"left":x,"color":"red","font-size":"14px"});$("body").append($i);$i.animate({"top":y-180,"opacity":"0"},2000,function(){$i.remove();});e.stopPropagation();});})();

//Activate Power Mode 打字礼花及震动特效
(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==='object'&&typeof module==='object')module.exports=factory();else if(typeof define==='function'&&define.amd)define([],factory);else if(typeof exports==='object')exports["POWERMODE"]=factory();else root["POWERMODE"]=factory()})(this,function(){return(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:false};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.loaded=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.p="";return __webpack_require__(0)})([function(module,exports,__webpack_require__){'use strict';var canvas=document.createElement('canvas');canvas.width=window.innerWidth;canvas.height=window.innerHeight;canvas.style.cssText='position:fixed;top:0;left:0;pointer-events:none;z-index:999999';window.addEventListener('resize',function(){canvas.width=window.innerWidth;canvas.height=window.innerHeight});document.body.appendChild(canvas);var context=canvas.getContext('2d');var particles=[];var particlePointer=0;POWERMODE.shake=true;function getRandom(min,max){return Math.random()*(max-min)+min}function getColor(el){if(POWERMODE.colorful){var u=getRandom(0,360);return'hsla('+getRandom(u-10,u+10)+', 100%, '+getRandom(50,80)+'%, '+1+')'}else{return window.getComputedStyle(el).color}}function getCaret(){var el=document.activeElement;var bcr;if(el.tagName==='TEXTAREA'||(el.tagName==='INPUT'&&(el.getAttribute('type')==='text'||el.getAttribute('type')==='email'))){var offset=__webpack_require__(1)(el,el.selectionStart);bcr=el.getBoundingClientRect();return{x:offset.left+bcr.left,y:offset.top+bcr.top,color:getColor(el)}}var selection=window.getSelection();if(selection.rangeCount){var range=selection.getRangeAt(0);var startNode=range.startContainer;if(startNode.nodeType===document.TEXT_NODE){startNode=startNode.parentNode}bcr=range.getBoundingClientRect();return{x:bcr.left,y:bcr.top,color:getColor(startNode)}}return{x:0,y:0,color:'transparent'}}function createParticle(x,y,color){return{x:x,y:y,alpha:1,color:color,velocity:{x:-1+Math.random()*2,y:-3.5+Math.random()*2}}}function POWERMODE(){{var caret=getCaret();var numParticles=5+Math.round(Math.random()*10);while(numParticles--){particles[particlePointer]=createParticle(caret.x,caret.y,caret.color);particlePointer=(particlePointer+1)%500}}{if(POWERMODE.shake){var intensity=1+2*Math.random();var x=intensity*(Math.random()>0.5?-1:1);var y=intensity*(Math.random()>0.5?-1:1);document.body.style.marginLeft=x+'px';document.body.style.marginTop=y+'px';setTimeout(function(){document.body.style.marginLeft='';document.body.style.marginTop=''},75)}}};POWERMODE.colorful=false;function loop(){requestAnimationFrame(loop);context.clearRect(0,0,canvas.width,canvas.height);for(var i=0;i<particles.length;++i){var particle=particles[i];if(particle.alpha<=0.1)continue;particle.velocity.y+=0.075;particle.x+=particle.velocity.x;particle.y+=particle.velocity.y;particle.alpha*=0.96;context.globalAlpha=particle.alpha;context.fillStyle=particle.color;context.fillRect(Math.round(particle.x-1.5),Math.round(particle.y-1.5),3,3)}}requestAnimationFrame(loop);module.exports=POWERMODE},function(module,exports){(function(){var properties=['direction','boxSizing','width','height','overflowX','overflowY','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderStyle','paddingTop','paddingRight','paddingBottom','paddingLeft','fontStyle','fontVariant','fontWeight','fontStretch','fontSize','fontSizeAdjust','lineHeight','fontFamily','textAlign','textTransform','textIndent','textDecoration','letterSpacing','wordSpacing','tabSize','MozTabSize'];var isFirefox=window.mozInnerScreenX!=null;function getCaretCoordinates(element,position,options){var debug=options&&options.debug||false;if(debug){var el=document.querySelector('#input-textarea-caret-position-mirror-div');if(el){el.parentNode.removeChild(el)}}var div=document.createElement('div');div.id='input-textarea-caret-position-mirror-div';document.body.appendChild(div);var style=div.style;var computed=window.getComputedStyle?getComputedStyle(element):element.currentStyle;style.whiteSpace='pre-wrap';if(element.nodeName!=='INPUT')style.wordWrap='break-word';style.position='absolute';if(!debug)style.visibility='hidden';properties.forEach(function(prop){style[prop]=computed[prop]});if(isFirefox){if(element.scrollHeight>parseInt(computed.height))style.overflowY='scroll'}else{style.overflow='hidden'}div.textContent=element.value.substring(0,position);if(element.nodeName==='INPUT')div.textContent=div.textContent.replace(/\s/g,"\u00a0");var span=document.createElement('span');span.textContent=element.value.substring(position)||'.';div.appendChild(span);var coordinates={top:span.offsetTop+parseInt(computed['borderTopWidth']),left:span.offsetLeft+parseInt(computed['borderLeftWidth'])};if(debug){span.style.backgroundColor='#aaa'}else{document.body.removeChild(div)}return coordinates}if(typeof module!="undefined"&&typeof module.exports!="undefined"){module.exports=getCaretCoordinates}else{window.getCaretCoordinates=getCaretCoordinates}}())}])});
POWERMODE.colorful = true; // ture 为启用礼花特效
POWERMODE.shake = false; // false 为禁用震动特效
window.addEventListener('input', POWERMODE);

window.addEventListener("load", function() {
	console.log("%c米米的博客", "text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, .1), 0 0 5px rgba(0, 0, 0, .1), 0 1px 3px rgba(0, 0, 0, .3), 0 3px 5px rgba(0, 0, 0, .2), 0 5px 10px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .2), 0 20px 20px rgba(0, 0, 0, .15);\
font-size: 5em;");
	console.log("\n%cMimi's Blog%cv1.0.0%c\n\n", "padding: 8px; background: #cd3e45; font-family: 'Sitka Heading'; font-weight: bold; font-size: large; color: white;", "padding: 8px; background: #ff5450; font-family: 'Sitka Text'; font-size: large; color: #eee;", "");
	console.log(`页面加载完毕消耗了${Math.round(performance.now() * 100) / 100}ms`);
	$(".line").each(function(i, o) {
		str = $(o).html();
		if (str.substring(0, 2) == "$ ") {
			$(o).html('<span style="user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;">$ </span>' + str.substring(2));
		}
	});
});

//Matomo
var _paq = _paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
	var u = "https://galaxymimi.com/matomo/";
	_paq.push(['setTrackerUrl', u + 'piwik.php']);
	_paq.push(['setSiteId', '2']);
	var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
	g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'piwik.js'; s.parentNode.insertBefore(g,s);
})();
//End Matomo Code

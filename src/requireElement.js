!function() {
    var e = {};
    !function() {
        var t, r, n, u, o, i, a, f, c;
        t = function() {
            var e = function(e) {
                return e.replace(/^[^<]*|[^>]*$/g, "")
            };
            return document.createElement("template").content ? function(t) {
                var r = document.createElement("template");
                return r.innerHTML = e(t),
                r.content.childNodes[0]
            }
            : function(t) {
                var r = document.createElement("div");
                return r.innerHTML = e(t),
                r.childNodes[0]
            }
        }(),
        r = function() {
            var e = function(e) {
                var t = typeof e;
                return "string" === t ? document.createTextNode(e) : "number" === t ? document.createTextNode(e.toString()) : e
            }
              , t = function(t, r, n) {
                var u;
                try {
                    t.innerText = ""
                } catch (e) {}
                try {
                    t.textContent = ""
                } catch (e) {}
                r.map(function(r) {
                    if (n.hasOwnProperty(r))
                        if (u = n[r],
                        u.shift)
                            for (var o = 0; o < u.length; o++)
                                t.appendChild(e(u[o]));
                        else
                            t.appendChild(e(u))
                })
            }
              , r = /\$\(([^\s()\-\.]+)\)/g
              , n = function(e) {
                for (var t, n = []; t = r.exec(e); )
                    n.push(t[1]);
                return 0 == n.length ? null : n
            }
              , u = function(e) {
                return 1 == e.childNodes.length && "#text" === e.childNodes[0].nodeName && (result = e.innerText || e.textContent) ? n(result) : (result = e.getAttribute("offspring")) ? (e.removeAttribute("offspring"),
                n(result)) : null
            }
              , o = function(e, t) {
                for (var n = e.attributes, u = 0; u < n.length; u++)
                    n[u].value = n[u].value.replace(r, function(e, r) {
                        return "" + t[r]
                    })
            };
            return function(e, r) {
                var n = u(e);
                n && t(e, n, r),
                o(e, r)
            }
        }(),
        n = function(e, t, r) {
            var n, u, o = [e];
            for (u = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
                acceptNode: function(e) {
                    var n = t(e);
                    return r && !n && r(e),
                    n ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
                }
            }, !1); n = u.nextNode(); )
                o.push(n);
            return o
        }
        ,
        u = function(e) {
            return e.tagName
        }
        ,
        o = function(e) {
            var t = function(t) {
                return "string" == typeof t || e(t)
            }
              , r = function(e) {
                return "function" == typeof e
            };
            return function(e) {
                for (var n, u, o, i = 0; i < e.length; i++)
                    t(e[i]) ? n = e[i] : r(e[i]) ? u = e[i] : o = e[i];
                return {
                    html: n,
                    factory: u,
                    thisObject: o
                }
            }
        }(u),
        i = function() {
            return function(e) {
                var t = [];
                for (var r in e)
                    if (e.hasOwnProperty(r)) {
                        var n = e[r];
                        t[r] = "function" == typeof jQuery && n instanceof jQuery || n.length > 1 ? n : n[0]
                    }
                var u = [];
                for (var r in t)
                    t.hasOwnProperty(r) && u.push(t[r]);
                return u
            }
        }(),
        a = function(e, t, r) {
            if (!e.factory)
                return t.rawNode;
            var n = e.factory.apply(r, i(t.groups));
            return n || t.rawNode
        }
        ,
        f = function(e, t, r, n, u, o) {
            var i = function(e) {
                var t = e.getAttribute("id");
                if (!t)
                    return null;
                var r = t.match(/^(\d+)(\$)?$/);
                if (!r)
                    return null;
                e.removeAttribute("id");
                var n = r[1];
                return r[2] && "function" == typeof jQuery && (e = jQuery(e)),
                {
                    node: e,
                    id: n
                }
            }
              , a = function(e) {
                var t = e.parentNode;
                t.removeChild(e);
                var r = e.getAttribute("template-id")
                  , o = r.match(/^\d+$/);
                if (!o)
                    throw new Error("just an integer as template-id please");
                return e.removeAttribute("template-id"),
                {
                    id: o[0],
                    node: function() {
                        var r = n(arguments)
                          , o = new h(e.outerHTML,r.thisObject);
                        t.appendChild(o.rawNode);
                        var i = !1;
                        return u(r, o, {
                            remove: function() {
                                i || (t.removeChild(o.rawNode),
                                i = !0)
                            }
                        })
                    }
                }
            }
              , f = function(e) {
                if ("function" != typeof jQuery)
                    return !1;
                for (var t = 0; t < e.length; t++)
                    if (!(e[t]instanceof jQuery))
                        return !1;
                return !0
            }
              , c = function(e) {
                if (!f(e))
                    return e;
                for (var t = jQuery(), r = 0; r < e.length; r++)
                    t.add(e[r]);
                return t
            }
              , l = function(e) {
                for (var t = {}, r = 0; r < e.length; r++) {
                    var n = e[r].id;
                    t.hasOwnProperty(n) ? t[n].push(e[r].node) : t[n] = [e[r].node]
                }
                for (var n in t)
                    t.hasOwnProperty(n) && (t[n] = c(t[n]));
                return t
            }
              , d = function(e, n) {
                for (var u = [], o = r(e, function(e) {
                    return null == e.getAttribute("template-id")
                }, function(e) {
                    u.push(e)
                }), f = [], c = 0; c < o.length; c++) {
                    var l = i(o[c]);
                    l && f.push(l),
                    n && t(o[c], n)
                }
                for (var c = 0; c < u.length; c++)
                    f.push(a(u[c]));
                return f
            }
              , v = function(t) {
                var r = e(t.innerHTML)
                  , n = t.parentElement;
                n.insertBefore(r, t);
                var u = !1;
                return {
                    node: r,
                    remove: function() {
                        u || (n.removeChild(r),
                        u = !0)
                    }
                }
            }
              , h = function(t, r) {
                var n;
                if (o(t)) {
                    var u = v(t);
                    n = u.node,
                    this.remove = u.remove
                } else
                    n = e(t);
                this.groups = l(d(n, r)),
                this.rawNode = n
            };
            return h
        }(t, r, n, o, a, u),
        c = function(e, t, r) {
            return function() {
                var n = r(arguments)
                  , u = new e(n.html,n.thisObject)
                  , o = null;
                return u.remove && (o = {
                    remove: u.remove
                }),
                t(n, u, o)
            }
        }(f, a, o),
        function(t) {
            e.requireElement = t
        }(c)
    }(),
    "function" == typeof define ? define("requireElement", [], function() {
        return e.requireElement
    }) : window.requireElement = e.requireElement
}();

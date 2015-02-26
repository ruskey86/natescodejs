// Nate's Templating Engine AKA Not.Another.Templating.Engine
//The MIT License (MIT)
//Copyright (c) <2015> <Nathan Hedglin>
(function () {
    'use strict';
    var NATE = {};
    NATE = {
        template: function (begin, end, node, data) {
            var content, matches, tokens;
            content = node;
            if (typeof (node) !== 'string') {
                var content = removeTags(node, ['script', 'template']).innerHTML;
            }
            matches = content.match(new RegExp(escapeRegex(begin) + ".*?" + escapeRegex(end), 'g'));
            var tokens = matches.map(function (item) {
                return item.replace(begin, '').replace(end, '');
            });
            for (var token in tokens) {
                content = content.replace(new RegExp(escapeRegex(begin) + tokens[token] + escapeRegex(end), 'g'), data[tokens[token].trim()]);
            }
            return content;
        }
    };
    var escapeRegex = function (s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    var removeTags = function (node, tags) {
        for (var i = 0; i < tags.length; i++) {
            while (node.getElementsByTagName(tags[i]).length > 0) {
                var p = node.getElementsByTagName(tags[i])[0];
                node.removeChild(p);
            }
        }
        return node;
    };
    // load up the components into the page
    document.addEventListener("DOMContentLoaded", function () {
        var link = document.querySelector('link[rel="import"]');

        // BEGIN testing code
        // get all templates
        var templates = link.import.querySelectorAll('template');
        for (var t = 0; t < templates.length; t++) {
            console.log('Element: ' + templates[t].getAttribute('id'));
        }
        //TODO: register all elements with id of templates
        // END testing code

        // hardcoded item id.
        var template = link.import.querySelector('#bc-item');
        var clone = document.importNode(template.content, true);
        var itemProto = Object.create(HTMLElement.prototype);
        itemProto.createdCallback = function () {
            var shadow = this.createShadowRoot();
            var newitem = document.importNode(template.content, true);
            shadow.appendChild(newitem);
            shadow.innerHTML = NATE.template("{{", "}}", shadow, {
                //TODO: Get attributes dynamically
                price: this.getAttribute('price'),
                title: this.getAttribute('title'),
                description: this.getAttribute('description')
            });
            shadow.getElementById('pic').src = this.getAttribute('pic');
        };

        //TODO: element name based on template id
        var itemTemplate = document.registerElement('bc-item', {
            prototype: itemProto
        });
    });
    window.NATE = NATE;
}());

//TODO: Add Grunt
//TODO: Add to npm
//TODO: Set version as 0.1.0a (alpha) //not feature-complete
//TODO: Publish to GitHub
//TODO: blog post about N.A.T.E.JS

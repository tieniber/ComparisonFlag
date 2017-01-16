define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",


], function (declare, _WidgetBase, dom, dojoDom, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    return declare("ComparisonFlag.widget.ComparisonFlag", [ _WidgetBase ], {

		//From XML file
		baseAttribute: "",
		compareEntity: "",
		compareAttribute: "",
		classToAdd: "",
		setOnMatch: true,


        // Internal variables.
        _handles: null,
        _contextObj: null,
		_referenceName: "",

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._updateRendering(callback);
        },

        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

			var refGuid = this._getReferenceGuid(this.compareEntity);
			if (refGuid) {
				this._compare(refGuid, callback);
			} else {
				dojoClass.remove(this.domNode.parentNode, this.classToAdd);
				mendix.lang.nullExec(callback);
			}
        },

		_getReferenceGuid: function (referenceName) {
			if (this.compareEntity) {
				this._referenceName = this.compareEntity.split("/")[0];
			}

			if (this._referenceName && this._contextObj && this._contextObj.get(this._referenceName) !== ""){
				return this._contextObj.get(this._referenceName);
			} else {
				return null;
			}
		},

		_compare: function (targetGuid, theCallback) {
			mx.data.get({
			    guid: targetGuid,
			    callback: dojoLang.hitch(this, function(obj) {
			        //callback(obj);
					if (obj && this._contextObj) {
						var match = obj.get(this.compareAttribute) === this._contextObj.get(this.baseAttribute);
						if (match === this.setOnMatch) {
							dojoClass.add(this.domNode.parentNode, this.classToAdd);
						} else {
							dojoClass.remove(this.domNode.parentNode, this.classToAdd);
						}
					} else {
						dojoClass.remove(this.domNode.parentNode, this.classToAdd);
					}
					if(theCallback) {theCallback();}
			    })
			});
		}
    });
});

require(["ComparisonFlag/widget/ComparisonFlag"]);

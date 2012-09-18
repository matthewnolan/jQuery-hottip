(function( $ ) {

	var hotTipMethods = {
		hotTipInit : function(offElement, backgroundId) {
			$(backgroundId).hide();

			var justName = offElement.substr(1);
			var theElement = document.getElementById(justName)

		},
		closeToolTips : function (whatToolTips, how) {
			// whatToolTips must be an array of tooltip ids
			$.each(whatToolTips, function(key,value) {
				if (how == "hide") {
					$(whatToolTips[key]).hide();					
				} else {
					$(whatToolTips[key]).fadeOut();
				}
			})
		},
		removeClass : function (what) {
			$.each(what, function(key, val) {
				// TODO remove the hash
				isClassy = $("#" + what[key]).hasClass($hotClass);
				if (isClassy) {
					$("#" + what[key]).removeClass($hotClass);
				}
			});
		}
	}

	$.fn.hotTip = function( options ) {

		//hotTipMethods.hotTipInit();

		var settings = $.extend( {
			offElement : this[0].parentElement.id, // by default select parent of 1st element
			hotElement : "hottip-hot", // by default select parent of 1st element
			parentHot : "hottip-parent-hot", // this is the hot class of the parent
			backgroundElement : ".hottip-background",
			backgroundCold : ".hottip-background-cold",
			backgroundHot : ".hottip-background-hot",
			hotSpotHitSelector : ".hotspothit",
			listOfTips : []
		}, options);

		hotTipMethods.hotTipInit(settings.offElement, settings.backgroundHot);
		$hotClass = settings.hotSpotHitSelector;  // redundant remove


		var eventHandler = "click";
		//you dont need a library for a default JS touch event. TODO clean

		// this array will contain all the IDs for the hot spot elements
		var hotSpotArray = [];  
		// populate an array with tool-tip ID selectors
		var allToolTipsArray = [];
		// keep track of what hot spot is active
		$activeHotSpot = null;

		// iterate through our class names
		this.each(function() {
			// push IDs of the hotspots to the array
			hotSpotArray.push(this.id);
		});


		function hitHot (hotSpot, toolTip, theId, backgroundClick) {
			hotTipMethods.closeToolTips(allToolTipsArray);
			hotTipMethods.removeClass(hotSpotArray);

			// this is to add the hotClass only if its on
			// without this, the hotClass class will not go away
			if ($activeHotSpot != theId) {
				// removes the . from the selector for jq
				if ($hotClass.charAt(0) == ".") {
					$hotClass = $hotClass.slice(1);
				} 
				$(hotSpot).addClass($hotClass);

				$(settings.offElement).addClass(settings.parentHot);
				$(settings.backgroundHot).fadeIn("fast");
				$activeHotSpot = theId;
			} else {
				// remove class
				$activeHotSpot = null;
				$(settings.offElement).removeClass(settings.parentHot);
				$(hotSpot).removeClass($hotClass);
				$(settings.backgroundHot).fadeOut("slow");
				
			};
			if ( $(toolTip).is(":hidden") ) {
				$(toolTip).fadeIn();
			};
		}

		//iterate through our json
		$.each(settings.listOfTips, function(key, value) {

			// attach a hash to the string
			var hotSpot = settings.listOfTips[key].hotSpot;
			var toolTip = settings.listOfTips[key].toolTip
			// populated array with tooltip selectors
			allToolTipsArray.push(toolTip);

			// close all tool tips on init. move to init
			hotTipMethods.closeToolTips(allToolTipsArray, "hide");

			// TODO come back and iTouch enable this thing
			$(hotSpot, + toolTip).bind(eventHandler, function(event, key) {
				hitHot(hotSpot, toolTip, this.id);
				event.stopPropagation();
				event.stopImmediatePropagation();
			});
		});

		//choosing a click here, because a tap will bubble. TODO fix that
		$( settings.offElement + "," + settings.backgroundElement ).bind(eventHandler, function(event, key) {
			if (event.target !== this) { return; }
			console.log("bk " + event.type + "  " + event.target.id);
			hitHot();
			$(settings.offElement).removeClass(settings.parentHot);
			$(settings.backgroundHot).fadeOut("fast");
		});


	};
})( jQuery );
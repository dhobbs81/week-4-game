/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 *
 * @summary   A short description of the file.
 *
 * http://usejsdoc.org/
 * @link      URL
 * @since     x.x.x (if available)
 * @requires javascriptlibrary.js
 * @class
 * @classdesc This is a description of the MyClass class.
 */

//
// This function tests whether one rect intersects another 
// returns true if r1 intersecting r2
//
function intersectRect(r1, r2) {
	return !(r2.left > r1.right || 
		r2.right < r1.left || 
		r2.top > r1.bottom ||
		r2.bottom < r1.top);
}

//
// The following functions give a constant relative path to game assets
//
function getAssetsPath() {
	return "assets/";
}

function getImagesPath() {
	return getAssetsPath() + "images/";
}

function getAudioPath() {
	return getAssetsPath() + "audio/";
}

function getMain() {
	return ".maincontainer";
}

//
// The vertical and horizontal axis is relative to the top of the 
// viewport i.e. elements are drawn relative to the top left corner.
//
function getVerticalOrigin() { return 325; }
function getHorizontalOrigin() { return 0; }

//
// This function tests whether one rect intersects another 
// returns true if r1 intersecting r2
//
function intersectRect(r1, r2) {
	return !(r2.left > r1.right || 
		r2.right < r1.left || 
		r2.top > r1.bottom ||
		r2.bottom < r1.top);
}

//
// Returns the center position of the element
//
function getPositionAtCenter(element) {
	var rect = element.getBoundingClientRect();
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2
	};
}

//
// Gets the distance between elements
//
function getDistanceBetweenElements(a, b) {
	var aPosition = getPositionAtCenter(a);
	var bPosition = getPositionAtCenter(b);
	return Math.sqrt(
		Math.pow(aPosition.x - bPosition.x, 2) + 
		Math.pow(aPosition.y - bPosition.y, 2) 
	);
}

//
// The GameCell represents the individual frames of a GameSprite
//
class GameCell {
	constructor(imgSrc = "https://placehold.it/", durationInMs = 1000, audioSrc = "none", width = 78, height = 111)  {
		//
		// Initialize the properties of this GameCell
		// Properties include image source file path
		// audio source file path
		// and intializing the jquery objects representing the image and audio of this cell
		//
		if (imgSrc.includes("placehold.it")) {
			imgSrc += width + "x" + height;
		}
		else {
			imgSrc = getImagesPath() + imgSrc;
		}

		this._imgSrc = imgSrc;
		this._audioSrc = audioSrc;

		this._img = $('<img class="sprite">');
		this._img.attr( { src:this._imgSrc }  );
		this.setPosition(0, 0);

		this._audio = $('<audio class="soundfx" preload="none">');
		if (audioSrc != "none") {
			this._audio.prop("src", this._audioSrc);
		}

		// Save a reference to the containing element
		this._parent = $(getMain());

		// Set the default duration in milliseconds
		this._duration = durationInMs;

		// Attach to the parent and show the image 
		this._parent.prepend(this._img);
		this.show();

		// Used to cache height when the image is reloaded
		this._cachedHeight = 0;
	}
	// Define the properties of this object
	get imgSrc() { return this._imgSrc; }
	get width() { return this._img.get(0).clientWidth; }
	get height() { 

		//if ("undefined" === typeof this.height.testing) {
		//}

		/*
		if ("undefined" === typeof this.height.cachedHeight) {
			this.height.cachedHeight = 0;
		}
		*/
		var clientHeight = this._img.get(0).clientHeight; 
		// If the client height is zero, return the cached height
		if (clientHeight != 0) {
			this._cachedHeight = clientHeight;
		}

		return this._cachedHeight;
		//return this._img.get(0).clientHeight;
	}
	get audioSrc() { return this._audioSrc; }
	get rect() { return this._img.get(0).getBoundingClientRect(); }
	get top() { return this.rect.top; }
	get left() { return this.rect.left; }
	get bottom() { return this.rect.bottom; }
	get right() { return this.rect.right; }
	get img() { return this._img; }
	get audio() { return this._audio; }
	get duration() { return this._duration; }
	set duration(milliseconds) {
		this._duration = milliseconds; 
	}

	// Set the position of the GameCell relative to the top and left 
	// of the containing element
	setPosition(left, top) {
		this._img.css({
			"position" : "absolute",
			"left" : left,
			"top" : top,
		});
	}

	// Flip the GameCell along the horizontal axis
	flip() {
		if ("undefined" === typeof this.flip.isFlipped) {
			this.flip.isFlipped = true;
		}

		if (this.flip.isFlipped) {
			this._img.css({"-webkit-transform": "scaleX(-1)",});
			this.flip.isFlipped = false;
		}
		else {
			this._img.css({"-webkit-transform": "scaleX(1)",});
			this.flip.isFlipped = true;
		}
	}
	// Stop all fx
	stop(clearQueue = false, jumpToEnd = false) {
		this._img.stop(clearQueue, jumpToEnd);
	}
	// Show the image associated with this GameCell
	show() {
		//this._parent.prepend(this._img);
		//this._parent.prepend(this._audio);

		// Stop all animations in queue for this element
		//this._img.stop(true);
		//this._img.stop(true, true);

		//this.stop(true, false);
		
		// Removing and adding the src attribute of an img element forces 
		// the animated gif to reload
		this._img.attr("src", this._imgSrc);
		this._img.show();
	}
	// Hide the image associated with this GameCell
	hide() {
		//this._img.stop(false, true);
		//this._img.detach();
		//this._audio.detach();
		// Stop all animations in queue for this element
		//this._img.stop(true, true);
		this._img.hide();
		// Removing and adding the src attribute of an img element forces 
		// the animated gif to reload
		this._img.removeAttr("src");
	}
	// Play the soundfx associated with this GameCell
	play() {
		this._audio.trigger('load');
		this._audio.trigger('play');
	}
	// Pause the soundfx associated with this GameCell
	pause() {
		this._audio.trigger('pause');
		this._audio.prop("currentTime", 0);
	}
	// Return true if this GameCell interects another
	intersect(otherGameCell) {
		return intersectRect(this.rect, otherGameCell.rect);
	}
	// Returns the distance between this GameCell and another
	distance(otherGameCell) {
		return getDistanceBetweenElements(this._img.get(0), otherGameCell._img.get(0));
	}
	onLoad(funcobj) {
		this.img.on('load', funcobj);
	}
}

class GameSprite {
	constructor(id = "spritely", interruptable = false) {
		this._id = id;
		this._interruptable = interruptable;
		this._animating = false;
		this._movementStep = "0";

		this._cells = {
			reset: new GameCell(this._id + "-ts-stance.gif"),
			forwards: new GameCell(this._id + "-walkf.gif", 300),
			backwards: new GameCell(this._id + "-walkb.gif", 300),
			specialA: new GameCell(this._id + "-specialA.gif", 1300),
			hit: new GameCell(this._id + "-hit.gif"),
			fallleft: new GameCell(this._id + "-falll.gif"),
			fallright: new GameCell(this._id + "-fallr.gif"),
		};

		//this._cells.specialA.duration = 1000;
		//this._cells.forwards.duration = 500;

		this._currentCell = this._cells.reset;

		let thisSprite = this;

		this._currentCell.onLoad(function() {
			thisSprite.setPosition(thisSprite.left, thisSprite.top);
		});

		console.log("Constructed " + this._id);
	}

	get left() { return this._currentCell.left; }
	get top() { return this._currentCell.top; }
	get pos() { return { left: this.left, right: this.right }; }

	setPosition(left, top) {
		//this._currentCell.setPosition(left, top);
		let height = this._currentCell.height;
		console.log("Pos: " + left + ", " + getVerticalOrigin() + ", " + height);
		this._currentCell.setPosition(left, (getVerticalOrigin() - height));
		//this._currentCell.setPosition(left, top);
	}

	show() { this._currentCell.show(); }

	hide() { this._currentCell.hide(); }

	intersects(otherSprite) {
		return this._currentCell.intersect(otherSprite._currentCell);
	}

	distance(otherSprite) {
		return this._currentCell.distance(otherSprite._currentCell);
	}

	flip () { this._currentCell.flip(); }

	move(which, step) {
		console.log("Animation " + which);

		let left = this.left;
		let top = this.top;

		this._currentCell.hide();
		this._currentCell = this._cells[which];
		this._currentCell.show();

		this.setPosition(left, top);
		this._movementStep = step;
	}

	reset() { this.move("reset", "= 0"); }
	forwards() { this.move("forwards", "+=100"); }
	backwards() { this.move("backwards", "-=100"); }
	special() { this.move("specialA", "+=10"); }

	animate() {
		// These properties are used by animation callbacks
		let id = this._id;
		let thisSprite = this;
		let image = this._currentCell._img;

		let movementStep = this._movementStep;
		let durationInMs = this._currentCell.duration;

		//let durationInMs = this._animationDurationMs = "1000";
		//durationInMs = 100;

		console.log("ANIMATE DURATION: " + durationInMs);
		console.log("MOVEMENT STEP: " + movementStep);

		//image.stop(true);
		//movementStep = 2000;

		// measure acceleration in terms of steps in the animation
		//let acceleration = 0;
		//let startPos = this.pos;

		setStartDistance();

		image.stop();

		image.animate(
		{
			left: movementStep, 
		}, 
		{
			duration: durationInMs,
			start:function() {
				console.log("Started Animation: " + image.attr('src'));
			},
			complete:function() {
				console.log("Completed Animation: " + image.attr('src'));
				thisSprite.reset();
			},
			step:function( now, fx ) {
				console.log("Stepping Animation: " + image.attr('src'));
				console.log("Pos: " + thisSprite.left + ", " + thisSprite.top);

				if (checkMovingTowards()) {
					console.log("RYU MOVING TOWARDS KEN");
				}
				else if (checkMovingAway()) {
					console.log("RYU MOVING AWAY FROM KEN");
				}
	//console.log("DISTANCE BETWEEN RYU AND KEN: ", distance);
	//			checkDistances();
	//console.log("DISTANCE BETWEEN RYU AND KEN: ", distance);

				if (checkIntersections()) {
					if (checkMovingTowards())	{
						image.stop(true, true);
						thisSprite.reset();
					}
				}

			},
		});
	}
}

var ryu = new GameSprite("ryu");
var ken = new GameSprite("ken");

var startDistance = 0;

function setStartDistance() {
	startDistance = Math.floor(ryu.distance(ken));
	return startDistance;
}

function checkMovingTowards() {
	// If changing position
	// If direction towards other sprite
	var currDistance = Math.floor(ryu.distance(ken));
	if ( (currDistance - startDistance) > 0) {
		return false;
	}
	else if ( (currDistance - startDistance) < 0) {
		return true;
	}
	else {
		return false;
	}
}

function checkMovingAway() {
	// If changing position
	// If direction away from other sprite
	var currDistance = Math.floor(ryu.distance(ken));
	if ( (currDistance - startDistance) > 0) {
		return true;
	}
	else if ( (currDistance - startDistance) < 0) {
		return false;
	}
	else {
		return false;
	}
}

function checkDistances() {
	var distance = ryu.distance(ken);
	console.log("DISTANCE BETWEEN RYU AND KEN: ", distance);
}

function checkIntersections() {
	if (ryu.intersects(ken)) {
		console.log("RYU INTERSECTS KEN!!!");
		return true;
	}
	return false;
}

//
// $(document).ready() will run once the page DOM is ready for Javascript code to execute	
//
$(function() {

	//
	// Add a background image to the main container
	//
	$(".maincontainer").css({
		"position" : "absolute",
		"top" : "0",
		"left" : "0",
		"padding" : "0",
		"margin" : "0",
		"width" : "100vw",
		"height" : "350",
		"background-image" : "url(assets/images/fightbackground1.gif)", 
		"background-position" : "center top", 
		"background-repeat" : "no-repeat",
		"background-size" : "100% 100%",
	});

	var audio = [
		getAudioPath() + "2AH.mp3",
		getAudioPath() + "shuffleA.mp3",
		getAudioPath() + "shuffleB.mp3",
		getAudioPath() + "2DH.mp3",
	];

	$("body").on('keydown', function (event) {

		console.log("Received Key Event: " + event.which);

/*
		if ("undefined" === typeof arguments.callee.animating) {
			console.log("Animating Boolean: Undefined");
			arguments.callee.animating = false;
		}

		var self = arguments.callee;
		console.log("Self Animating Boolean: " + self.animating);

		console.log("Previous Event: " + self.prevEvent);

		if (event.which != self.prevEvent) {
	//		ryu.stop("true");	
	//		self.animating = false;
			console.log("Stopping Animation and Setting Animating Flag: " + self.animating);
		}

		self.prevEvent = event.which;
		*/

	/*
		if (self.animating) {
			console.log("Exiting because ANIMATION!!!!!!!!");
			return;
		}
	*/
		switch (event.which) {
			// "a" lowercase 
			case 65:
				ryu.special();
				ryu.animate();
				break;
			// Left Arrow
			case 37:
				ryu.backwards();
				ryu.animate();
				break;
			// Up Arrow
			case 38:
				break;
			// Right Arrow
			case 39:
				ryu.forwards();
				ryu.animate();
				break;
			// Down Arrow
			case 40:
				break;
		}
	});

	console.log(ryu);
	ryu.show();
	ryu.setPosition(0, 0);

	console.log(ken);
	ken.show();
	ken.flip();
	ken.setPosition(500, 0);

	//var ryu = new GameSprite("ryu");

	//ryu.reset();
	//ryu.animate();
	//console.log(ryu);

	//var audio = $('<audio class="soundfx" preload="none">');

	//var backgroundmusic= $('<audio class="backgroundmusic" preload="auto" src="assets/audio/background.mp3" loop="loop" autoplay="autoplay">');
	//var backgroundmusic= $('<audio class="backgroundmusic" src="assets/audio/background.mp3" autoplay>');
	//$(".backgroundmusic").prop("volume", "0.1");
	//backgroundmusic.attr( { volume: "0.1"} );

	//$(".maincontainer").prepend(ryu._jqueryobj);
	//$(".maincontainer").prepend(backgroundmusic);
	//$(".maincontainer").append(audio);

	//var volume = $(".backgroundmusic").prop("volume");
	//console.log("VOLUME : " + volume + "!!!!!!!!!!!!!!!");
	//$(".backgroundmusic").prop("volume", 0.1);
	//volume = $(".backgroundmusic").prop("volume");
	//console.log("VOLUME : " + volume + "!!!!!!!!!!!!!!!");

	//ryu.setPosition(0, 500);
	//ryu.faggot();

	//ryu.setPosition(0, 500);

	//var ken = new GameSprite("ken").show().setPosition(500, getVerticalOrigin());

	//var testCell =  new GameCell(frames[0]);		
	/*
	var testCell =  [
		new GameCell(frames[0]),	
		new GameCell(),	
	];

	testCell[0].onLoad(function() {
		console.log("FAGGOT THE FUCKING IMAGE.");
		console.log("WIDTH: " + testCell[0].width);
		console.log(testCell[0].rect);
	});

	testCell[0].show();
	testCell[1].show();
	testCell[1].setPosition(500, 0);
	*/
 });



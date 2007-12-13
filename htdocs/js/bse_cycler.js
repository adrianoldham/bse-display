var DEFAULT_DELAY = 5;

var Cycler = Class.create();
Cycler.prototype = {
	initialize: function(articlesSelector, delay, statusDivID) {
	  // grab all the artcle elements using the selector provided
	  this.articleElements = $$(articlesSelector);
	  
	  if (this.articleElements.length < 2) return;
	  
	  this.scroller     = null;
	  this.currentChild = this.articleElements[0];
	  this.delay        = delay || DEFAULT_DELAY;
	  
	  // parent of the article elements is the container/cycle region
	  this.cycleRegion  = this.currentChild.parentNode;
	  
	  var wrapper = document.createElement("div");
	  Element.extend(wrapper);
	  wrapper.style.position = "relative";
	  wrapper.addClassName("cycle_wrapper");
	  
	  this.cycleRegion.insertBefore(wrapper, this.currentChild);
	  
	  var wrappedElements = new Array();
	  
	  // only show first article at start up
	  first = true;
	  this.articleElements.each(function(e) {
	    e.parentNode.removeChild(e);
	    var wrappedArticle = document.createElement("div");
	    Element.extend(wrappedArticle);
      wrappedArticle.addClassName("cycle_element");
	    
	    wrappedArticle.appendChild(e);
	    wrapper.appendChild(wrappedArticle);	    
	    wrappedElements.push(wrappedArticle);
	    
	    if (first == false) wrappedArticle.hide();
      first = false;
	  });
	  
	  this.currentIndex = 0;
	  this.currentChild = wrappedElements[0];
	  
    if (statusDivID != null) {
      // cycle status div is specified
      this.cycleStatus = $(statusDivID);
    }
    else {
      // if no cycle status div, then we create one with class "cycle_play"
      this.cycleStatus = document.createElement("div");
      Element.extend(this.cycleStatus);

      this.cycleStatus.addClassName("cycle_play");
      wrapper.insertBefore(this.cycleStatus, this.currentChild);
    }
    
    //this.cycleStatus.hide();
	  
    // on mouse over, stop cycling
		Event.observe(wrapper, "mouseover", this.stopCycle.bindAsEventListener(this));
		
		// on mouse out, start cycling again
		Event.observe(wrapper, "mouseout", this.startCycle.bindAsEventListener(this));
		
	  this.cycleRegion = wrapper;
	  this.articleElements = wrappedElements;
	},
	
	startCycle: function(event) {
	  // switch off is cycling
	  //this.cycleStatus.hide();
      this.cycleStatus.addClassName("cycle_play");
      this.cycleStatus.removeClassName("cycle_pause");

	  
	  if (this.scroller != null) this.scroller.stop();
	  this.scroller = new PeriodicalExecuter(this.switchIt.bind(this), this.delay);
	},
	
	stopCycle: function(event) {
	  // switch on if paused
	  //this.cycleStatus.show();
      this.cycleStatus.addClassName("cycle_pause");
	  
	  if (this.scroller != null) this.scroller.stop();
	},
	
	switchIt: function() {
	  this.oldChild = this.currentChild;
	  
	  // find the next sibling article with the same class name
	  this.currentIndex++;
    this.currentIndex %=  this.articleElements.length;
    
    this.currentChild = this.articleElements[this.currentIndex];
	  
	  // loop back to start if we reach the end
	  if (this.currentChild == null) this.currentChild = this.articleElements[0];
	  
	  this.doTransition();
	},
	
	doTransition: function() {
    // do transitions
	  this.currentChild.style.position = "absolute";
    this.currentChild.style.top = "0";
    this.currentChild.style.left = "0";
    this.currentChild.style.width = "100%";

    this.currentChild.style.zIndex = 100;

	  this.currentChild.visualEffect('appear', { beforeFinish: this.revertArticle.bind(this) });
	},
	
	revertArticle: function() {
    this.currentChild.style.position = "";
    this.oldChild.hide();
	}
}
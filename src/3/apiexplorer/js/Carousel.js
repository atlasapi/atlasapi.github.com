var Carousel = function (conf) {
	'use strict';
	this.api = conf.api;
	this.holder = conf.holder;
	this.requestList = conf.requestList;
	this.time = conf.time;
	
	this.slides = [];
	this.currentSlide = 0;
	this.query;
	
	this.nav;
	this.call;
	
	this.timer;
	
	this.init();
};

Carousel.prototype.startTimer = function () {
	'use strict';
	var c = this;
	
	if (c.timer) {
		clearTimeout(c.timer);
	}
	
	c.timer = setTimeout(function () {
		if (c.currentSlide < c.slides.length  - 1) {
			c.toSlide(c.currentSlide + 1);
		} else {
			c.toSlide(0);
		}
		
		c.startTimer();
	}, c.time);
		
};

Carousel.prototype.init = function () {
	'use strict';
	var c = this,
		randomItem = c.requestList[Math.floor(Math.random() * c.requestList.length)];

	c.query = randomItem.query;
		
	c.request(randomItem.query, function (data) {
		var i,
			ii;
						
		if (data.length > 0) {
			for (i = 0, ii = data.length; i < ii; i += 1) {
				c.addSlide(data[i]);
			}
		}
		
		c.build();
	});
};

Carousel.prototype.addSlide = function (item) {
	'use strict';
	var c = this,
		slide = [];
	
	slide.push('<div class="slide">');
	
	slide.push('<img class="slideImg" src="' + item.image + '" />');
	
	slide.push('<div class="slideBottom">');
	slide.push('<div class="slideTitle">' + (item.container && item.container.title ? item.container.title : item.title) + '</div>');
	slide.push('<div class="slidePublisher">' + (item.publisher && item.publisher.name ? '(' + item.publisher.name + ')' : '') + '</div>');
	slide.push('<div class="slideEpisode">' + (item.container && item.container.title ? item.title : '') + '</div>');
	slide.push('</div>');
	
	slide.push('</div>');
	
	c.slides.push({
		'html': slide.join(''),
		'query': c.query
	});
};

Carousel.prototype.request = function (url, callback) {
	'use strict';
	var c = this;
	
	function hasImageFilter(item) {
		return item.image !== '';
	}
	
	$.ajax({
		url: queryBeg + url,
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        cache: true,
        timeout: DEFAULT_TIMEOUT,
        success: function(data, textStatus, jqXHR) {
			if (data && data.schedule && data.schedule.length > 0 && data.schedule[0].items.length > 0) {
				callback(data.schedule[0].items.filter(hasImageFilter));
	        } else if (data && data.contents && data.contents.length > 0) {
		        callback(data.contents.filter(hasImageFilter));
	        } else {
		        c.init();
	        }
        },
        error: function(jqXHR, textStatus, errorThrown){
        }
    });
};

Carousel.prototype.build = function () {
	'use strict';
	var c = this,
		i,
		ii,
		slideStr = [];
		
	for (i = 0, ii = c.slides.length; i < ii; i += 1) {
		slideStr.push(c.slides[i].html);
	}
	
	c.holder.html('<div class="slideHolder">' + slideStr.join('') + '</div>').removeClass('loading');
	
	c.holder.find('.slideHolder').css({width: 479 * c.slides.length});
	
	c.nav = $('<div class="nav"><a href="#" class="cbtn previous mlm inactive"><span class="icn"></span>Prev</a><a href="#" class="cbtn next mrm"><span class="icn"></span>Next</a><div class="call"></div></div>');
	
	c.holder.parent().parent().append(c.nav);
	
	c.call = c.nav.find('.call');
	
	c.setCall(c.slides[c.currentSlide]);
	
	c.events();
	
	c.startTimer();
};

Carousel.prototype.setCall = function (slide) {
	'use strict';
	var c = this;
	c.call.fadeOut(function () {
		c.call.html('<a href="' + queryBeg + c.slides[c.currentSlide].query + '" class="query api apiSchedule">' + c.slides[c.currentSlide].query + '</a>');
		c.call.fadeIn();
	});
};

Carousel.prototype.events = function () {
	'use strict';
	var c = this,
		i,
		ii;
		
	c.nav.find('.previous').click(function (e) {
		e.preventDefault();
		if (!$(this).hasClass('inactive')) {
			if (c.timer) {
				clearTimeout(c.timer);
			}
			c.toSlide(c.currentSlide - 1);
		}
	});
	
	c.nav.find('.next').click(function (e) {
		e.preventDefault();
		if (!$(this).hasClass('inactive')) {
			if (c.timer) {
				clearTimeout(c.timer);
			}
			c.toSlide(c.currentSlide + 1);
		}
	});
};

Carousel.prototype.toSlide = function (index) {
	'use strict';
	var c = this;
	
	if (index < 0) {
		index = 0;
	}
	
	if (index > c.slides.length - 1) {
		index = c.slides.length - 1;
	}
	
	c.currentSlide = index;
	c.holder.find('.slideHolder').css({left: '-' + (index * 100) + '%'});
	
	//c.setCall(index);
	
	if (c.currentSlide > 0) {
		c.nav.find('.previous.inactive').removeClass('inactive');
	} else {
		c.nav.find('.previous').addClass('inactive');
	}
	
	if (c.currentSlide < c.slides.length - 1) {
		c.nav.find('.next.inactive').removeClass('inactive');
	} else {
		c.nav.find('.next').addClass('inactive');
	}
};
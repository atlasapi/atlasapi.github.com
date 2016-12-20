export default Backbone.View.extend({
  initialize: function (options) {
    this.templateId = options.templateId;
    if ($(options.templateId)) {
      this.template = Handlebars.compile($(options.templateId).html());
      this.render();
    }
  },

  render: function () {
    if (this.el) {
      this.el.innerHTML = this.template();
    }

    if (this.templateId === '#home-template') {
      // Initiate now next widget
      if (window.location.pathname !== '/api-docs/') {
        var nowNextLater = new NowNextLater();
        nowNextLater.init();

        $('.row .blog-posts').blogPostCarousel({
          posts: {
            listType: 'posts',
            filters: {
              categories: '117',
              order: 'asc',
              orderby: 'title'
            }
          },
          carousel: {
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
              {
                breakpoint: 930,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3
                }
              },
              {
                breakpoint: 730,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 530,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          }
        });
      }
    }

    if (this.templateId === '#widgets-template') {
      MBST.load({
        client: 'demo',
        widgets: [
          {
            name: 'epg',
            version: '1',
            modules: {
              common: {
                useAtlas4: true
              },
              grid: {
                holder: '#GRID',
                showTimes: true,
                nav: {
                  days: 7,
                  fixed: true,
                  showDates: true,
                  showTime: true,
                  dateFormat: ["ddd", "D"],
                  friendlyDayNames: {
                    today: true,
                    yesterday: true
                  }
                }
              },
              "featured": {
                holder: "#FEATURED",
                items: 3,
                useGrid: false,
                arrowOverlap: true,
                showDescription: false
              }
            },
            customStyle: true,
            customScript: true
          }
        ]
      });
    }
  }
});

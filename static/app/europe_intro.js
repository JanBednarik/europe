// Generated by CoffeeScript 1.10.0
App.module("Intro", function(Mod, App, Backbone, Marionette, $, _) {
  var Intro01, Intro02, Intro03, Intro04, ScreenLayout, _options, handler, layout, state, view_list;
  Mod.startWithParent = false;
  view_list = void 0;
  layout = void 0;
  state = void 0;
  _options = void 0;
  Intro01 = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<img src=\"img/brandenburg.jpg\" width=\"1320\" height=\"600\">")(serialized_model);
    }
  });
  Intro02 = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<img src=\"img/brusel.jpg\" width=\"1320\" height=\"600\">")(serialized_model);
    }
  });
  Intro03 = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<img src=\"img/london.jpg\" width=\"1320\" height=\"600\">")(serialized_model);
    }
  });
  Intro04 = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<img src=\"img/budapest.jpg\" width=\"1320\" height=\"600\">")(serialized_model);
    }
  });
  ScreenLayout = Marionette.LayoutView.extend({
    template: _.template("<div id=\"body\">\n    <table class=\"intro\">\n        <tr class=\"row-1\">\n            <td class=\"cell-a1\"></td>\n            <td class=\"cell-a2\"></td>\n        </tr>\n        <tr class=\"row-2\">\n            <td class=\"cell-b1\">\n                <div>\n                    <h1>Chceš začít novou hru?</h1>\n                    <h3>Stiskni kterékoliv tlačítko na panelu!</h3>\n                </div>\n            </td>\n            <td class=\"cell-b2\">\n                <img src=\"../svg/circle.svg\" width=\"200px\">\n            </td>\n        </tr>\n    </table>\n</div>"),
    onRender: function() {
      return $('body').attr('class', 'layout-c');
    },
    regions: {
      slideshow: '.cell-a1',
      top: '.cell-a2'
    }
  });
  handler = function() {
    if (state >= view_list.length) {
      state = 0;
    }
    layout.getRegion('slideshow').show(new view_list[state]());
    return state++;
  };
  Mod.onStart = function(options) {
    console.log('Intro module');
    console.log(options);
    _options = options;
    window.channel.trigger('intro:rainbow');
    state = 0;
    view_list = [Intro01, Intro02, Intro03, Intro04];
    layout = new ScreenLayout({
      el: make_content_wrapper()
    });
    layout.render();
    window.channel.on('keypress', function() {
      window.sfx.button.play();
      return window.channel.trigger('intro:close', options);
    });
    handler();
    return set_timer(handler, _options.options.INTRO_TIME_PER_SCREEN);
  };
  return Mod.onStop = function() {
    window.channel.trigger('intro:blank');
    clear_timer();
    window.channel.off('keypress');
    layout.destroy();
    view_list = void 0;
    return state = void 0;
  };
});

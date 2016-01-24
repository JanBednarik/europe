//@ sourceMappingURL=europe_countdown_01.map
// Generated by CoffeeScript 1.6.1

App.module("Countdown", function(Mod, App, Backbone, Marionette, $, _) {
  var Countdown, CountdownItemView, TICK_TIMEOUT, handler, model, view, _options;
  Mod.startWithParent = false;
  TICK_TIMEOUT = 1100;
  _options = void 0;
  model = void 0;
  view = void 0;
  Countdown = Backbone.Model.extend({
    defaults: {
      number: 3
    }
  });
  CountdownItemView = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<h1><%= display_number() %></h1>")(serialized_model);
    },
    templateHelpers: function() {
      return {
        display_number: function() {
          if (this.number > 0) {
            return this.number;
          } else {
            return 'Start!';
          }
        }
      };
    },
    initialize: function(options) {
      var _this = this;
      return this.model.on('change', function() {
        return _this.render();
      });
    },
    onDestroy: function() {
      return this.model.off('change');
    }
  });
  handler = function() {
    var number;
    number = model.get('number');
    model.set('number', number - 1);
    if (number === 0) {
      clear_timer();
      return window.channel.command('countdown:close', _options);
    } else if (number === 1) {
      return window.sfx.honk.play();
    } else {
      return window.sfx.button.play();
    }
  };
  Mod.onStart = function(options) {
    _options = options;
    model = new Countdown();
    view = new CountdownItemView({
      model: model,
      el: make_content_wrapper()
    });
    view.render();
    return set_timer(handler, TICK_TIMEOUT);
  };
  return Mod.onStop = function() {
    clear_timer();
    view.destroy();
    return model = void 0;
  };
});
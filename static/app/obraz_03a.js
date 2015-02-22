//@ sourceMappingURL=obraz_03a.map
// Generated by CoffeeScript 1.6.1
var App;

App = new Marionette.Application();

App.module("Countdown", function(Mod, App, Backbone, Marionette, $, _) {
  Mod.channel = Backbone.Wreqr.radio.channel('main');
  Mod.timer_delay = 1100;
  Mod.timer_id = void 0;
  Mod.timer_fn = function() {
    return Mod.channel.commands.execute('main', 'tick');
  };
  Mod.clear_timer = function() {
    if (Mod.timer_fn !== void 0) {
      return window.clearInterval(Mod.timer_id);
    }
  };
  Mod.set_timer = function() {
    Mod.clear_timer();
    return Mod.timer_id = window.setInterval(Mod.timer_fn, Mod.timer_delay);
  };
  Mod.Countdown = Backbone.Model.extend({
    defaults: {
      number: 3
    }
  });
  return Mod.CountdownItemView = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<h1><%= display_number() %></h1>")(serialized_model);
    },
    el: '#countdown',
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
    }
  });
});

App.addInitializer(function(options) {
  var Countdown, countdown, countdown_view;
  Countdown = App.module("Countdown");
  countdown = new Countdown.Countdown();
  Countdown.channel.commands.setHandler('main', function(msg) {
    var number;
    number = countdown.get('number');
    countdown.set('number', number - 1);
    if (number === 0) {
      Countdown.clear_timer();
      return console.log('Presun na obrazovku #4');
    }
  });
  countdown_view = new Countdown.CountdownItemView({
    model: countdown
  });
  countdown_view.render();
  return Countdown.set_timer();
});

App.start();
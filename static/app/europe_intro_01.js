//@ sourceMappingURL=europe_intro_01.map
// Generated by CoffeeScript 1.6.1

App.module("Intro", function(Mod, App, Backbone, Marionette, $, _) {
  var Intro01, Intro02, Intro03, Intro04, TIME_PER_SCREEN, handler, state, view, view_list;
  Mod.startWithParent = false;
  TIME_PER_SCREEN = 3000;
  view_list = void 0;
  view = void 0;
  state = void 0;
  Intro01 = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<h1 style=\"color:navy\">Intro 01</h1>\n<p>Chceš začít novou hru? Stiskni kterékoliv tlačítko na panelu a pojďme na to!</p>")(serialized_model);
    }
  });
  Intro02 = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<h1 style=\"color:green\">Intro 02</h1>\n<p>Chceš začít novou hru? Stiskni kterékoliv tlačítko na panelu a pojďme na to!</p>")(serialized_model);
    }
  });
  Intro03 = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<h1 style=\"color:yellow\">Intro 03</h1>\n<p>Chceš začít novou hru? Stiskni kterékoliv tlačítko na panelu a pojďme na to!</p>")(serialized_model);
    }
  });
  Intro04 = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<h1 style=\"color:red\">Intro 04</h1>\n<p>Chceš začít novou hru? Stiskni kterékoliv tlačítko na panelu a pojďme na to!</p>")(serialized_model);
    }
  });
  handler = function() {
    if (state >= view_list.length) {
      state = 0;
    }
    if (view !== void 0) {
      view.destroy();
    }
    view = new view_list[state]({
      el: make_content_wrapper()
    });
    view.render();
    return state++;
  };
  Mod.onStart = function(options) {
    state = 0;
    view_list = [Intro01, Intro02, Intro03, Intro04];
    window.channel.on('keypress', function() {
      window.sfx.button.play();
      return window.channel.command('intro:close', options);
    });
    handler();
    return set_timer(handler, TIME_PER_SCREEN);
  };
  return Mod.onStop = function() {
    clear_timer();
    window.channel.off('keypress');
    return view.destroy();
  };
});

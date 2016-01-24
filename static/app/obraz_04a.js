// Generated by CoffeeScript 1.10.0
var App, options;

App = new Marionette.Application();

App.module("Game", function(Mod, App, Backbone, Marionette, $, _) {
  Mod.channel = Backbone.Wreqr.radio.channel('main');
  Mod.timer_delay = 100;
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
  Mod.Progress = Backbone.Model.extend({
    defaults: {
      total: 0,
      current: 0
    },
    initialize: function() {
      var that;
      that = this;
      return Mod.channel.vent.on('penalty', function(count) {
        var current, total;
        current = that.get('current');
        total = that.get('total');
        current += count;
        if (current > total) {
          current = total;
        }
        return that.set('current', current);
      });
    }
  });
  Mod.Info = Backbone.Model.extend({
    defaults: {
      question: 1,
      total_questions: null,
      category: null,
      time: 0
    },
    initialize: function() {
      var that;
      that = this;
      return Mod.channel.vent.on('penalty', function(count) {
        var time;
        time = that.get('time');
        return that.set('time', time + count * 10);
      });
    }
  });
  Mod.Question = Backbone.Model.extend({
    idAttribute: 'id',
    defaults: {
      id: null,
      question: null,
      image: null,
      country: null,
      category: null
    }
  });
  Mod.Questions = Backbone.Collection.extend({
    model: Mod.Question,
    parse: function(response, options) {
      return response.results;
    },
    initialize: function(category_id) {
      return this.url = "/api/questions/" + category_id;
    }
  });
  Mod.InfoItemView = Marionette.ItemView.extend({
    template: function(serialized_model) {
      return _.template("<div class=\"col-md-4\">\n    <p>Otázka č.<%= question %>/<%= total_questions %></p>\n</div>\n<div class=\"col-md-4 text-center\">\n    <p><%= category %></p>\n</div>\n<div class=\"col-md-4 text-right\">\n    <p><%= show_time() %></p>\n</div>")(serialized_model);
    },
    templateHelpers: function() {
      return {
        show_time: function() {
          return elapsed(this.time);
        }
      };
    },
    initialize: function(options) {
      return this.model.on('change', (function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
    }
  });
  Mod.ProgressItemView = Marionette.ItemView.extend({
    className: 'progress',
    template: function(serialized_model) {
      return _.template("<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"<%= get_percent() %>\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: <%= get_percent() %>%;\"></div>")(serialized_model);
    },
    templateHelpers: function() {
      return {
        get_percent: function() {
          if (this.current <= this.total) {
            return (this.current / this.total) * 100;
          } else {
            return 100;
          }
        }
      };
    },
    initialize: function(options) {
      return this.model.on('change', (function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
    }
  });
  Mod.QuestionItemView = Marionette.ItemView.extend({
    tagName: 'h1',
    template: function(serialized_model) {
      return _.template("<%= display_question() %>")(serialized_model);
    },
    templateHelpers: function() {
      return {
        display_question: function() {
          if (this.image !== null) {
            return this.image;
          } else {
            return this.question;
          }
        }
      };
    },
    initialize: function(options) {
      var that;
      this.model.on('change', (function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
      that = this;
      window.main_channel.vent.on('tunnel', function(number) {
        var country;
        country = that.model.get('country');
        if (("" + number) === ("" + country.sensor)) {
          return Mod.channel.vent.trigger('next');
        } else {
          return Mod.channel.vent.trigger('penalty', 3);
        }
      });
      window.main_channel.vent.on('good', function(number) {
        return Mod.channel.vent.trigger('next');
      });
      return window.main_channel.vent.on('bad', function(number) {
        return Mod.channel.vent.trigger('penalty', 3);
      });
    },
    onBeforeDestroy: function() {
      window.main_channel.vent.off('bad');
      window.main_channel.vent.off('good');
      return window.main_channel.vent.off('tunnel');
    }
  });
  Mod.QuestionLayout = Marionette.LayoutView.extend({
    el: '#content',
    template: _.template("<div class=\"row\">\n    <div class=\"col-md-12\" id=\"info\"></div>\n</div>\n<div class=\"row\">\n    <div class=\"col-md-12 text-center\" id=\"question\"></div>\n</div>\n<br/>\n<div class=\"row\">\n    <div class=\"col-md-12\" id=\"progress\"></div>\n</div>"),
    regions: {
      info: '#info',
      question: '#question',
      progress: '#progress'
    }
  });
  return Mod.on("start", function(options) {
    var info, progress, questions;
    info = new Mod.Info({
      total_questions: options.total_questions,
      category: options.category.title
    });
    progress = new Mod.Progress({
      total: options.total_questions,
      current: 0
    });
    questions = new Mod.Questions(options.category.id);
    questions.fetch();
    return questions.on('sync', function() {
      var info_view, progress_view, q_layout, question_view;
      q_layout = new Mod.QuestionLayout();
      q_layout.render();
      info_view = new Mod.InfoItemView({
        model: info
      });
      q_layout.getRegion('info').show(info_view);
      question_view = new Mod.QuestionItemView({
        model: questions.at(info.get('question') - 1)
      });
      q_layout.getRegion('question').show(question_view);
      progress_view = new Mod.ProgressItemView({
        model: progress
      });
      q_layout.getRegion('progress').show(progress_view);
      Mod.channel.commands.setHandler('main', function(msg) {
        var current, time, total;
        time = info.get('time') + 1;
        info.set('time', time);
        current = progress.get('current');
        total = progress.get('total');
        if (current >= total) {
          return Mod.channel.vent.trigger('next');
        } else {
          return progress.set('current', current + .1);
        }
      });
      Mod.channel.vent.on('next', function() {
        var question;
        question = info.get('question') + 1;
        if (question > options.total_questions) {
          Mod.clear_timer();
          console.log('Prechod na obrazovku #5');
          return console.log(elapsed(info.get('time')));
        } else {
          info.set('question', question);
          progress.set('current', 0);
          question_view.destroy();
          question_view = new Mod.QuestionItemView({
            model: questions.at(question - 1)
          });
          return q_layout.getRegion('question').show(question_view);
        }
      });
      return Mod.set_timer();
    });
  });
});

options = {
  total_questions: 10,
  category: {
    id: 1,
    title: 'Hlavní města'
  }
};

App.start(options);

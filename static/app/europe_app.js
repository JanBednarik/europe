// Generated by CoffeeScript 1.10.0
var App;

App = new Marionette.Application();

App.on('start', function(global_options) {
  var ServerOptions, active_module, final_global_options, server_options, state_handler, that;
  active_module = null;
  that = this;
  final_global_options = void 0;
  state_handler = function(new_module_name, options) {
    if (active_module !== null) {
      active_module.stop();
    }
    active_module = that.module(new_module_name);
    return active_module.start(options);
  };
  window.channel.comply('intro:start', function(options) {
    return state_handler("Intro", options);
  });
  window.channel.comply('intro:close', function(options) {
    return window.channel.command('crossroad:start', options);
  });
  window.channel.comply('crossroad:start', function(options) {
    return state_handler("Crossroad", options);
  });
  window.channel.comply('crossroad:idle', function(options) {
    return window.channel.command('intro:start', options);
  });
  window.channel.comply('crossroad:close', function(options) {
    if (options.crossroad === 'game') {
      return window.channel.command('gamemode:start', options);
    } else {
      return window.channel.command('scores:start', options);
    }
  });
  window.channel.comply('scores:start', function(options) {
    return state_handler("Scores", options);
  });
  window.channel.comply('scores:idle', function(options) {
    return window.channel.command('intro:start', options);
  });
  window.channel.comply('scores:close', function(options) {
    return window.channel.command('crossroad:start', options);
  });
  window.channel.comply('gamemode:start', function(options) {
    return state_handler("GameMode", options);
  });
  window.channel.comply('gamemode:idle', function(options) {
    return window.channel.command('intro:start', options);
  });
  window.channel.comply('gamemode:close', function(options) {
    return window.channel.command('countdown:start', options);
  });
  window.channel.comply('countdown:start', function(options) {
    return state_handler("Countdown", options);
  });
  window.channel.comply('countdown:close', function(options) {
    return window.channel.command('game:start', options);
  });
  window.channel.comply('game:start', function(options) {
    return state_handler("Game", options);
  });
  window.channel.comply('game:close', function(options) {
    return window.channel.command('result:start', options);
  });
  window.channel.comply('result:start', function(options) {
    return state_handler("Result", options);
  });
  window.channel.comply('result:close', function(options) {
    return window.channel.command('recap:start', options);
  });
  window.channel.comply('recap:start', function(options) {
    return state_handler("Recap", options);
  });
  window.channel.comply('recap:close', function(options) {
    return window.channel.command('score:start', options);
  });
  window.channel.comply('score:start', function(options) {
    return state_handler("Score", options);
  });
  window.channel.comply('score:idle', function(options) {
    return window.channel.command('intro:start', final_global_options);
  });
  ServerOptions = Backbone.Collection.extend({
    model: Backbone.Model,
    url: '/api/options',
    parse: function(response, options) {
      return response.results;
    }
  });
  server_options = new ServerOptions;
  server_options.on('sync', function() {
    var _global_options, _options, debug_data, questions;
    _options = _.object(server_options.map(function(i) {
      return [i.get('key'), parseInt(i.get('value'))];
    }));
    _global_options = _.extend({
      options: _options
    }, {
      constants: {
        DIFFICULTY_EASY: 'E',
        DIFFICULTY_HARD: 'H'
      }
    });
    final_global_options = _.extend(_global_options, global_options);
    questions = [
      {
        "id": 137,
        "question": "Ve které zemi se nachází město Atény?",
        "difficulty": "E",
        "image": "/riga.jpg",
        "country": {
          "id": 39,
          "title": "Řecko",
          "sensor": "39"
        },
        "category": {
          "id": 1,
          "title": "Hlavní města",
          "time_easy": 30,
          "penalty_easy": 3,
          "time_hard": 10,
          "penalty_hard": 3
        },
        "answer": false
      }, {
        "id": 107,
        "question": "Ve které zemi se nachází město Podgorica?",
        "difficulty": "E",
        "image": "/riga.jpg",
        "country": {
          "id": 9,
          "title": "Černá Hora",
          "sensor": "9"
        },
        "category": {
          "id": 1,
          "title": "Hlavní města",
          "time_easy": 30,
          "penalty_easy": 3,
          "time_hard": 10,
          "penalty_hard": 3
        },
        "answer": true
      }, {
        "id": 108,
        "question": "Ve které zemi se nachází město Praha?",
        "difficulty": "E",
        "image": "/riga.jpg",
        "country": {
          "id": 10,
          "title": "Česko",
          "sensor": "10"
        },
        "category": {
          "id": 1,
          "title": "Hlavní města",
          "time_easy": 30,
          "penalty_easy": 3,
          "time_hard": 10,
          "penalty_hard": 3
        },
        "answer": true
      }, {
        "id": 142,
        "question": "Ve které zemi se nachází město Bělehrad?",
        "difficulty": "E",
        "image": "/riga.jpg",
        "country": {
          "id": 44,
          "title": "Srbsko",
          "sensor": "44"
        },
        "category": {
          "id": 1,
          "title": "Hlavní města",
          "time_easy": 30,
          "penalty_easy": 3,
          "time_hard": 10,
          "penalty_hard": 3
        },
        "answer": true
      }, {
        "id": 100,
        "question": "Ve které zemi se nachází město Andorra la Vella?",
        "difficulty": "E",
        "image": "/riga.jpg",
        "country": {
          "id": 2,
          "title": "Andora",
          "sensor": "2"
        },
        "category": {
          "id": 1,
          "title": "Hlavní města",
          "time_easy": 30,
          "penalty_easy": 3,
          "time_hard": 10,
          "penalty_hard": 3
        },
        "answer": true
      }, {
        "id": 110,
        "question": "Ve které zemi se nachází město Talin?",
        "difficulty": "E",
        "image": null,
        "country": {
          "id": 12,
          "title": "Estonsko",
          "sensor": "12"
        },
        "category": {
          "id": 1,
          "title": "Hlavní města",
          "time_easy": 30,
          "penalty_easy": 3,
          "time_hard": 10,
          "penalty_hard": 3
        },
        "answer": true
      }, {
        "id": 125,
        "question": "Ve které zemi se nachází město Skopje?",
        "difficulty": "E",
        "image": null,
        "country": {
          "id": 27,
          "title": "Makedonie",
          "sensor": "27"
        },
        "category": {
          "id": 1,
          "title": "Hlavní města",
          "time_easy": 30,
          "penalty_easy": 3,
          "time_hard": 10,
          "penalty_hard": 3
        },
        "answer": true
      }, {
        "id": 120,
        "question": "Ve které zemi se nachází město Vaduz?",
        "difficulty": "E",
        "image": "/riga.jpg",
        "country": {
          "id": 22,
          "title": "Lichtenštejnsko",
          "sensor": "22"
        },
        "category": {
          "id": 1,
          "title": "Hlavní města",
          "time_easy": 30,
          "penalty_easy": 3,
          "time_hard": 10,
          "penalty_hard": 3
        },
        "answer": true
      }
    ];
    debug_data = {
      questions: questions,
      answers: [
        {
          id: 137,
          answer: false
        }, {
          id: 107,
          answer: true
        }, {
          id: 108,
          answer: true
        }, {
          id: 142,
          answer: true
        }, {
          id: 100,
          answer: true
        }, {
          id: 110,
          answer: true
        }, {
          id: 125,
          answer: true
        }, {
          id: 120,
          answer: true
        }
      ],
      constants: {
        DIFFICULTY_EASY: "E",
        DIFFICULTY_HARD: "H"
      },
      crossroad: 'game',
      gamemode: {
        category: 1,
        category_icon: 'svg/star.svg',
        difficulty: 'E',
        difficulty_title: 'Jednoduchá hra',
        penalty: 3,
        time: 30,
        title: 'Hlavní města'
      },
      options: {
        COUNTDOWN_TICK_TIMEOUT: 1100,
        IDLE_CROSSROAD: 4000,
        IDLE_GAMEMODE: 4000,
        IDLE_RECAP: 10000,
        IDLE_RESULT: 10000,
        IDLE_SCORE: 10000,
        IDLE_SCORES: 10000,
        INTRO_TIME_PER_SCREEN: 3000,
        QUESTION_COUNT: 8,
        RESULT_COUNT: 10
      },
      time: 84
    };
    return window.channel.command('gamemode:start', debug_data);
  });
  return server_options.fetch();
});

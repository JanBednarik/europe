// Generated by CoffeeScript 1.10.0
App.module("GameMode", function(Mod, App, Backbone, Marionette, $, _) {
  var CategoryItemView, Item, ItemView, Items, ItemsView, ScreenLayout, _options, categories, choices, difficulties, handler, layout, local_channel;
  Mod.startWithParent = false;
  _options = void 0;
  layout = void 0;
  difficulties = void 0;
  categories = void 0;
  choices = void 0;
  local_channel = void 0;
  Item = Backbone.Model.extend({
    idAttribute: 'id',
    defaults: {
      id: void 0,
      title: void 0,
      active: false,
      order: 1
    }
  });
  Items = Backbone.Collection.extend({
    model: Item,
    comparator: 'order',
    initialize: function(models, options) {
      this.active_length = null;
      if (_.isObject(options) && _.has(options, 'active')) {
        this._active = options.active;
      } else {
        this._active = false;
      }
      return this._active_map = null;
    },
    parse: function(response, options) {
      return response.results;
    },
    set_active: function(index) {
      var obj;
      if (this.get_active_length() < 1) {
        return;
      }
      if (!index || index < 0 || index >= this.get_active_length()) {
        index = 0;
      }
      if (this._active) {
        obj = this.at(this.get_active_map()[index]);
      } else {
        obj = this.at(index);
      }
      if (obj !== void 0) {
        this.each(function(i) {
          if (i.get('active')) {
            return i.set('active', false);
          }
        });
        obj.set('active', true);
      }
      this.trigger('change');
      return index;
    },
    get_active_length: function() {
      var x;
      if (this._active) {
        if (this.active_length === null) {
          x = this.filter(function(i) {
            return !i.get('disabled');
          });
          this.active_length = x.length;
        }
      } else {
        this.active_length = this.length;
      }
      return this.active_length;
    },
    get_active_map: function() {
      var out, y;
      if (this._active_map !== null) {
        return this._active_map;
      } else {
        out = {};
        if (this._active) {
          y = 0;
          this.each(function(item, idx) {
            if (!item.get('disabled')) {
              out[y] = idx;
              return y = y + 1;
            }
          });
        }
        return this._active_map = out;
      }
    },
    unset_active: function() {
      return this.each(function(i) {
        return i.set('active', false);
      });
    }
  });
  ItemView = Marionette.ItemView.extend({
    tagName: "div",
    className: function() {
      return "button " + (this.model.get('classes')) + " " + (this.model.get('active') ? 'active' : '');
    },
    template: function(serialized_model) {
      return _.template("<p><%= title %></p>")(serialized_model);
    }
  });
  ItemsView = Marionette.CollectionView.extend({
    childView: ItemView,
    initialize: function(options) {
      this.index = 0;
      this.command = options.command;
      return this.collection.on('change', (function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
    },
    set_key_handler: function() {
      return window.channel.on('key', (function(_this) {
        return function(msg) {
          var change_collection, obj, old_index, set_new_timeout;
          old_index = _this.index;
          set_new_timeout = true;
          change_collection = false;
          if (msg === 'left' && _this.index > 0) {
            _this.index -= 1;
            change_collection = true;
          } else if (msg === 'right' && _this.index < _this.collection.get_active_length() - 1) {
            _this.index += 1;
            change_collection = true;
          } else if (msg === 'fire') {
            window.sfx.button2.play();
            obj = _this.collection.at(_this.index);
            _this.disable_keys();
            local_channel.trigger(_this.command, obj);
            set_new_timeout = false;
          } else {
            set_new_timeout = false;
          }
          if (set_new_timeout) {
            window.sfx.button.play();
            set_delay(handler, _options.options.IDLE_GAMEMODE);
          }
          if (change_collection && old_index !== _this.index) {
            return _this.collection.set_active(_this.index);
          }
        };
      })(this));
    },
    enable_keys: function() {
      return this.set_key_handler();
    },
    disable_keys: function() {
      return window.channel.off('key');
    },
    onDestroy: function() {
      this.collection.off('change');
      return this.disable_keys();
    },
    set_active: function() {
      this.index = 0;
      this.collection.set_active(this.index);
      return this.enable_keys();
    },
    reset: function() {
      this.disable_keys();
      this.collection.unset_active();
      return this.index = 0;
    }
  });
  CategoryItemView = Marionette.ItemView.extend({
    tagName: "div",
    className: function() {
      return "button button-1-4 " + (this.model.get('active') ? 'active' : '');
    },
    template: function(serialized_model) {
      return _.template("<p<% if (disabled) {%> class='disabled'<% } %>><img src='<%= icon %>'/><%= title %></p>")(serialized_model);
    }
  });
  ScreenLayout = Marionette.LayoutView.extend({
    template: _.template("<div id=\"body\">\n    <table class=\"gamemode\">\n        <tr class=\"row-1\">\n            <td></td>\n        </tr>\n        <tr class=\"row-2\">\n            <td></td>\n        </tr>\n        <tr class=\"row-3\">\n            <td></td>\n        </tr>\n    </table>\n</div>"),
    onRender: function() {
      return $('body').attr('class', 'layout-c');
    },
    regions: {
      difficulty: '.row-1 td',
      category: '.row-2 td',
      choice: '.row-3 td'
    }
  });
  handler = function() {
    return '';
  };
  Mod.onStart = function(options) {
    var local_options;
    console.log('Gamemode module');
    console.log(options);
    _options = options;
    local_channel = Backbone.Radio.channel('gamemode');
    layout = new ScreenLayout({
      el: make_content_wrapper()
    });
    layout.render();
    difficulties = new Items;
    difficulties.add(new Item({
      id: _options.constants.DIFFICULTY_EASY,
      title: 'Jednoduchá hra',
      active: false,
      classes: 'button-2-4',
      order: 1
    }));
    difficulties.add(new Item({
      id: _options.constants.DIFFICULTY_HARD,
      title: 'Obtížná hra',
      active: false,
      classes: 'button-2-4',
      order: 2
    }));
    choices = new Items;
    choices.add(new Item({
      id: 'ok',
      title: 'Hrát',
      active: false,
      classes: 'button-3-4',
      order: 1
    }));
    choices.add(new Item({
      id: 'repeat',
      title: 'Vybrat znovu',
      active: false,
      classes: 'button-1-4',
      order: 2
    }));
    layout.getRegion('difficulty').show(new ItemsView({
      collection: difficulties,
      command: 'category'
    }));
    categories = new Items(null, {
      active: true
    });
    categories.url = '/api/categories';
    layout.getRegion('category').show(new ItemsView({
      childView: CategoryItemView,
      collection: categories,
      command: 'choice'
    }));
    layout.getRegion('choice').show(new ItemsView({
      collection: choices,
      command: 'done'
    }));
    categories.fetch();
    local_options = {};
    local_channel.on('category', function(obj) {
      local_options['difficulty'] = obj.get('id');
      local_options['difficulty_title'] = obj.get('title');
      return layout.getRegion('category').currentView.set_active();
    });
    local_channel.on('choice', function(obj) {
      local_options['category'] = obj.get('id');
      local_options['category_icon'] = obj.get('icon');
      local_options['title'] = obj.get('title');
      if (local_options.difficulty === _options.constants.DIFFICULTY_EASY) {
        local_options['time'] = obj.get('time_easy');
        local_options['penalty'] = obj.get('penalty_easy');
      } else {
        local_options['time'] = obj.get('time_hard');
        local_options['penalty'] = obj.get('penalty_hard');
      }
      return layout.getRegion('choice').currentView.set_active();
    });
    local_channel.on('done', function(obj) {
      if (obj.get('id') === 'ok') {
        return window.channel.command('gamemode:close', _.extend(_options, {
          gamemode: local_options
        }));
      } else {
        local_options = {};
        layout.getRegion('difficulty').currentView.reset();
        layout.getRegion('category').currentView.reset();
        layout.getRegion('choice').currentView.reset();
        return layout.getRegion('difficulty').currentView.set_active();
      }
    });
    layout.getRegion('difficulty').currentView.set_active();
    return set_delay(handler, _options.options.IDLE_GAMEMODE);
  };
  return Mod.onStop = function() {
    clear_delay();
    layout.destroy();
    choices = void 0;
    categories = void 0;
    difficulties = void 0;
    return local_channel.reset();
  };
});

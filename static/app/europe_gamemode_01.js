//@ sourceMappingURL=europe_gamemode_01.map
// Generated by CoffeeScript 1.6.1

App.module("GameMode", function(Mod, App, Backbone, Marionette, $, _) {
  var Categories, CategoriesView, Category, CategoryItemView, IDLE_TIMEOUT, handler, view, _options;
  Mod.startWithParent = false;
  IDLE_TIMEOUT = 4000;
  _options = void 0;
  view = void 0;
  Category = Backbone.Model.extend({
    idAttribute: 'id',
    defaults: {
      id: void 0,
      title: void 0,
      active: false
    }
  });
  Categories = Backbone.Collection.extend({
    model: Category,
    comparator: 'title',
    url: '/api/categories',
    parse: function(response, options) {
      return response.results;
    },
    set_active: function(index) {
      var obj;
      if (this.length < 1) {
        return;
      }
      if (!index || index < 0 || index >= this.length) {
        index = 0;
      }
      obj = this.at(index);
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
    }
  });
  CategoryItemView = Marionette.ItemView.extend({
    tagName: "tr",
    template: function(serialized_model) {
      return _.template("<td><% if (active) {%> █&nbsp;<% } %></td><td><%= title %></td>")(serialized_model);
    }
  });
  CategoriesView = Marionette.CollectionView.extend({
    childView: CategoryItemView,
    initialize: function(options) {
      var that,
        _this = this;
      this.index = 0;
      that = this;
      this.collection.on('sync', function() {
        that.index = _this.collection.set_active(that.index);
        return _this.render();
      });
      this.collection.on('change', function() {
        return _this.render();
      });
      return window.channel.on('key', function(msg) {
        var obj, old_index, set_new_timeout;
        old_index = that.index;
        set_new_timeout = true;
        if (msg === 'up' && that.index > 0) {
          that.index -= 1;
        } else if (msg === 'down' && that.index < that.collection.length - 1) {
          that.index += 1;
        } else if (msg === 'fire') {
          window.sfx.button2.play();
          obj = that.collection.at(that.index);
          window.channel.command('gamemode:close', _.extend(_options, {
            category: obj.toJSON()
          }));
          set_new_timeout = false;
        } else {
          set_new_timeout = false;
        }
        if (set_new_timeout) {
          window.sfx.button.play();
          set_delay(handler, IDLE_TIMEOUT);
        }
        if (old_index !== that.index) {
          return that.collection.set_active(that.index);
        }
      });
    },
    onDestroy: function() {
      this.collection.off('change');
      this.collection.off('sync');
      return window.channel.off('key');
    }
  });
  handler = function() {
    return window.channel.command('gamemode:idle', _options);
  };
  Mod.onStart = function(options) {
    var categories;
    _options = options;
    categories = new Categories();
    view = new CategoriesView({
      collection: categories,
      el: make_content_wrapper()
    });
    categories.fetch();
    return set_delay(handler, IDLE_TIMEOUT);
  };
  return Mod.onStop = function() {
    clear_delay();
    return view.destroy();
  };
});

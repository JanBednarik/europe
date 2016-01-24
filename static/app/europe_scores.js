// Generated by CoffeeScript 1.10.0
App.module("Scores", function(Mod, App, Backbone, Marionette, $, _) {
  var CategoryResultItemView, CategoryResultView, Result, ResultLayout, Results, _options;
  Mod.startWithParent = false;
  _options = void 0;
  Result = Backbone.Model.extend({
    defaults: {
      name: void 0,
      time: void 0,
      category: void 0
    }
  });
  Results = Backbone.Collection.extend({
    model: Result,
    initialize: function(category) {
      return this.url = "/api/results/" + category;
    },
    parse: function(response, options) {
      return response.results;
    }
  });
  CategoryResultItemView = Marionette.ItemView.extend({
    tagName: "tr",
    template: function(serialized_model) {
      return _.template("<td><%= name %></td>\n<td class=\"text-right\"><%= show_time() %></td>")(serialized_model);
    },
    templateHelpers: function() {
      return {
        show_time: function() {
          return display_elapsed(this.time);
        }
      };
    }
  });
  CategoryResultView = Marionette.CollectionView.extend({
    childView: CategoryResultItemView,
    tagName: 'table',
    className: 'table',
    initialize: function(options) {
      return this.collection.on('sync', (function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
    },
    onDestroy: function() {
      return this.collection.off('sync');
    }
  });
  ResultLayout = Marionette.LayoutView.extend({
    template: _.template("<div class=\"row\">\n    <div class=\"col-md-12\">\n        <h3>Kategorie ??</h3>\n    </div>\n\n    <div class=\"col-md-6\">\n        <h3>Malá obtížnost</h3>\n        <div id=\"easy-results\">\n        </div>\n    </div>\n    <div class=\"col-md-1\"></div>\n    <div class=\"col-md-5\">\n        <h3>Velká obtížnost</h3>\n        <div id=\"hard-results\">\n        </div>\n    </div>\n</div>"),
    regions: {
      easy: '#easy-results',
      hard: '#hard-results'
    }
  });
  Mod.onStart = function(options) {
    var category_results, category_view, layout, result_view, total_results;
    console.log(options);
    _options = options;
    total_results = new Results();
    category_results = new Results(options.category.id);
    result_view = new ResultView({
      collection: total_results
    });
    category_view = new CategoryResultView({
      collection: category_results
    });
    layout = new ResultLayout({
      el: make_content_wrapper()
    });
    layout.render();
    layout.getRegion('total').show(result_view);
    layout.getRegion('category').show(category_view);
    total_results.fetch();
    return category_results.fetch();
  };
  return Mod.onStop = function() {
    clear_delay();
    return view.destroy();
  };
});

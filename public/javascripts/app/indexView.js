(function() {
    App.IndexView = Ember.View.extend({
        didInsertElement : function(){
            this._super();
            Ember.run.scheduleOnce('afterRender', this, function(){
                var ip = document.getElementById('ip');
                var ipInApp = document.getElementById('ipInApp');
                ipInApp.innerHTML = ip.getAttribute("content");
            });
        },
    });
})();
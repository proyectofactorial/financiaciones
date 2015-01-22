var Flines = new Meteor.Collection ('flines');
Meteor.subscribe('flines');

var DestDep = new Deps.Dependency;

var dest = [{name: 'artista',
             key: 'G'},
            {name: 'pyme',
             key: 'P'},
            {name: 'artesano',
             key: 'N'},
            {name: 'profesional',
             key: 'E'}];

var filter = {};

Template.dest.helpers({
        dest: dest
});

Template.dest.events({
        'click button': function () {
                DestDep.changed();
                filter = {dest: this.key};
        }
});

Template.flines.helpers({
        lines: function() {
                DestDep.depend();
                return Flines.find(filter).fetch();
        }
});

Template.line.helpers({
        keys: function() {
                var ret = _.filter(_.map(this, function (v, k) {
                        return {value: v, key: k};
                }), function (item) {
                        return ! item.key.match(/(_id|name)/);
                });
                return ret;
                debugger;
        }
});

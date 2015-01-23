var Flines = new Meteor.Collection ('flines');
Meteor.subscribe('flines');

var DestDep = new Deps.Dependency;

var dest = [
        {name: 'todos',
         key: '.*'},
        {name: 'artista',
         key: 'G'},
        {name: 'pyme',
         key: 'P'},
        {name: 'artesano',
         key: 'N'},
        {name: 'profesional',
         key: 'E'}
];

var filter = {};

Template.search.events({
        'input input': function (e) {
                var val = e.target.value;
                if (val.length < 3) {
                        if (filter.name) {
                                delete filter.name;
                                DestDep.changed();
                        }
                        return;
                }

                val = val.replace (/\s+/, '\\s*');
                filter = _.extend (filter, {
                        name: {$regex: new RegExp (val, 'i')}
                });
                DestDep.changed();
        }
});

Template.dest.helpers({
        dest: dest
});

Template.dest.events({
        'click button': function () {
                filter = {dest: {$regex: this.key}};
                DestDep.changed();
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
        },
        filteredName: function () {
                var name = HTML.toHTML(this.name);
                if (! filter.name)
                        return name;

                return name.replace(filter.name['$regex'], '<mark>' + '$&' + '</mark>');
        }
});

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
var filterText;

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

                filterText = val.replace (/\s+/, '\\s*');
                filter = _.extend (filter, {
                        $or: [
                                {name: {$regex: new RegExp (filterText, 'i')}},
                                {req:  {$regex: new RegExp (filterText, 'i')}}
                        ]
                });
                DestDep.changed();
        }
});

Template.dest.helpers({
        dest: dest,
        active: function () {
                DestDep.depend();
                if (! filter.dest)
                        return '';

                if (filter.dest['$regex'] === this.key)
                        return 'active';

                return '';
        }

});

Template.dest.events({
        'click button': function () {
                filter = _.extend (filter, {
                        dest: {$regex: this.key}
                });
                DestDep.changed();
        }
});

Template.flines.helpers({
        lines: function() {
                DestDep.depend();
                return Flines.find(filter);
        },
});

Template.line.helpers({
        keys: function() {
                var ret = _.filter(_.map(this, function (v, k) {
                        return {value: v, key: k};
                }), function (item) {
                        var key = item.key.match(/(_id|name|obj|page)/);
                        var val = item.value && item.value.toString().match(/(N\/A|No dice)/i);
                        return !key && !val;
                });
                return ret;
                debugger;
        },
        highlight: function (kw) {
                var field = kw.hash.field;

                if (! this[field])
                        return 'Error in Template';

                var item = HTML.toHTML(this[field]);
                if (! filterText)
                        return item;

                var r = new RegExp(filterText, 'i');
                return item.replace(r, '<mark>' + '$&' + '</mark>');
        }
});

// marker collection
var Flines = new Meteor.Collection('flines');
Meteor.publish("flines", function () {
  return Flines.find();
});


Meteor.methods({
        reset: function (col, data) {
                Flines.remove({});
                if (data) {
                        data.forEach (function (d) {
                                Flines.insert (d);
                        });
                }
        }
});

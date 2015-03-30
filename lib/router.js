Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

Router.configure({
  layoutTemplate:   'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate:  'loading'
})

Router.map(function() {
        this.route('/', {template: 'inicio'})
        this.route('/tipo')
        this.route('/selector')
})

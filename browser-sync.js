import browserSync from 'browser-sync';

browserSync.create().init({
    files: ['public/**/*.*'],
    server: 'public',
    open: true,
    notify: true,
    ui: false,
    ghostMode: false,
});

import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import rename from 'gulp-rename'

import cleanCss from 'gulp-clean-css' // Сжатие CSS файла
import webpCss from 'gulp-webp-css' // Вывод webp-изображений
import autoPrefixer from 'gulp-autoprefixer' // Добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries' // Группировка медиазапросов

const sass = gulpSass(dartSass)

export const scss = () => {
  return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      }))
    )
    .pipe(app.plugins.replace(/@img\//g, '../img/'))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(
      app.plugins.ifPlugin(
        app.isBuild,
        groupCssMediaQueries()
      )
    )
    .pipe(
      app.plugins.ifPlugin(
        app.isBuild,
        autoPrefixer(
          {
            grid: true,
            overrideBrowserlist: ["last 3 versions"],
            cascade: true,
          }
        )
      )
    )
    .pipe(
      app.plugins.ifPlugin(
        app.isBuild,
        webpCss(
          {
            webpClass: ".webp",
            noWebpClass: ".no-webp",
          }
        )
      )
    )
    .pipe(app.gulp.dest(app.path.build.css)) // Если нужен несжатый файл стилей
    .pipe(
      app.plugins.ifPlugin(
        app.isBuild,
        cleanCss()
      )
    )
    .pipe(rename({
      extname: ".min.css"
    }))
    .pipe(app.gulp.dest(app.path.build.css))
    .pipe(app.plugins.browserSync.stream())
}
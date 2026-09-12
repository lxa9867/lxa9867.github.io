/* Progressive enhancements: theme toggle, news "show all", first-author filter.
   The page is fully readable with JavaScript disabled. */
(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return root.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* ---------- News: collapse older items ---------- */
  var NEWS_VISIBLE = 8;
  var news = document.querySelector('.news');
  var newsToggle = document.querySelector('.news-toggle');

  if (news && newsToggle) {
    var items = Array.prototype.slice.call(news.children);
    var extra = items.slice(NEWS_VISIBLE);
    if (extra.length > 0) {
      var expanded = false;
      var render = function () {
        extra.forEach(function (li) { li.hidden = !expanded; });
        newsToggle.textContent = expanded ? 'Show fewer' : 'Show all ' + items.length + ' updates';
        newsToggle.setAttribute('aria-expanded', String(expanded));
      };
      newsToggle.hidden = false;
      newsToggle.addEventListener('click', function () { expanded = !expanded; render(); });
      render();
    }
  }

  /* ---------- Publications: All / First-author filter ---------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.pub-filter'));
  var pubs = Array.prototype.slice.call(document.querySelectorAll('.pub'));
  var years = Array.prototype.slice.call(document.querySelectorAll('.pub-year'));

  if (filters.length && pubs.length) {
    var isFirst = function (p) { return p.getAttribute('data-first') === '1'; };
    var counts = { all: pubs.length, first: pubs.filter(isFirst).length };

    filters.forEach(function (btn) {
      var key = btn.getAttribute('data-filter');
      var badge = btn.querySelector('.count');
      if (badge && counts[key] != null) badge.textContent = counts[key];

      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        pubs.forEach(function (p) { p.hidden = (key === 'first') && !isFirst(p); });
        years.forEach(function (y) {
          var visible = Array.prototype.some.call(y.querySelectorAll('.pub'), function (p) { return !p.hidden; });
          y.hidden = !visible;
        });
      });
    });
  }
})();

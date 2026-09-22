(function () {
  var EMAIL = 'jasperimpens@gmail.com';

  // Copy the email address, with a short "Copied" confirmation.
  Array.prototype.slice.call(document.querySelectorAll('[data-ct-copy]')).forEach(function (btn) {
    var label = btn.querySelector('[data-ct-copy-label]');
    var timer = null;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-ct-copy');
      var done = function (ok) {
        label.textContent = ok ? 'Copied' : 'Press ⌘C';
        btn.classList.toggle('is-done', ok);
        clearTimeout(timer);
        timer = setTimeout(function () { label.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  });

  // Project brief: the site is static, so the form writes the email and hands
  // it to the visitor's mail app instead of posting anywhere.
  var form = document.querySelector('[data-ct-form]');
  if (!form) return;
  var status = form.querySelector('[data-ct-status]');
  var values = function (name) {
    return Array.prototype.slice.call(form.querySelectorAll('[name="' + name + '"]:checked')).map(function (i) { return i.value; });
  };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var company = form.elements.company.value.trim();
    var need = values('need');
    var timeline = values('timeline')[0];
    var budget = values('budget')[0];
    var message = form.elements.message.value.trim();

    var subject = 'New project' + (need.length ? ': ' + need.join(', ') : '') + (name ? ' (' + name + ')' : '');
    var lines = ['Hi Jasper,', ''];
    lines.push(message || 'I have a project I would like to talk about.');
    lines.push('');
    if (need.length) lines.push('What I need: ' + need.join(', '));
    if (timeline) lines.push('Timeline: ' + timeline);
    if (budget) lines.push('Budget: ' + budget);
    if (company) lines.push('Company: ' + company);
    lines.push('', name || '');

    window.location.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n').trim());
    if (status) status.textContent = 'Opening your email app… nothing happened? Mail ' + EMAIL;
  });
})();

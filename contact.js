// "Book a call" contact form.
// Opens a dialog from any link to #book-a-call and submits to Netlify Forms
// (form name "contact"; Netlify emails each submission to support@).
// The page bundle replaces <html> after load, so listeners live on window and
// the dialog is created on first use.
(function () {
  var FORM_NAME = 'contact';
  var SUPPORT = 'support@lanterncollabs.com';

  var CSS = [
    '#lc-contact{border:1px solid var(--ink,#000);border-radius:var(--radius-md,8px);background:var(--paper,#f6f1ea);color:var(--ink,#000);',
    'padding:0;width:min(560px,calc(100vw - 32px));max-height:calc(100vh - 32px);font-family:var(--font-serif,Georgia,serif);}',
    '#lc-contact::backdrop{background:rgba(0,0,0,.45);}',
    '#lc-contact .lcc-inner{padding:var(--space-6,32px);position:relative;}',
    '#lc-contact h2{font-size:32px;line-height:36px;font-weight:700;margin:0 0 var(--space-2,8px);}',
    '#lc-contact .lcc-sub{font-size:16px;line-height:24px;color:var(--ink-muted,#6b625a);margin:0 0 var(--space-5,24px);}',
    '#lc-contact .lcc-close{position:absolute;top:var(--space-3,12px);right:var(--space-3,12px);width:40px;height:40px;border:0;background:transparent;',
    'font-size:28px;line-height:1;cursor:pointer;color:var(--ink,#000);border-radius:var(--radius-sm,6px);}',
    '#lc-contact .lcc-close:hover{background:var(--sand,#e5e0da);}',
    '#lc-contact .lcc-row{display:grid;grid-template-columns:1fr 1fr;column-gap:var(--space-4,16px);}',
    '@media (max-width:520px){#lc-contact .lcc-row{grid-template-columns:1fr;}#lc-contact .lcc-inner{padding:var(--space-5,24px);}}',
    '#lc-contact label{display:block;margin-bottom:var(--space-4,16px);}',
    '#lc-contact .lcc-label{display:block;font-size:11px;line-height:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:var(--space-2,8px);}',
    '#lc-contact .lcc-opt{color:var(--ink-muted,#6b625a);font-weight:400;text-transform:none;letter-spacing:0;font-size:13px;}',
    '#lc-contact input,#lc-contact textarea{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:16px;line-height:24px;color:var(--ink,#000);',
    'background:var(--canvas,#fff);border:1px solid var(--rule,#857c73);border-radius:var(--radius-sm,6px);padding:10px 12px;}',
    '#lc-contact textarea{min-height:120px;resize:vertical;}',
    '#lc-contact input:focus,#lc-contact textarea:focus{outline:2px solid var(--terracotta,#d17e5c);outline-offset:1px;border-color:var(--ink,#000);}',
    '#lc-contact .lcc-hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;}',
    '#lc-contact .lcc-actions{display:flex;align-items:center;gap:var(--space-4,16px);flex-wrap:wrap;margin-top:var(--space-2,8px);}',
    '#lc-contact button[type=submit]{cursor:pointer;font-family:inherit;}',
    '#lc-contact button[type=submit][disabled]{opacity:.6;cursor:default;}',
    '#lc-contact .lcc-error{color:#a3341a;font-size:14px;line-height:20px;}',
    '#lc-contact .lcc-done{display:none;}',
    '#lc-contact.is-done form,#lc-contact.is-done .lcc-intro{display:none;}',
    '#lc-contact.is-done .lcc-done{display:block;}'
  ].join('');

  function build() {
    var d = document.createElement('dialog');
    d.id = 'lc-contact';
    d.setAttribute('aria-labelledby', 'lcc-title');
    d.innerHTML =
      '<style>' + CSS + '</style>' +
      '<div class="lcc-inner">' +
      '<button type="button" class="lcc-close" aria-label="Close">×</button>' +
      '<h2 id="lcc-title">Book a call</h2>' +
      '<p class="lcc-sub lcc-intro">Tell us a little about your business. We’ll get back to you to set up a 20-minute call.</p>' +
      '<form name="' + FORM_NAME + '" method="POST" data-netlify="true" netlify-honeypot="bot-field" novalidate>' +
      '<input type="hidden" name="form-name" value="' + FORM_NAME + '">' +
      '<label class="lcc-hp" aria-hidden="true">Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label>' +
      '<div class="lcc-row">' +
      '<label><span class="lcc-label">Name</span><input name="name" required autocomplete="name"></label>' +
      '<label><span class="lcc-label">Company <span class="lcc-opt">(optional)</span></span><input name="company" autocomplete="organization"></label>' +
      '</div>' +
      '<div class="lcc-row">' +
      '<label><span class="lcc-label">Email</span><input name="email" type="email" required autocomplete="email"></label>' +
      '<label><span class="lcc-label">Phone</span><input name="phone" type="tel" required autocomplete="tel"></label>' +
      '</div>' +
      '<label><span class="lcc-label">How can we help?</span><textarea name="message" required></textarea></label>' +
      '<div class="lcc-actions">' +
      '<button type="submit" class="lc-button lc-button--primary lc-button--lg body">Send</button>' +
      '<span class="lcc-error" role="alert"></span>' +
      '</div>' +
      '</form>' +
      '<div class="lcc-done" role="status">' +
      '<p class="lcc-sub" style="margin-bottom:var(--space-5,24px)">Thanks. Your message is with us and we’ll be in touch shortly to find a time.</p>' +
      '<button type="button" class="lc-button lc-button--secondary lc-button--lg body lcc-close-btn" style="cursor:pointer;font-family:inherit">Close</button>' +
      '</div>' +
      '</div>';

    var form = d.querySelector('form');
    var err = d.querySelector('.lcc-error');
    var submit = form.querySelector('button[type=submit]');

    form.addEventListener('input', function () { err.textContent = ''; });
    d.querySelector('.lcc-close').addEventListener('click', function () { d.close(); });
    d.querySelector('.lcc-close-btn').addEventListener('click', function () { d.close(); });
    // Click on the backdrop closes the dialog.
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      if (!form.checkValidity()) {
        var bad = form.querySelector(':invalid');
        err.textContent = bad && bad.type === 'email'
          ? 'Please enter a valid email address.'
          : 'Please fill in your name, email, phone and how we can help.';
        if (bad) bad.focus();
        return;
      }
      submit.disabled = true;
      submit.textContent = 'Sending…';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        d.classList.add('is-done');
        form.reset();
      }).catch(function () {
        err.innerHTML = 'Sorry, that didn’t send. Please email us at <a href="mailto:' + SUPPORT + '">' + SUPPORT + '</a>.';
      }).then(function () {
        submit.disabled = false;
        submit.textContent = 'Send';
      });
    });

    return d;
  }

  function open() {
    var d = document.getElementById('lc-contact');
    if (!d) { d = build(); document.body.appendChild(d); }
    d.classList.remove('is-done');
    if (!d.open) d.showModal();
    var first = d.querySelector('input[name=name]');
    if (first) first.focus();
  }

  window.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href$="#book-a-call"]');
    if (!a) return;
    e.preventDefault();
    open();
  }, true);

  window.lanternOpenContact = open;
})();

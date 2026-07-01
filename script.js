(function () {
  var body = document.body;
  var bodyClass = body ? body.className : '';

  if (document.querySelector('.hero-card-date')) {
    var today = new Date();
    var dateText = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    document.querySelector('.hero-card-date').textContent = 'Today · ' + dateText;
  }

  var greeting = document.querySelector('.tb-left h2');
  var subline = document.querySelector('.tb-left p');
  if (greeting || subline) {
    var now = new Date();
    var hour = now.getHours();
    var phrase = 'Good morning';
    if (hour >= 12 && hour < 18) phrase = 'Good afternoon';
    if (hour >= 18) phrase = 'Good evening';

    if (greeting) {
      greeting.textContent = phrase + ', Dr. Umukunzi 👋';
    }

    if (subline) {
      var options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
      subline.textContent = now.toLocaleDateString('en-US', options) + ' · Kigali Health Centre';
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var role = document.getElementById('login-role');
      var email = document.getElementById('login-email');
      var password = document.getElementById('login-password');
      var roleErr = document.getElementById('role-err');
      var emailErr = document.getElementById('email-err');
      var pwErr = document.getElementById('pw-err');
      var button = document.querySelector('.submit-btn');
      var isValid = true;

      if (!role.value) {
        roleErr.style.display = 'block';
        role.style.borderColor = 'var(--red)';
        isValid = false;
      } else {
        roleErr.style.display = 'none';
        role.style.borderColor = 'var(--border)';
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value)) {
        emailErr.style.display = 'block';
        email.style.borderColor = 'var(--red)';
        isValid = false;
      } else {
        emailErr.style.display = 'none';
        email.style.borderColor = 'var(--border)';
      }

      if (password.value.length < 8) {
        pwErr.style.display = 'block';
        password.style.borderColor = 'var(--red)';
        isValid = false;
      } else {
        pwErr.style.display = 'none';
        password.style.borderColor = 'var(--border)';
      }

      if (isValid) {
        button.innerHTML = 'Authenticating Securely...';
        button.style.background = 'var(--teal-dark)';
        button.disabled = true;
        setTimeout(function () {
          window.location.href = 'dashboard.html';
        }, 1200);
      }
    });

    document.getElementById('login-role').addEventListener('change', function () {
      document.getElementById('role-err').style.display = 'none';
      this.style.borderColor = 'var(--border)';
    });
    document.getElementById('login-email').addEventListener('input', function () {
      document.getElementById('email-err').style.display = 'none';
      this.style.borderColor = 'var(--border)';
    });
    document.getElementById('login-password').addEventListener('input', function () {
      document.getElementById('pw-err').style.display = 'none';
      this.style.borderColor = 'var(--border)';
    });
  }

  var regForm = document.getElementById('reg-form');
  if (regForm) {
    var currentStep = 1;

    function show(id, visible) {
      var element = document.getElementById(id);
      if (!element) return;
      if (visible) element.classList.add('show');
      else element.classList.remove('show');
    }

    function validate(step) {
      if (step === 1) {
        var selectedRole = document.querySelector('input[name="role"]:checked');
        show('role-err', !selectedRole);
        return !!selectedRole;
      }

      if (step === 2) {
        var fields = [
          { id: 'fname', err: 'fname-err', test: function (value) { return value.trim().length > 0; } },
          { id: 'lname', err: 'lname-err', test: function (value) { return value.trim().length > 0; } },
          { id: 'email', err: 'email-err', test: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); } },
          { id: 'phone', err: 'phone-err', test: function (value) { return value.trim().length >= 9; } },
          { id: 'dob', err: 'dob-err', test: function (value) { return value.length > 0; } },
          { id: 'gender', err: 'gender-err', test: function (value) { return value.length > 0; } },
          { id: 'natid', err: 'natid-err', test: function (value) { return value.trim().length > 0; } },
          { id: 'clinic', err: 'clinic-err', test: function (value) { return value.trim().length > 0; } }
        ];

        var allValid = true;
        fields.forEach(function (field) {
          var value = document.getElementById(field.id).value;
          var ok = field.test(value);
          show(field.err, !ok);
          if (!ok) allValid = false;
        });
        return allValid;
      }

      if (step === 3) {
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('cpw').value;
        var ok1 = password.length >= 8;
        var ok2 = password === confirmPassword;
        show('pw-err', !ok1);
        show('cpw-err', !ok2);
        return ok1 && ok2;
      }

      return true;
    }

    function goStep(step) {
      if (step > currentStep && !validate(currentStep)) return;

      document.getElementById('step-' + currentStep).classList.remove('active');
      var tabs = ['tab-1', 'tab-2', 'tab-3', 'tab-4'];
      tabs.forEach(function (tabId, index) {
        var tab = document.getElementById(tabId);
        tab.classList.remove('active', 'done');
        if (index + 1 < step) tab.classList.add('done');
        if (index + 1 === step) tab.classList.add('active');
      });

      currentStep = step;
      document.getElementById('step-' + currentStep).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function checkPw(password) {
      var score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      var colors = ['#e53935', '#f5a623', '#0a9e84', '#076b59'];
      var labels = ['Weak — add more characters', 'Fair — try adding numbers', 'Good — strong password', 'Excellent password!'];
      var fill = document.getElementById('pw-fill');
      fill.style.width = (score * 25) + '%';
      fill.style.background = score > 0 ? colors[score - 1] : '#d4e8e3';
      document.getElementById('pw-lbl').textContent = score > 0 ? labels[score - 1] : 'Enter a password';
    }

    window.goStep = goStep;
    window.checkPw = checkPw;

    document.querySelectorAll('input[name="role"]').forEach(function (roleInput) {
      roleInput.addEventListener('change', function () {
        show('role-err', false);
      });
    });

    regForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var password = document.getElementById('password').value;
      var confirmPassword = document.getElementById('cpw').value;
      var allChecked = ['c1', 'c2', 'c3', 'c4'].every(function (id) {
        return document.getElementById(id).checked;
      });

      var ok = true;
      if (password.length < 8) {
        show('pw-err', true);
        ok = false;
      }
      if (password !== confirmPassword) {
        show('cpw-err', true);
        ok = false;
      }
      show('consent-err', !allChecked);
      if (!allChecked) ok = false;

      if (ok) {
        regForm.style.display = 'none';
        document.querySelector('.steps').style.display = 'none';
        document.querySelector('.form-header').style.display = 'none';
        document.querySelector('.caution-box').style.display = 'none';
        document.querySelector('.signin-link').style.display = 'none';
        document.getElementById('success').classList.add('show');
      }
    });
  }

  var alertsButton = Array.prototype.find.call(document.querySelectorAll('.tb-btn'), function (button) {
    return button.textContent.indexOf('Alerts') !== -1;
  });
  if (alertsButton) {
    alertsButton.addEventListener('click', function () {
      alertsButton.classList.toggle('active');
      if (alertsButton.classList.contains('active')) {
        alertsButton.innerHTML = '🔔 Alerts &nbsp;<span class="alert-dot">2</span> · New';
      } else {
        alertsButton.innerHTML = '🔔 Alerts &nbsp;<span class="alert-dot">2</span>';
      }
    });
  }
})();

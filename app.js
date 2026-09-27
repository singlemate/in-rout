/* Static guide: no keys, subscriptions, or personal data are collected. */
'use strict';

const app = document.querySelector('#app');
const progress = document.querySelector('#progress');
const back = document.querySelector('#back');
const APP_STORE = 'https://apps.apple.com/ru/app/incy/id6756943388';
const INCY_RELEASE = 'https://github.com/INCY-DEV/incy-platforms/releases/latest';
const INCY_FILE = INCY_RELEASE + '/download/';
const grimbird = window.GRIMBIRD_ROUTING;
const clients = {
  incy: { name: 'Incy', icon: 'assets/incy.png' },
  v2raytun: { name: 'v2RayTun', icon: 'assets/v2raytun.png' }
};
const systems = { ios: 'iPhone / iPad', android: 'Android', mac: 'macOS', windows: 'Windows', linux: 'Linux' };
const incyDownloads = {
  ios: [[APP_STORE, 'Открыть App Store', 'Для iPhone и iPad']],
  android: [
    ['https://play.google.com/store/apps/details?id=llc.itdev.incy', 'Открыть Google Play', 'Установить из магазина'],
    [INCY_FILE + 'Incy.apk', 'Скачать APK', 'Если Google Play недоступен']
  ],
  mac: [
    [APP_STORE, 'Открыть App Store', 'Проверьте совместимость с вашим Mac'],
    [INCY_FILE + 'incy-macos-arm64.dmg', 'Скачать для Apple Silicon', 'Mac с процессором M1, M2, M3, M4 и новее'],
    [INCY_FILE + 'incy-macos-intel.dmg', 'Скачать для Intel', 'Mac с процессором Intel']
  ],
  windows: [
    [INCY_FILE + 'incy-windows-setup.exe', 'Скачать установщик', 'Windows · x64 / ARM64'],
    [INCY_FILE + 'incy-windows-portable.zip', 'Скачать Portable', 'ZIP-архив без установки']
  ],
  linux: [
    [INCY_FILE + 'incy-linux-x64.deb', 'DEB · x64', 'Ubuntu, Debian'],
    [INCY_FILE + 'incy-linux-x64.rpm', 'RPM · x64', 'Fedora и совместимые системы'],
    [INCY_FILE + 'incy-linux-x64.pkg.tar.zst', 'Arch · x64', 'Arch Linux'],
    [INCY_FILE + 'incy-linux-arm64.deb', 'DEB · ARM64', 'Ubuntu, Debian на ARM'],
    [INCY_FILE + 'incy-linux-arm64.rpm', 'RPM · ARM64', 'Fedora на ARM']
  ]
};

function link(url, title, detail = '') {
  return `<a class="download" href="${url}" target="_blank" rel="noopener noreferrer"><span><strong>${title}</strong>${detail ? `<small>${detail}</small>` : ''}</span><span aria-hidden="true">↗</span></a>`;
}
function action(to, title, secondary = false) {
  return `<a class="button${secondary ? ' secondary' : ''}" href="#${to}">${title}</a>`;
}
function heading(kicker, title, description) {
  return `<p class="eyebrow">${kicker}</p><h1 tabindex="-1">${title}</h1><p class="intro">${description}</p>`;
}
function clientMark(client) {
  return `<div class="client-mark"><img src="${clients[client].icon}" alt="" width="32" height="32"><span>${clients[client].name}</span></div>`;
}
function shots(items) {
  return `<div class="shots ${items.length === 1 ? 'one' : ''}">${items.map(([file, alt]) => `<img src="assets/${file}" alt="${alt}" loading="lazy">`).join('')}</div>`;
}
function copyField(id, label, value) {
  return `<div class="copy-field"><label for="copy-${id}">${label}</label><textarea id="copy-${id}" readonly rows="2" spellcheck="false">${value}</textarea><button type="button" class="button secondary" data-copy="${id}">Скопировать ${label}</button><p id="copy-status-${id}" class="hint" role="status"></p></div>`;
}
function help() {
  return `<details class="help"><summary>Не получается подключиться</summary><p>Проверьте, что ссылка скопирована полностью и выбран нужный сервер. Отключите другой VPN и попробуйте ещё раз.</p><p>Если это не помогло, обратитесь к тому, кто выдал вам ссылку: укажите приложение, устройство и текст ошибки. Персональную ссылку в общие чаты не отправляйте.</p></details>`;
}

const guides = {
  incy: [
    {
      title: 'Добавьте персональную ссылку',
      body: '<p>Скопируйте полученную ссылку <code>vless://…</code>. Откройте Incy и на вкладке <strong>«Подключение»</strong> вставьте её в поле добавления сервера.</p><p>Нажмите <strong>«Добавить сервер»</strong>. Он появится в разделе «Мои серверы».</p>',
      media: [['01-add.png', 'Поле добавления сервера в Incy'], ['02-paste.png', 'Вставка ссылки и кнопка добавления сервера']],
      next: 'Сервер добавлен',
      extra: '<details class="help"><summary>У меня нет персональной ссылки</summary><p>Запросите её у того, кто предоставил вам VPN. Установка приложения сама по себе не добавляет сервер.</p></details>'
    },
    {
      title: 'Добавьте маршрутизацию',
      body: '<p>Нажмите кнопку ниже, подтвердите открытие Incy и импорт профиля <strong>GrimbirdVPN Whitelist</strong>.</p><a class="button primary-route" href="incy://autorouting/onadd/https://raw.githubusercontent.com/GrimbirdUsers/ru-routing-dat/main/INCY/WHITELIST.JSON">Добавить маршрутизацию в Incy ↗</a><p class="hint">После импорта вернитесь на эту страницу, чтобы продолжить.</p>',
      next: 'Профиль добавлен',
      extra: '<details class="help"><summary>Кнопка не открывает Incy</summary><p>Откройте эту страницу в обычном браузере — Safari, Chrome или другом, а не внутри мессенджера. Убедитесь, что Incy установлен и обновлён.</p></details>'
    },
    {
      title: 'Включите профиль маршрутизации',
      body: '<p>Откройте <strong>Настройки → Туннель</strong>. Включите «Профили маршрутизации» и выберите <strong>GrimbirdVPN Whitelist</strong> в разделе «Активный профиль».</p>',
      media: [['04-tunnel.png', 'Настройки туннеля Incy'], ['05-routing.png', 'Выбор активного профиля маршрутизации']],
      next: 'Профиль включён'
    },
    {
      title: 'Подключитесь к VPN',
      body: '<p>Вернитесь на вкладку <strong>«Подключение»</strong>, выберите свой сервер и нажмите кнопку питания.</p><p>Если устройство попросит разрешение добавить VPN-подключение, подтвердите его. Дождитесь статуса подключения и проверьте, что сайты открываются.</p>',
      media: [['06-home.jpg', 'Главный экран Incy с кнопкой подключения']],
      next: 'Да, всё работает', extra: help()
    }
  ],
  v2raytun: [
    {
      title: 'Скопируйте персональную ссылку',
      body: '<p>Откройте сообщение со своей VPN-ссылкой и скопируйте <strong>всю ссылку</strong> <code>vless://…</code>, без лишних пробелов.</p><div class="illustration" aria-hidden="true"><span class="link-symbol">↗</span><code>vless://••••••••</code><span class="copy-label">Ваша VPN-ссылка</span></div><p>Если вам выдали ссылку подписки, скопируйте её целиком — она тоже добавляется через буфер обмена.</p>',
      next: 'Ссылка скопирована',
      extra: '<details class="help"><summary>Где взять ссылку?</summary><p>Её выдаёт тот, кто предоставил вам VPN. Само приложение v2RayTun не содержит готового сервера для подключения.</p></details>'
    },
    {
      title: 'Импортируйте её в v2RayTun',
      body: '<p>Откройте v2RayTun. Если список конфигураций пуст, нажмите <strong>«Добавить из буфера»</strong>, как на скриншоте.</p><p>Если конфигурации уже есть, используйте <strong>«+» → импорт из буфера обмена</strong>. Разрешите вставку, если появится системный запрос. Сервер или подписка должны появиться в списке.</p>',
      media: [['v2raytun-import.jpg', 'v2RayTun на iPhone: пустой список конфигураций и кнопка «Добавить из буфера»']],
      next: 'Сервер появился',
      extra: '<details class="help"><summary>Ссылка не добавляется</summary><p>Скопируйте ссылку заново целиком и повторите импорт. Если приложение сообщает об ошибке конфигурации, передайте текст ошибки тому, кто выдал ссылку.</p></details>'
    },
    {
      title: 'Подготовьте списки Grimbird',
      body: '<p>Перед подключением настроим <strong>GrimbirdVPN Whitelist</strong>: домены и IP из списка будут открываться напрямую, остальные — через VPN.</p><p>В v2RayTun откройте <strong>«Настройки» → раздел маршрутизации</strong>. Найдите настройки файлов <strong>GeoSite</strong> и <strong>GeoIP</strong>, укажите соответствующие ссылки ниже и запустите загрузку или обновление обоих файлов.</p>' + copyField('geosite', 'GeoSite URL', grimbird.geosite) + copyField('geoip', 'GeoIP URL', grimbird.geoip) + '<div class="note">Дождитесь успешной загрузки обоих файлов. Без баз Grimbird приложение не распознает категории этого профиля.</div>',
      next: 'Оба файла обновлены',
      extra: '<details class="help"><summary>Не нахожу настройки GeoSite / GeoIP</summary><p>Проверьте раздел маршрутизации или правил трафика: названия и расположение пунктов зависят от версии. Если пользовательские базы в вашей версии недоступны, не импортируйте профиль со следующего шага — используйте Incy либо уточните настройку у того, кто предоставил VPN.</p><p><a href="#device/incy">Перейти к установке Incy</a></p></details>'
    },
    {
      title: 'Добавьте GrimbirdVPN Whitelist',
      body: `<p>Нажмите кнопку, разрешите открыть v2RayTun и подтвердите импорт маршрутизации <strong>GrimbirdVPN Whitelist</strong>.</p><a class="button primary-route" id="v2raytun-routing-link" href="${grimbird.deeplink}">Импортировать профиль ↗</a><p class="hint">После импорта вернитесь сюда. Эта кнопка добавляет правила маршрутизации; персональный сервер вы добавили на предыдущих шагах.</p><div class="note">Используется адаптация правил Grimbird для v2RayTun. Базы GeoSite и GeoIP должны быть загружены на предыдущем шаге.</div>`,
      next: 'Профиль добавлен',
      extra: '<details class="help"><summary>Кнопка не открывает приложение</summary><p>Откройте страницу в Safari или Chrome, а не во встроенном браузере мессенджера. Если приложение не принимает ссылку, используйте импорт JSON в разделе маршрутизации.</p>' + copyField('route', 'JSON профиля', JSON.stringify(grimbird.profile, null, 2)) + '<p><a href="routing/grimbird-whitelist.json" download>Скачать JSON профиля</a></p></details>'
    },
    {
      title: 'Выберите импортированный профиль',
      body: '<p>Вернитесь в <strong>«Настройки» → раздел маршрутизации / правил трафика</strong>. Выберите <strong>GrimbirdVPN Whitelist</strong> и включите использование этого профиля или пресета, если в вашей версии есть такой переключатель.</p><div class="instruction-path"><strong>GrimbirdVPN Whitelist</strong><span aria-hidden="true">→</span><strong>Активен</strong></div><p>Проверьте: правила для доменов и IP Grimbird направлены <strong>напрямую (direct)</strong>, правило «Other IPs via VPN» — <strong>через VPN (proxy)</strong>.</p>',
      next: 'Профиль выбран',
      extra: '<details class="help"><summary>Ошибка GeoSite / GeoIP или правила не применяются</summary><p>Вернитесь к шагу со списками Grimbird и убедитесь, что оба файла обновлены. Если ваша подписка задаёт собственную маршрутизацию, она может иметь приоритет над выбранным профилем — уточните это у того, кто выдал ссылку.</p></details>'
    },
    {
      title: 'Включите VPN',
      body: '<p>На вкладке <strong>«Подключение»</strong> выберите свой сервер и нажмите большую кнопку питания. На скриншоте сервер уже добавлен, но VPN пока отключён.</p><p>Подтвердите запрос на создание VPN-подключения. Дождитесь статуса подключения, затем откройте браузер и проверьте, что сайты работают. Если VPN уже был включён до изменения маршрутизации, переподключитесь.</p><div class="note">Название вашего сервера может отличаться от примера. Другой VPN перед подключением нужно отключить.</div>',
      media: [['v2raytun-connect.jpg', 'v2RayTun на iPhone: добавленный и выбранный сервер, кнопка питания, статус «Отключено»']],
      next: 'Да, всё работает', extra: help()
    }
  ]
};

function render() {
  const route = location.hash.slice(1).split('/');
  const [page, client, value] = route;
  let content = '';
  let stage = 1;
  let backTo = 'start';

  if (page === 'choose-installed' || page === 'choose-new') {
    const installed = page === 'choose-installed';
    stage = 2;
    content = heading('Ваше приложение', installed ? 'Какое приложение у вас установлено?' : 'Какой клиент хотите установить?', installed ? 'Выберите свой клиент — сразу перейдём к настройке.' : 'Оба клиента подходят для подключения. Выберите удобный для себя.');
    content += `<div class="client-grid">${Object.entries(clients).map(([id, data]) => `<a class="client-card" href="#${installed ? 'setup/' + id + '/1' : 'device/' + id}"><img src="${data.icon}" alt="" width="76" height="76"><strong>${data.name}</strong><span>${id === 'incy' ? 'iOS, Android и компьютеры' : installed ? 'Настроить установленное приложение' : 'Доступен на Android'}</span><span class="card-cta">${installed ? 'Перейти к настройке' : 'Выбрать клиент'} <span aria-hidden="true">→</span></span></a>`).join('')}</div>`;
    if (!installed) content += '<aside class="note availability"><strong>Доступность на 27.09.2026</strong><p>Incy доступен в App Store и Google Play, включая российский регион. v2RayTun можно установить на Android; в российском App Store он недоступен. Если он уже установлен на iPhone, можно перейти к настройке.</p></aside>';
  } else if (page === 'device' && clients[client]) {
    stage = 3;
    backTo = 'choose-new';
    content = clientMark(client) + heading('Установка', 'На каком устройстве?', 'Покажем ссылки для вашей системы. После установки вернитесь сюда.');
    const options = client === 'incy' ? Object.entries(systems) : [['android', 'Android'], ['ios', 'iPhone / iPad']];
    content += `<div class="device-grid">${options.map(([id, name]) => `<a class="device" href="#install/${client}/${id}"><strong>${name}</strong><span aria-hidden="true">→</span></a>`).join('')}</div>`;
    if (client === 'v2raytun') content += '<p class="hint">На компьютере? <a href="#device/incy">Установить Incy для macOS, Windows или Linux</a>.</p>';
  } else if (page === 'install' && clients[client] && systems[value] && (client === 'incy' || ['android', 'ios'].includes(value))) {
    stage = 3;
    backTo = `device/${client}`;
    content = clientMark(client) + heading(systems[value], `Установите ${clients[client].name}`, 'Откройте ссылку ниже, установите приложение и вернитесь на эту страницу.');
    if (client === 'v2raytun' && value === 'ios') {
      content = clientMark(client) + heading('iPhone / iPad', 'В российском App Store приложение недоступно', 'По состоянию на 27.09.2026 для новой установки на iPhone рекомендуем Incy.');
      content += `<div class="actions">${action('install/incy/ios', 'Установить Incy')}${action('setup/v2raytun/1', 'v2RayTun уже установлен', true)}</div>`;
    } else {
      const downloads = client === 'incy' ? incyDownloads[value] : [
        ['https://play.google.com/store/apps/details?id=com.v2raytun.android', 'Открыть Google Play', 'v2RayTun для Android'],
        ['https://github.com/LXST-CODE/v2RayTun/releases/download/android-v5.25.82/v2RayTun-android-universal-v5.25.82.apk', 'Скачать APK', 'Универсальная сборка Android · 5.25.82'],
        ['https://github.com/LXST-CODE/v2RayTun/releases?q=android', 'Все версии для Android', 'Релизы разработчика на GitHub']
      ];
      content += `<div class="download-list">${downloads.map(item => link(...item)).join('')}</div>`;
      if (client === 'incy' && ['mac', 'windows', 'linux'].includes(value)) content += '<p class="hint">Версии с GitHub находятся на стадии pre-alpha: интерфейс может отличаться от мобильной инструкции. Выбирайте файл для своей системы и процессора.</p>';
      if (value === 'android') content += '<p class="hint">При установке APK Android может запросить разрешение на установку из этого источника. После установки его можно отключить.</p>';
      content += `<div class="confirmation"><h2>Удалось установить приложение?</h2><div class="actions">${action(`setup/${client}/1/${value}`, 'Да, перейти к настройке')}<button class="button secondary" type="button" id="install-help-button" aria-expanded="false" aria-controls="install-help">Нет, нужна помощь</button></div><div id="install-help" class="note" hidden><p>Проверьте свободное место и совместимость устройства на странице загрузки. Если магазин не открывается, попробуйте другую ссылку выше или откройте страницу в обычном браузере.</p><p><a href="#choose-new">Выбрать другой клиент</a></p></div></div>`;
    }
  } else if (page === 'setup' && clients[client] && /^\d+$/.test(value || '') && guides[client][Number(value) - 1]) {
    stage = 4;
    const index = Number(value) - 1;
    const guide = guides[client][index];
    const system = systems[route[3]] ? route[3] : '';
    const suffix = system ? '/' + system : '';
    backTo = index ? `setup/${client}/${index}${suffix}` : system ? `install/${client}/${system}` : 'choose-installed';
    content = clientMark(client) + heading(`Настройка · ${index + 1} из ${guides[client].length}`, guide.title, '');
    content += `<div class="guide-body">${guide.body}${guide.media ? shots(guide.media) : ''}</div>`;
    if (client === 'v2raytun' && guide.media) content += '<p class="hint">На скриншоте — iPhone. На Android внешний вид может отличаться.</p>';
    content += `<p class="hint">Названия пунктов могут немного отличаться в зависимости от системы и версии ${clients[client].name}.</p>`;
    content += `<div class="actions">${action(index + 1 === guides[client].length ? `done/${client}${suffix}` : `setup/${client}/${index + 2}${suffix}`, guide.next + ' →')}</div>${guide.extra || ''}`;
  } else if (page === 'done' && clients[client]) {
    stage = 4;
    backTo = `setup/${client}/${guides[client].length}${systems[value] ? '/' + value : ''}`;
    content = '<div class="success-symbol" aria-hidden="true">✓</div>' + heading('Всё готово', 'Можно пользоваться', `${clients[client].name} настроен. Включайте и выключайте VPN в приложении.`);
    content += '<div class="note"><strong>Поддерживайте приложение в актуальном состоянии</strong><p>Обновления помогают сохранять стабильное подключение.</p></div>';
    content += `<div class="actions">${action(`device/${client}`, 'Ссылки для скачивания', true)}${action('start', 'Настроить другое устройство', true)}</div>${help()}`;
  } else {
    content = heading('Начнём с простого', 'У вас уже установлено VPN-приложение?', 'Ответьте на несколько вопросов — покажем только нужные шаги для подключения.');
    content += '<div class="answer-grid"><a class="answer" href="#choose-installed"><span class="answer-icon" aria-hidden="true">✓</span><strong>Да, установлено</strong><span>Перейти к настройке клиента</span><b aria-hidden="true">→</b></a><a class="answer" href="#choose-new"><span class="answer-icon" aria-hidden="true">↓</span><strong>Нет, пока нет</strong><span>Сначала поможем установить</span><b aria-hidden="true">→</b></a></div><p class="hint centered">Вам понадобится персональная ссылка для подключения к VPN.</p>';
  }

  const installedFlow = (page === 'setup' && !systems[route[3]]) || (page === 'done' && !systems[value]) || page === 'choose-installed';
  const stages = installedFlow ? ['Начало', 'Клиент', 'Настройка'] : ['Начало', 'Клиент', 'Установка', 'Настройка'];
  if (installedFlow && stage === 4) stage = 3;
  progress.innerHTML = stages.map((name, i) => `<li class="${i + 1 < stage ? 'complete' : i + 1 === stage ? 'current' : ''}" ${i + 1 === stage ? 'aria-current="step"' : ''}><span>${i + 1 < stage ? '✓' : i + 1}</span>${name}</li>`).join('');
  back.hidden = !page || page === 'start' || !['choose-installed', 'choose-new', 'device', 'install', 'setup', 'done'].includes(page);
  back.href = '#' + backTo;
  app.innerHTML = content;
  document.title = (clients[client] ? `Настройка ${clients[client].name}` : 'Подключение к VPN') + ' · Пошаговая инструкция';
  const helpButton = document.querySelector('#install-help-button');
  if (helpButton) helpButton.addEventListener('click', () => {
    const panel = document.querySelector('#install-help');
    panel.hidden = !panel.hidden;
    helpButton.setAttribute('aria-expanded', String(!panel.hidden));
  });
  app.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const id = button.dataset.copy;
    const field = document.querySelector('#copy-' + id);
    const status = document.querySelector('#copy-status-' + id);
    try {
      await navigator.clipboard.writeText(field.value);
      status.textContent = 'Скопировано. Вернитесь в v2RayTun и вставьте в соответствующее поле.';
    } catch {
      field.focus();
      field.select();
      status.textContent = 'Автоматическое копирование недоступно. Текст выделен — скопируйте его вручную.';
    }
  }));
  window.scrollTo(0, 0);
  app.querySelector('h1').focus({ preventScroll: true });
}
window.addEventListener('hashchange', render);
render();

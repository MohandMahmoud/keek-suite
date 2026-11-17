/*
 * KEEKX — the layer that turns the KEEK web app into the desktop app / browser extension.
 *
 * Loaded BEFORE app.js. app.js calls:
 *   KEEKX.init()       – load AI config + platform info (before storage loads)
 *   KEEKX.install()    – wrap a few app functions (after app.js has defined them)
 *   KEEKX.afterBoot()  – run queued commands (e.g. "start recording" from the extension)
 * plus small render hooks (desktopOption, sourcePicker, captureNote, uploadSttBlock, …).
 *
 * Everything platform-specific goes through window.KEEK_PLATFORM (see platform.js):
 *   nlp.getConfig/setConfig/test/transcribe, capture.getSystemStream/getTabStream,
 *   bridge.onCommand/report, info(), openExternal(), notify()
 */
(function () {
  'use strict';
  const P = () => window.KEEK_PLATFORM || { kind: 'web', capture: {}, bridge: {}, nlp: null };
  const X = window.KEEKX = { kind: 'web', cfg: {}, info: {}, devices: null, booted: false, queue: [] };

  /* ------------------------------------------------------------------ strings */
  const STR = {
    ar: {
      set_ai: 'الذكاء الاصطناعي', svcAI: 'الذكاء الاصطناعي (Groq + Gemini)',
      aiDesc: 'يحلل النصوص ويفرّغ الصوت ويجيب على أسئلة البحث بمصادر، عبر مفاتيحك المجانية من Groq وGemini.',
      aiOffTitle: 'أضف مفتاح ذكاء اصطناعي مجاني', aiOffBody: 'التحليل والتفريغ والبحث الذكي تحتاج مفتاحاً مجانياً من Groq أو Google Gemini. الاستيراد والبحث بالكلمات والتعديل تعمل بدونه.',
      aiDeclined: 'لا يوجد مفتاح ذكاء اصطناعي صالح. راجع الإعدادات ← الذكاء الاصطناعي.', aiUnavailable: 'أضف مفتاح Groq أو Gemini من الإعدادات ← الذكاء الاصطناعي.',
      accountNote: 'لا يوجد حساب: كيكـ يعمل محلياً. يُرسَل فقط النص أو الصوت الذي تعالجه إلى مزود الذكاء الاصطناعي الذي تختاره.',
      processorsNote: 'معالجات البيانات: Groq وGoogle Gemini (بمفاتيحك الخاصة) لتحليل النصوص وتفريغ الصوت. تخضع البيانات المرسلة لشروط كل مزود؛ الطبقة المجانية من Gemini قد تستخدم المحتوى لتحسين خدمات Google.',
      noTraining: 'كيكـ نفسه لا يدرّب أي نموذج على بياناتك. راجع سياسات المزودين في docs/07-privacy-security.md.',
      optUploadD: 'أرفق التسجيل ليُفرَّغ تلقائياً عبر Groq Whisper أو Gemini، ثم راجع النص.',
      srUnsupported: 'التفريغ المباشر غير متاح: أضف مفتاح Groq أو Gemini من الإعدادات. ما زال الصوت يُسجَّل ويمكن تفريغه بعد الانتهاء.',
      exportLater: 'تصدير DOCX وPDF مخطط لاحقاً.',
      integrationsSub: 'اربط كيكـ بالأدوات التي تعمل بها. الذكاء الاصطناعي وتطبيق سطح المكتب والإضافة تعمل الآن؛ الباقي حسب خارطة الطريق.',
      browserRecording: 'تسجيل اجتماع', browserRecordingSub: 'صوت الاجتماع والميكروفون مع تفريغ مباشر.',
      aiPageIntro: 'كيكـ يستخدم الطبقات المجانية من Groq وGoogle Gemini. أضف مفتاحاً واحداً على الأقل؛ مع المفتاحين يختار كيكـ الأنسب ويتحوّل للآخر عند تجاوز الحد أو حدوث خطأ.',
      groqKey: 'مفتاح Groq API', geminiKey: 'مفتاح Google Gemini API', getFreeKey: 'احصل على مفتاح مجاني', keySaved: 'محفوظ ({k})', keyNone: 'لا يوجد مفتاح', keyPh: 'الصق المفتاح هنا ثم احفظ',
      removeKey: 'إزالة', testKey: 'اختبار', testing: 'جارٍ الاختبار…', testOk: 'يعمل — {n} نموذج متاح',
      provider: 'مزود التحليل', prov_auto: 'تلقائي (Groq للنصوص القصيرة، Gemini للطويلة)', prov_groq: 'Groq فقط', prov_gemini: 'Gemini فقط',
      sttProvider: 'مزود التفريغ الصوتي', stt_auto: 'تلقائي (Groq Whisper ثم Gemini)', stt_groq: 'Groq Whisper فقط', stt_gemini: 'Gemini فقط (يميّز المتحدثين)',
      liveEngine: 'التفريغ المباشر أثناء التسجيل', live_auto: 'تلقائي', live_cloud: 'سحابي (Whisper/Gemini كل بضع ثوانٍ)', live_browser: 'التعرف على الكلام في المتصفح (ميكروفون فقط)', live_off: 'إيقاف (فرّغ بعد الانتهاء)',
      routingTitle: 'التوجيه', models: 'النماذج', groqModel: 'نموذج Groq للنصوص', groqSttModel: 'نموذج Groq للتفريغ', geminiModel: 'نموذج Gemini',
      chunkSec: 'طول مقطع التفريغ المباشر (ثوانٍ)', groqBudget: 'أقصى حجم نص لـ Groq (توكن)',
      groqBudgetHint: 'النصوص الأطول تذهب إلى Gemini تلقائياً، لأن حد Groq المجاني حوالي ١٢ ألف توكن في الدقيقة. اختبر المفتاح لعرض النماذج المتاحة.',
      saveAi: 'حفظ الإعدادات', aiSaved: 'تم حفظ إعدادات الذكاء الاصطناعي', usageTitle: 'الاستخدام منذ تشغيل التطبيق', usageLineP: '{p}: {r} طلب، {e} خطأ',
      keysStoredDesktop: 'المفاتيح مشفّرة على هذا الجهاز ولا تُعرض مرة أخرى.', keysStoredExt: 'المفاتيح محفوظة في تخزين الإضافة على هذا المتصفح.',
      freeLimits: 'حدود الطبقات المجانية تتغير؛ راجع docs/02-free-api-keys.md.',
      langAuto: 'تلقائي / مختلط عربي-إنجليزي', micLabel: 'الميكروفون', micDefault: 'الافتراضي', micN: 'ميكروفون {n}',
      sysLabel: 'صوت الاجتماع', sys_off: 'بدون (ميكروفون فقط)', sys_loopback: 'صوت الجهاز بالكامل (loopback)', sys_tab: 'صوت تبويب الاجتماع', sys_dev: 'جهاز إدخال: {n}',
      sysFailed: 'تعذّر التقاط صوت الاجتماع ({e})؛ يستمر التسجيل بالميكروفون فقط.',
      noteSys: 'يُسجَّل صوت الاجتماع وصوتك معاً. استخدم سماعات رأس لتجنب الصدى.', noteMic: 'الميكروفون فقط: صوت الطرف الآخر لا يُسجَّل إلا إذا خرج من السماعات.',
      noteLive_cloud: 'التفريغ المباشر عبر {p} كل {s} ثانية.', noteLive_browser: 'التفريغ المباشر عبر التعرف على الكلام في المتصفح (يسمع الميكروفون فقط).',
      sttWorking: 'يفرّغ…', sttFinishing: 'يكمل تفريغ آخر المقاطع…', transcribeRec: 'تفريغ التسجيل بالذكاء الاصطناعي', transcribingP: 'جارٍ التفريغ {p}',
      upAuto: 'تفريغ تلقائي', upTitle: 'التفريغ الآلي', upBody: 'يُرسَل الملف إلى {p} لتحويله إلى نص بتوقيتات، ثم تراجع النص قبل التحليل. الملفات الكبيرة تُقسَّم إلى مقاطع ٥ دقائق.',
      upLang: 'لغة الكلام', upDiarize: 'تمييز المتحدثين', sttFailed: 'تعذّر التفريغ: {e}', fileTooBig: 'الملف كبير جداً للتفريغ داخل التطبيق (الحد ٣٠٠ ميجابايت).',
      decodeFailed: 'تعذّر قراءة الصوت من هذا الملف. جرّب MP3 أو WAV أو M4A.',
      ready: 'جاهز', running: 'يعمل', thisApp: 'هذا التطبيق', pairCode: 'كود الاقتران', newCode: 'كود جديد',
      pairHint: 'افتح نافذة إضافة كيكـ في Chrome والصق هذا الكود، لتتمكن الإضافة من بدء التسجيل وإيقافه هنا.',
      extDesc: 'تكتشف Meet وZoom وTeams على الويب، تقرأ عنوان الاجتماع، وتسجّل صوت التبويب أو تتحكم في تطبيق سطح المكتب.',
      deskDesc: 'يلتقط صوت النظام والميكروفون بدون بوت، ويحفظ بياناتك كملفات على جهازك.',
      deskFromExt: 'ثبّت تطبيق سطح المكتب لالتقاط صوت أي تطبيق (Zoom/Teams لسطح المكتب)، ثم اربطه من نافذة الإضافة.',
      configure: 'إعداد', openAiSettings: 'افتح إعدادات الذكاء الاصطناعي', extRecTab: 'تسجيل تبويب اجتماع',
      noKeyErr: 'لا يوجد مفتاح ذكاء اصطناعي. أضف مفتاح Groq أو Gemini المجاني من الإعدادات ← الذكاء الاصطناعي.',
      authErr: 'رفض {p} المفتاح. تحقق منه في الإعدادات ← الذكاء الاصطناعي.', tooLargeErr: 'المحتوى أكبر من حد المزود. جرّب Gemini (سياق أكبر) أو قسّم الاجتماع.',
      cmdFinishSetup: 'أكمل إعداد كيكـ أولاً، ثم أعد المحاولة.', recStartedRemote: 'بدأ التسجيل من إضافة المتصفح', sttStopped: 'مشكلة في التفريغ المباشر: {e}',
      dataFolder: 'مجلد البيانات', version: 'الإصدار', yes: 'نعم', no: 'لا'
    },
    en: {
      set_ai: 'AI', svcAI: 'AI (Groq + Gemini)',
      aiDesc: 'Analyses transcripts, transcribes audio and answers search questions with sources, using your free Groq and Gemini keys.',
      aiOffTitle: 'Add a free AI key', aiOffBody: 'Analysis, transcription and AI search need a free Groq or Google Gemini API key. Import, keyword search and editing work without one.',
      aiDeclined: 'No working AI key. Check Settings → AI.', aiUnavailable: 'Add a Groq or Gemini key in Settings → AI.',
      accountNote: 'There’s no account: KEEK runs locally. Only the text or audio you process is sent to the AI provider you choose.',
      processorsNote: 'Data processors: Groq and Google Gemini (with your own keys) analyse transcripts and transcribe audio. Data you send follows each provider’s terms; Gemini’s free tier may use content to improve Google’s products.',
      noTraining: 'KEEK itself never trains on your data. See provider policies in docs/07-privacy-security.md.',
      optUploadD: 'Attach a recording; it’s transcribed with Groq Whisper or Gemini, then you review the text.',
      srUnsupported: 'Live transcription is unavailable: add a Groq or Gemini key in Settings. Audio is still recorded and can be transcribed afterwards.',
      exportLater: 'DOCX and PDF export are planned.',
      integrationsSub: 'Connect KEEK to the tools you work in. AI, the desktop app and the extension work today; the rest follow the roadmap.',
      browserRecording: 'Record a meeting', browserRecordingSub: 'Meeting audio and microphone, with live transcription.',
      aiPageIntro: 'KEEK uses the free tiers of Groq and Google Gemini. Add at least one key; with both, KEEK picks the best fit and switches to the other on limits or errors.',
      groqKey: 'Groq API key', geminiKey: 'Google Gemini API key', getFreeKey: 'Get a free key', keySaved: 'Saved ({k})', keyNone: 'No key', keyPh: 'Paste the key here, then save',
      removeKey: 'Remove', testKey: 'Test', testing: 'Testing…', testOk: 'Works — {n} models available',
      provider: 'Analysis provider', prov_auto: 'Auto (Groq for short, Gemini for long)', prov_groq: 'Groq only', prov_gemini: 'Gemini only',
      sttProvider: 'Transcription provider', stt_auto: 'Auto (Groq Whisper, then Gemini)', stt_groq: 'Groq Whisper only', stt_gemini: 'Gemini only (labels speakers)',
      liveEngine: 'Live transcription while recording', live_auto: 'Automatic', live_cloud: 'Cloud (Whisper/Gemini every few seconds)', live_browser: 'Browser speech recognition (microphone only)', live_off: 'Off (transcribe afterwards)',
      routingTitle: 'Routing', models: 'Models', groqModel: 'Groq text model', groqSttModel: 'Groq speech model', geminiModel: 'Gemini model',
      chunkSec: 'Live chunk length (seconds)', groqBudget: 'Max prompt size for Groq (tokens)',
      groqBudgetHint: 'Longer prompts go to Gemini automatically, because Groq’s free limit is about 12k tokens per minute. Test a key to list the models you can use.',
      saveAi: 'Save settings', aiSaved: 'AI settings saved', usageTitle: 'Usage since the app started', usageLineP: '{p}: {r} requests, {e} errors',
      keysStoredDesktop: 'Keys are encrypted on this device and never shown again.', keysStoredExt: 'Keys are stored in this browser’s extension storage.',
      freeLimits: 'Free-tier limits change; see docs/02-free-api-keys.md.',
      langAuto: 'Auto / mixed Arabic–English', micLabel: 'Microphone', micDefault: 'Default', micN: 'Microphone {n}',
      sysLabel: 'Meeting audio', sys_off: 'None (microphone only)', sys_loopback: 'All computer audio (loopback)', sys_tab: 'Meeting tab audio', sys_dev: 'Input device: {n}',
      sysFailed: 'Couldn’t capture meeting audio ({e}); recording continues with the microphone only.',
      noteSys: 'Meeting audio and your voice are recorded together. Use headphones to avoid echo.', noteMic: 'Microphone only: the other side is recorded only if it plays through your speakers.',
      noteLive_cloud: 'Live transcription via {p} every {s} seconds.', noteLive_browser: 'Live transcription via the browser’s speech recognition (hears the microphone only).',
      sttWorking: 'Transcribing…', sttFinishing: 'Finishing the last chunks…', transcribeRec: 'Transcribe the recording with AI', transcribingP: 'Transcribing {p}',
      upAuto: 'Transcribe automatically', upTitle: 'Automatic transcription', upBody: 'The file is sent to {p} and turned into timestamped text, which you review before analysis. Large files are split into 5-minute chunks.',
      upLang: 'Spoken language', upDiarize: 'Label speakers', sttFailed: 'Transcription failed: {e}', fileTooBig: 'The file is too large to transcribe in-app (limit 300 MB).',
      decodeFailed: 'Couldn’t read audio from this file. Try MP3, WAV or M4A.',
      ready: 'Ready', running: 'Running', thisApp: 'This app', pairCode: 'Pairing code', newCode: 'New code',
      pairHint: 'Open the KEEK extension popup in Chrome and paste this code, so the extension can start and stop recording here.',
      extDesc: 'Detects Meet, Zoom and Teams on the web, reads the meeting title, and records the tab audio or controls KEEK Desktop.',
      deskDesc: 'Captures system audio and microphone with no bot, and keeps your data as files on your computer.',
      deskFromExt: 'Install KEEK Desktop to capture any app’s audio (desktop Zoom/Teams), then pair it from the extension popup.',
      configure: 'Configure', openAiSettings: 'Open AI settings', extRecTab: 'Record a meeting tab',
      noKeyErr: 'No AI key. Add a free Groq or Gemini key in Settings → AI.',
      authErr: '{p} rejected the key. Check it in Settings → AI.', tooLargeErr: 'The content is larger than the provider allows. Try Gemini (larger context) or split the meeting.',
      cmdFinishSetup: 'Finish setting up KEEK first, then try again.', recStartedRemote: 'Recording started from the browser extension', sttStopped: 'Live transcription problem: {e}',
      dataFolder: 'Data folder', version: 'Version', yes: 'Yes', no: 'No'
    }
  };
  const KIND_STR = {
    desktop: {
      ar: {
        desktopStatusDev: 'مثبّت ويعمل — التقاط صوت النظام والميكروفون جاهز.',
        onbDesktopNote: 'أضف لاحقاً مفتاحاً مجانياً من Groq أو Gemini من الإعدادات ← الذكاء الاصطناعي لتفعيل التفريغ والتحليل.',
        optDesktopD: 'يلتقط صوت النظام والميكروفون معاً بدون بوت، مع تفريغ مباشر.', optBrowser: 'التسجيل بالميكروفون فقط', optBrowserD: 'بدون صوت النظام؛ مناسب للاجتماعات الحضورية.',
        storeDesc_db: 'بياناتك محفوظة كملفات على هذا الجهاز فقط: {path}',
        sysAudioBody: 'يُلتقط صوت النظام عبر loopback (Windows، وmacOS 13+ مع إذن "تسجيل الشاشة"). بديل: جهاز صوت افتراضي مثل BlackHole أو VB-Cable تختاره من شاشة التسجيل.',
        audioDesktopNote: 'اختر الميكروفون ومصدر صوت الاجتماع من شاشة التسجيل.', notifyDesktop_d: 'عند اكتمال المعالجة والتطبيق في الخلفية.'
      },
      en: {
        desktopStatusDev: 'Installed and running — system audio + microphone capture is ready.',
        onbDesktopNote: 'Add a free Groq or Gemini key later in Settings → AI to turn on transcription and analysis.',
        optDesktopD: 'Captures system audio and microphone together, no bot, with live transcription.', optBrowser: 'Record microphone only', optBrowserD: 'No system audio; good for in-person meetings.',
        storeDesc_db: 'Your data is stored as files on this computer only: {path}',
        sysAudioBody: 'System audio is captured via loopback (Windows, and macOS 13+ with Screen Recording permission). Alternative: a virtual audio device such as BlackHole or VB-Cable, picked on the recording screen.',
        audioDesktopNote: 'Pick the microphone and meeting-audio source on the recording screen.', notifyDesktop_d: 'When processing finishes while KEEK is in the background.'
      }
    },
    extension: {
      ar: {
        desktopStatusDev: 'إن كان تطبيق كيكـ لسطح المكتب مثبتاً، اربطه من نافذة الإضافة بكود الاقتران.',
        onbDesktopNote: 'من الإضافة يمكنك تسجيل صوت تبويب الاجتماع مع الميكروفون، أو التحكم في تطبيق سطح المكتب.',
        optDesktopD: 'افتح الاجتماع في تبويب، ثم اضغط أيقونة كيكـ واختر "سجّل هذا التبويب".',
        storeDesc_db: 'بياناتك محفوظة في تخزين الإضافة داخل ملف تعريف هذا المتصفح فقط.', sys_loopback: 'مشاركة تبويب أو الشاشة مع الصوت',
        sysAudioBody: 'في الإضافة يُلتقط صوت تبويب الاجتماع (Meet/Zoom/Teams على الويب). لصوت التطبيقات الأخرى استخدم تطبيق سطح المكتب.'
      },
      en: {
        desktopStatusDev: 'If KEEK Desktop is installed, pair it from the extension popup with the pairing code.',
        onbDesktopNote: 'From the extension you can record the meeting tab’s audio plus your microphone, or control KEEK Desktop.',
        optDesktopD: 'Open the meeting in a tab, click the KEEK icon and choose “Record this tab”.',
        storeDesc_db: 'Your data is stored in this browser profile’s extension storage only.', sys_loopback: 'Share a tab or screen with audio',
        sysAudioBody: 'In the extension, the meeting tab’s audio is captured (Meet/Zoom/Teams on the web). For other apps, use KEEK Desktop.'
      }
    }
  };

  X.applyStrings = function () {
    const ks = KIND_STR[X.kind] || {};
    ['ar', 'en'].forEach(l => {
      Object.assign(I18N[l], STR[l], ks[l] || {});
      if (I18N[l].storeDesc_db) I18N[l].storeDesc_db = I18N[l].storeDesc_db.split('{path}').join(X.info.dataPath || '');
    });
  };

  /* ------------------------------------------------------------------ config & lifecycle */
  X.loadCfg = async function () {
    try { X.cfg = (P().nlp && await P().nlp.getConfig()) || {}; } catch (e) { console.warn('config', e); X.cfg = {}; }
    X.cfgAt = Date.now();
    return X.cfg;
  };
  X.hasKey = () => !!(X.cfg && (X.cfg.hasGroqKey || X.cfg.hasGeminiKey));
  X.effStt = function () {
    const c = X.cfg || {};
    if (c.sttProvider === 'gemini') return c.hasGeminiKey ? 'gemini' : null;
    if (c.sttProvider === 'groq') return c.hasGroqKey ? 'groq' : null;
    return c.hasGroqKey ? 'groq' : c.hasGeminiKey ? 'gemini' : null;
  };
  X.sttName = () => ({ groq: 'Groq Whisper', gemini: 'Google Gemini' })[X.effStt()] || 'AI';
  X.canNotify = () => X.kind === 'desktop' && !!P().notify;

  X.init = async function () {
    X.kind = P().kind || 'web';
    try { X.info = (P().info && await P().info()) || {}; } catch (e) { X.info = {}; }
    await X.loadCfg();
    X.applyStrings();
    const b = P().bridge;
    if (b && b.onCommand) b.onCommand(cmd => X.command(cmd));
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', () => { X.devices = null; if (UI.route === 'record' && REC.state === 'idle') render(); });
    }
  };

  X.afterBoot = function () {
    X.booted = true;
    const q = X.queue.splice(0);
    if (P().initialCommand) q.push(P().initialCommand);
    q.forEach(c => X.command(c));
    setInterval(X.report, 1000);
  };

  /* ------------------------------------------------------------------ commands from extension / desktop */
  X.command = function (cmd) {
    if (!cmd || !cmd.cmd) return;
    if (!X.booted) { X.queue.push(cmd); return; }
    if (!S) { toast(t('cmdFinishSetup')); return; }
    const busy = REC.active() || REC.state === 'stopped';
    switch (cmd.cmd) {
      case 'prepareRecord':
      case 'startRecord': {
        if (busy) { go('record'); return; }
        const mt = cmd.meeting || {};
        REC.form = {
          title: mt.title || '', date: nowLocal(), projectId: '', platform: PLATFORMS.includes(mt.platform) ? mt.platform : 'other',
          participants: '', tags: '', lang: S.settings.lang === 'en' ? 'en-US' : 'ar-EG', consent: !!cmd.consent,
          url: mt.url || '', tabId: cmd.tabId != null ? cmd.tabId : null, sys: null, mic: null
        };
        REC.form.sys = cmd.sys || X.defaultSys(REC.form);
        REC.form.mic = S.settings.kxMic || 'default';
        go('record');
        if (cmd.cmd === 'startRecord' && REC.form.consent) Promise.resolve(A.recStart()).then(() => { if (REC.state === 'recording') toast(t('recStartedRemote')); });
        break;
      }
      case 'stopRecord':
        if (REC.state === 'recording' || REC.state === 'paused') A.recStop();
        go('record');
        break;
      case 'toggleRecord':
        if (REC.state === 'recording' || REC.state === 'paused') A.recStop();
        go('record');
        break;
      case 'open':
        if (cmd.route && VIEWS[cmd.route]) go(cmd.route, cmd.params || {}, cmd.tab);
        break;
    }
  };

  X.report = function () {
    const b = P().bridge;
    if (!b || !b.report) return;
    const s = { state: REC.state, elapsedMs: REC.elapsed ? REC.elapsed() : 0, title: (REC.form && REC.form.title) || '', live: REC.liveMode || null };
    const k = s.state + '|' + s.title;
    if (s.state === 'recording' || s.state === 'paused' || k !== X.lastReport) {
      X.lastReport = k;
      try { b.report(s); } catch (e) { /* ignore */ }
    }
  };

  /* ------------------------------------------------------------------ capture: mic + meeting audio */
  const cap = () => P().capture || {};
  X.validSys = (v, f) => v === 'off' || (v === 'loopback' && !!cap().loopback) || (v === 'tab' && !!cap().tab && f && f.tabId != null) || /^dev:/.test(v || '');
  X.defaultSys = function (f) {
    f = f || {};
    if (f.tabId != null && cap().tab) return 'tab';
    const saved = S && S.settings.kxSys;
    if (saved && saved !== 'tab' && X.validSys(saved, f)) return saved;
    return cap().loopback && cap().loopbackDefault !== false ? 'loopback' : 'off';
  };

  X.loadDevices = async function () {
    if (X.devLoading) return;
    X.devLoading = true;
    try {
      const l = await navigator.mediaDevices.enumerateDevices();
      X.devices = l.filter(d => d.kind === 'audioinput' && d.deviceId && !['default', 'communications'].includes(d.deviceId)).map(d => ({ id: d.deviceId, label: d.label }));
    } catch (e) { X.devices = []; }
    X.devLoading = false;
    if (UI.route === 'record' && REC.state === 'idle') render();
  };

  X.sourcePicker = function (f) {
    if (f.sys == null) { f.sys = X.forceSys || X.defaultSys(f); X.forceSys = null; }
    if (f.mic == null) f.mic = (S.settings.kxMic) || 'default';
    if (!X.devices) X.loadDevices();
    const devs = X.devices || [];
    const name = (d, i) => d.label || t('micN', { n: fmtNum(i + 1) });
    const opt = (v, label) => `<option value="${esc(v)}" ${f.sys === v ? 'selected' : ''}>${esc(label)}</option>`;
    let sysOpts = opt('off', t('sys_off'));
    if (cap().loopback) sysOpts += opt('loopback', t('sys_loopback'));
    if (cap().tab && f.tabId != null) sysOpts += opt('tab', t('sys_tab'));
    devs.forEach((d, i) => { sysOpts += opt('dev:' + d.id, t('sys_dev', { n: name(d, i) })); });
    if (/^dev:/.test(f.sys) && !devs.some(d => 'dev:' + d.id === f.sys)) sysOpts += opt(f.sys, t('sys_dev', { n: '…' }));
    const micOpts = `<option value="default">${t('micDefault')}</option>` + devs.map((d, i) => `<option value="${esc(d.id)}" ${f.mic === d.id ? 'selected' : ''}>${esc(name(d, i))}</option>`).join('');
    return `<div class="grid2" style="position:relative;width:min(560px,100%)">
      <label class="field"><span>${t('sysLabel')}</span><select class="select" data-kx="sys">${sysOpts}</select></label>
      <label class="field"><span>${t('micLabel')}</span><select class="select" data-kx="mic">${micOpts}</select></label></div>`;
  };

  X.liveMode = function (f) {
    f = f || {};
    const eng = (X.cfg && X.cfg.liveEngine) || 'auto', key = X.hasKey();
    const bsr = !!(window.SpeechRecognition || window.webkitSpeechRecognition) && X.kind !== 'desktop';
    const sys = (f.sys || X.defaultSys(f)) !== 'off';
    if (eng === 'off') return 'none';
    if (eng === 'cloud') return key ? 'cloud' : 'none';
    if (eng === 'browser') return bsr ? 'browser' : 'none';
    if (X.kind === 'desktop') return key ? 'cloud' : 'none';
    if (sys && key) return 'cloud';
    if (bsr && f.lang !== 'auto') return 'browser';
    if (key) return 'cloud';
    return bsr ? 'browser' : 'none';
  };

  X.captureNote = function (f) {
    const sys = (f.sys || X.defaultSys(f)) !== 'off';
    const mode = X.liveMode(f);
    const live = mode === 'cloud' ? t('noteLive_cloud', { p: X.sttName(), s: fmtNum(X.chunkSec()) }) : mode === 'browser' ? t('noteLive_browser') : '';
    return `<div class="note" style="position:relative;max-width:560px">${sys ? t('noteSys') : t('noteMic')}${live ? '<br>' + live : ''}</div>`;
  };
  X.autoLangOption = f => `<option value="auto" ${f.lang === 'auto' ? 'selected' : ''}>${t('langAuto')}</option>`;
  X.chunkSec = () => Math.min(60, Math.max(8, +((X.cfg && X.cfg.chunkSec) || 20)));

  X.captureStream = async function (f) {
    X.mixCleanup();
    const base = { echoCancellation: true, noiseSuppression: true };
    const sel = f.sys || X.defaultSys(f);
    let sys = null, raw = null, monitor = false;
    // Meeting audio first: screen/tab pickers need the click's user activation, which a mic prompt would use up.
    try {
      if (sel === 'loopback') { const r = await cap().getSystemStream(); sys = r.stream; raw = r.raw; }
      else if (sel === 'tab') { const r = await cap().getTabStream(f.tabId); sys = r.stream; raw = r.raw; monitor = true; }
      else if (/^dev:/.test(sel)) { sys = raw = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: sel.slice(4) }, echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); }
    } catch (e) {
      console.warn('meeting audio capture failed', e);
      toast(t('sysFailed', { e: (e && (e.message || e.name)) || '?' }));
      sys = null;
    }
    let mic;
    try {
      if (f.mic && f.mic !== 'default') {
        try { mic = await navigator.mediaDevices.getUserMedia({ audio: Object.assign({ deviceId: { exact: f.mic } }, base) }); }
        catch (e) { if (e.name !== 'OverconstrainedError' && e.name !== 'NotFoundError') throw e; }
      }
      if (!mic) mic = await navigator.mediaDevices.getUserMedia({ audio: base });
    } catch (e) {
      if (raw) { try { raw.getTracks().forEach(x => x.stop()); } catch (_) { /* ignore */ } }
      throw e; // the app shows its own microphone error
    }
    X.devices = null; // labels become available after permission
    if (!sys) { X.mix = { raws: [mic] }; return mic; }
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    try { await ac.resume(); } catch (e) { /* ignore */ }
    const dest = ac.createMediaStreamDestination();
    const a = ac.createMediaStreamSource(mic), b = ac.createMediaStreamSource(sys);
    a.connect(dest); b.connect(dest);
    if (monitor) b.connect(ac.destination); // a captured tab is muted for the user unless we play it back
    X.mix = { ac, raws: [mic, raw || sys] };
    mic.getAudioTracks().forEach(tr => tr.addEventListener('ended', () => { if (REC.active()) { REC.err = t('micDisconnected'); A.recStop(); } }));
    return dest.stream;
  };
  X.mixCleanup = function () {
    const m = X.mix; if (!m) return; X.mix = null;
    (m.raws || []).forEach(s => { try { s.getTracks().forEach(x => x.stop()); } catch (e) { /* ignore */ } });
    try { m.ac && m.ac.close(); } catch (e) { /* ignore */ }
  };

  /* ------------------------------------------------------------------ audio utils */
  X.recMime = () => (window.MediaRecorder && ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'].find(m => MediaRecorder.isTypeSupported(m))) || '';
  X.decode = async function (blob) {
    const ab = await blob.arrayBuffer();
    const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const ctx = new Ctx(1, 16000, 16000); // decodeAudioData resamples to 16 kHz
    try { return await ctx.decodeAudioData(ab); } catch (e) { return null; }
  };
  X.mono = function (buf) {
    if (buf.numberOfChannels === 1) return buf.getChannelData(0);
    const out = new Float32Array(buf.length), n = buf.numberOfChannels;
    for (let c = 0; c < n; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) out[i] += d[i] / n; }
    return out;
  };
  X.wav = function (pcm, rate) {
    const b = new ArrayBuffer(44 + pcm.length * 2), v = new DataView(b);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + pcm.length * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
    v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, pcm.length * 2, true);
    for (let i = 0, o = 44; i < pcm.length; i++, o += 2) { const s = Math.max(-1, Math.min(1, pcm[i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); }
    return new Uint8Array(b);
  };
  X.rms = function (pcm) { let s = 0, n = 0; for (let i = 0; i < pcm.length; i += 8) { s += pcm[i] * pcm[i]; n++; } return Math.sqrt(s / Math.max(1, n)); };
  X.whisperLang = l => !l || l === 'auto' ? undefined : String(l).slice(0, 2);
  X.clock = ms => { const s = Math.floor((ms || 0) / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60, p = n => String(n).padStart(2, '0'); return (h ? h + ':' : '') + p(m) + ':' + p(x); };
  X.segsToText = segs => segs.map(s => `[${X.clock(s.start)}] ${s.speaker ? s.speaker + ': ' : ''}${s.text}`).join('\n');
  X.mimeFromName = n => ({ mp3: 'audio/mpeg', m4a: 'audio/mp4', mp4: 'video/mp4', wav: 'audio/wav', webm: 'audio/webm', ogg: 'audio/ogg', oga: 'audio/ogg', flac: 'audio/flac', aac: 'audio/aac' })[String(n).split('.').pop().toLowerCase()] || '';

  /** Transcribe a whole file/recording → segments [{start,end,text,speaker}] (ms). */
  X.transcribeBlob = async function (blob, o) {
    o = o || {};
    if (!X.hasKey()) { const e = new Error(t('noKeyErr')); e.code = 'no_key'; throw e; }
    if (blob.size > 300 * 1048576) throw new Error(t('fileTooBig'));
    const type = (blob.type || X.mimeFromName(blob.name || '')).split(';')[0];
    if (X.effStt() === 'groq' && blob.size <= 24 * 1048576 && /^(audio|video)\//.test(type)) {
      o.onProgress && o.onProgress(1, 1);
      try {
        const r = await P().nlp.transcribe(new Uint8Array(await blob.arrayBuffer()), { mimeType: type, filename: blob.name || ('audio.' + (type.split('/')[1] || 'webm')), language: o.language, diarize: o.diarize });
        return r.segments;
      } catch (e) {
        if (!['unsupported_format', 'too_large', 'bad_request'].includes(e.code)) throw e;
        console.warn('direct upload failed, decoding instead', e);
      }
    }
    const buf = await X.decode(blob);
    if (!buf) throw new Error(t('decodeFailed'));
    const pcm = X.mono(buf), rate = buf.sampleRate, per = rate * 300, n = Math.max(1, Math.ceil(pcm.length / per)), out = [];
    for (let i = 0; i < n; i++) {
      o.onProgress && o.onProgress(i + 1, n);
      const part = pcm.subarray(i * per, Math.min(pcm.length, (i + 1) * per));
      if (X.rms(part) < 0.002) continue;
      const r = await P().nlp.transcribe(X.wav(part, rate), { mimeType: 'audio/wav', filename: 'part' + (i + 1) + '.wav', language: o.language, diarize: o.diarize, offsetMs: i * 300000, prompt: out.slice(-3).map(s => s.text).join(' ') });
      out.push(...r.segments);
    }
    return out;
  };

  /* ------------------------------------------------------------------ live cloud transcription (chunked) */
  const STT = X.stt = {
    active: false, mr: null, queue: [], busy: false, pendingStops: 0, onDrain: null, prompt: '', failed: false, errors: 0,
    start(stream) {
      Object.assign(this, { stream, active: true, queue: [], busy: false, pendingStops: 0, onDrain: null, prompt: '', failed: false, errors: 0 });
      this._next(); this._timer();
    },
    _timer() { clearInterval(this.iv); this.iv = setInterval(() => this._rotate(), X.chunkSec() * 1000); },
    _next() {
      if (!this.active || !this.stream) return;
      const mime = X.recMime();
      let mr;
      try { mr = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined); } catch (e) { console.warn(e); return; }
      const parts = [], startMs = REC.elapsed();
      mr.ondataavailable = e => { if (e.data && e.data.size) parts.push(e.data); };
      mr.onstop = () => {
        this.pendingStops = Math.max(0, this.pendingStops - 1);
        this.queue.push({ blob: new Blob(parts, { type: mr.mimeType || mime || 'audio/webm' }), startMs });
        this._pump();
      };
      this.mr = mr;
      mr.start();
    },
    _stopRec(mr) { if (mr && mr.state !== 'inactive') { this.pendingStops++; try { mr.stop(); } catch (e) { this.pendingStops--; } } },
    _rotate() { if (!this.mr || REC.state !== 'recording') return; const old = this.mr; this.mr = null; this._next(); this._stopRec(old); },
    pause() { clearInterval(this.iv); const old = this.mr; this.mr = null; this._stopRec(old); },
    resume() { if (!this.active) return; this._next(); this._timer(); },
    stop() {
      clearInterval(this.iv); this.active = false;
      const old = this.mr; this.mr = null;
      return new Promise(res => { this.onDrain = res; this._stopRec(old); this._check(); });
    },
    _check() {
      if (this.onDrain && !this.busy && !this.queue.length && !this.pendingStops) { const f = this.onDrain; this.onDrain = null; f(); }
    },
    _interim() { REC.interim = (this.busy || this.queue.length) && REC.state !== 'stopped' ? '… ' + t('sttWorking') : ''; X.refreshLive(); },
    async _pump() {
      if (this.busy) return;
      const job = this.queue.shift();
      if (!job) { this._check(); return; }
      this.busy = true; this._interim();
      try {
        if (!this.failed) {
          const buf = await X.decode(job.blob);
          if (buf) {
            const pcm = X.mono(buf);
            if (X.rms(pcm) > 0.004) {
              const r = await P().nlp.transcribe(X.wav(pcm, buf.sampleRate), {
                mimeType: 'audio/wav', filename: 'chunk.wav', language: X.whisperLang(REC.form && REC.form.lang), prompt: this.prompt, offsetMs: job.startMs
              });
              r.segments.forEach(s => REC.segs.push({ t: s.start, text: s.text }));
              if (r.segments.length) this.prompt = r.segments.map(s => s.text).join(' ').slice(-200);
              this.errors = 0;
            }
          }
        }
      } catch (e) {
        console.warn('live stt', e);
        this.errors++;
        if (e.code === 'no_key' || e.code === 'auth' || this.errors >= 3) this.failed = true;
        REC.srErr = t('sttStopped', { e: AI.err(e) });
        if (REC.state === 'recording' || REC.state === 'paused') render();
      } finally {
        this.busy = false; this._interim(); this._pump();
      }
    }
  };
  X.refreshLive = function () { const el = $('#liveText'); if (el) { el.innerHTML = liveHtml(); el.scrollTop = el.scrollHeight; } };

  /* ------------------------------------------------------------------ render hooks */
  X.desktopOption = function () {
    if (X.kind === 'desktop') return `<button class="option" data-act="goRecordSys">${ic('monitor')}<div><b>${t('optDesktop')}</b><span class="small muted">${t('optDesktopD')}</span><div style="margin-top:6px"><span class="badge ok">${t('ready')}</span></div></div></button>`;
    if (X.kind === 'extension') return `<div class="option" aria-disabled="true">${ic('chrome')}<div><b>${t('extRecTab')}</b><span class="small muted">${t('optDesktopD')}</span></div></div>`;
    return `<button class="option" disabled>${ic('monitor')}<div><b>${t('optDesktop')}</b><span class="small muted">${t('optDesktopD')}</span><div style="margin-top:6px"><span class="badge warn">${t('notDetected')}</span></div></div></button>`;
  };

  X.uploadSttBlock = function (md_) {
    if (md_.mid) return '';
    if (!X.hasKey()) return aiSetup();
    const lang = md_.kxLang || 'auto', gem = X.effStt() === 'gemini';
    return `<div class="setup" style="background:var(--tint-soft);border:0">${ic('spark')}<div style="flex:1"><b>${t('upTitle')}</b>${t('upBody', { p: X.sttName() })}
      <div class="grid2" style="margin-top:10px"><label class="field"><span>${t('upLang')}</span><select class="select" data-kx="upLang">
        <option value="auto" ${lang === 'auto' ? 'selected' : ''}>${t('langAuto')}</option><option value="ar" ${lang === 'ar' ? 'selected' : ''}>العربية</option><option value="en" ${lang === 'en' ? 'selected' : ''}>English</option></select></label>
      ${gem ? `<label class="consent" style="align-self:end"><input type="checkbox" data-kx="upDiar" ${md_.kxDiar ? 'checked' : ''}><span>${t('upDiarize')}</span></label>` : ''}</div></div></div>`;
  };
  X.uploadBtn = function (md_) {
    if (md_.mid || !X.hasKey()) return '';
    return `<button class="btn primary" data-act="uploadTranscribe" ${md_.upload && !md_.busy ? '' : 'disabled'}>${ic('spark')}${md_.busy ? t('transcribingP', { p: md_.progress || '' }) : t('upAuto')}</button>`;
  };

  X.appCards = function () {
    const c = X.cfg || {}, info = X.info || {}, st = c.stats || {};
    const mark = v => v ? `<span style="color:var(--accent)">✓</span>` : '<span class="muted">—</span>';
    let desk, ext;
    if (X.kind === 'desktop') {
      desk = `<div class="card"><h3><span class="person">${ic('monitor')}${t('desktopApp')}</span><span class="badge ok">${t('running')}</span></h3><p class="small">${t('deskDesc')}</p><p class="perm">${t('version')}: ${esc(info.version || '')}${info.dataPath ? ` — ${t('dataFolder')}: <span dir="ltr">${esc(info.dataPath)}</span>` : ''}</p></div>`;
      ext = `<div class="card"><h3><span class="person">${ic('chrome')}${t('chromeExt')}</span></h3><p class="small">${t('extDesc')}</p>
        <div class="chips" style="align-items:center"><span class="tiny muted">${t('pairCode')}:</span><code class="tag num" dir="ltr" style="font-size:14px;letter-spacing:.08em">${esc(info.token || '—')}</code>
        <button class="btn sm" data-act="kxCopyCode">${ic('copy')}${t('copy')}</button><button class="btn sm ghost" data-act="kxNewCode">${t('newCode')}</button></div><p class="perm">${t('pairHint')}</p></div>`;
    } else {
      desk = `<div class="card"><h3><span class="person">${ic('monitor')}${t('desktopApp')}</span><span class="badge">${t('notDetected')}</span></h3><p class="small">${t('deskDesc')}</p><p class="perm">${t('deskFromExt')}</p></div>`;
      ext = `<div class="card"><h3><span class="person">${ic('chrome')}${t('chromeExt')}</span><span class="badge ${X.kind === 'extension' ? 'ok' : ''}">${X.kind === 'extension' ? t('thisApp') : t('notInstalled')}</span></h3><p class="small">${t('extDesc')}</p></div>`;
    }
    const req = (st.groq ? st.groq.requests : 0) + (st.gemini ? st.gemini.requests : 0);
    const ai = `<div class="card"><h3><span class="person">${ic('spark')}${t('svcAI')}</span><span class="badge ${AI.ok() ? 'ok' : 'warn'}">${AI.ok() ? t('connected') : t('notConnected')}</span></h3><p class="small">${t('aiDesc')}</p>
      <p class="perm">Groq ${mark(c.hasGroqKey)} · Gemini ${mark(c.hasGeminiKey)} · ${t('aiRequests', { n: fmtNum(Math.max(S.usage.ai || 0, req)) })}</p><div><button class="btn sm" data-act="kxOpenAi">${ic('gear')}${t('configure')}</button></div></div>`;
    return `<div class="cards" style="margin-bottom:24px">${desk}${ext}${ai}</div>`;
  };

  X.decorateRecord = function (h) {
    if (REC.state !== 'stopped') return h;
    const tgt = '<div class="hero-actions"><button class="btn primary" data-act="recSave">';
    let extra = '';
    if (REC.sttPending) extra = `<p class="note">${t('sttFinishing')}</p>`;
    else if (REC.url && X.hasKey()) extra = `<div><button class="btn" data-act="kxTranscribeRec" ${UI.busy.kxRec ? 'disabled' : ''}>${ic('spark')}${UI.busy.kxRec ? t('transcribingP', { p: UI.busy.kxRecP || '' }) : t('transcribeRec')}</button></div>`;
    const lock = REC.sttPending || UI.busy.kxRec;
    return h.replace(tgt, extra + (lock ? tgt.replace('data-act="recSave">', 'data-act="recSave" disabled>') : tgt));
  };

  X.settingsAi = function () {
    const c = X.cfg || {}, test = UI.kxTest || {}, busy = UI.kxBusy || {}, models = X.models || {};
    const sel = (id, val, opts) => `<select class="select" id="${id}">${opts.map(([v, l]) => `<option value="${v}" ${val === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
    const keyRow = (p, url) => {
      const has = p === 'groq' ? c.hasGroqKey : c.hasGeminiKey, hint = p === 'groq' ? c.groqKeyHint : c.geminiKeyHint, r = test[p];
      return `<div class="stack" style="gap:6px">
        <div class="sec-head"><b class="small">${t(p + 'Key')}</b><span class="badge ${has ? 'ok' : ''}">${has ? t('keySaved', { k: esc(hint || '') }) : t('keyNone')}</span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><input class="input" type="password" autocomplete="off" spellcheck="false" dir="ltr" id="kxKey_${p}" placeholder="${esc(t('keyPh'))}" style="flex:1;min-width:220px">
          <button class="btn sm" data-act="kxAiTest" data-p="${p}" ${has && !busy[p] ? '' : 'disabled'}>${busy[p] ? t('testing') : t('testKey')}</button>
          ${has ? `<button class="btn sm ghost" data-act="kxAiRemove" data-p="${p}">${t('removeKey')}</button>` : ''}
          <button class="btn sm ghost" data-act="kxLink" data-url="${url}">${t('getFreeKey')} ↗</button></div>
        ${r ? `<p class="tiny" style="color:${r.ok ? 'var(--accent)' : 'var(--danger)'}">${esc(r.ok ? t('testOk', { n: fmtNum(r.models.length) }) : r.error.message)}</p>` : ''}</div>`;
    };
    const st = c.stats || {};
    const usage = ['groq', 'gemini'].map(p => st[p] ? t('usageLineP', { p: p === 'groq' ? 'Groq' : 'Gemini', r: fmtNum(st[p].requests), e: fmtNum(st[p].errors) }) + (st[p].lastError ? ` — <span class="muted">${esc(String(st[p].lastError).slice(0, 140))}</span>` : '') : '').filter(Boolean);
    const dl = (id, arr) => `<datalist id="${id}">${(arr || []).map(m => `<option value="${esc(m)}">`).join('')}</datalist>`;
    const liveOpts = [['auto', t('live_auto')], ['cloud', t('live_cloud')]].concat(X.kind === 'desktop' ? [] : [['browser', t('live_browser')]]).concat([['off', t('live_off')]]);
    return `<div class="page-head"><div><h1>${t('nav_settings')}</h1></div></div><div class="tabs" role="tablist">${STABS.map(k => `<button role="tab" aria-selected="${UI.tab === k}" data-act="tab" data-v="${k}">${t('set_' + k)}</button>`).join('')}</div>
    <section class="panel" style="margin-bottom:18px"><div class="panel-body stack" style="gap:16px"><p class="small">${t('aiPageIntro')}</p>
      ${keyRow('groq', 'https://console.groq.com/keys')}${keyRow('gemini', 'https://aistudio.google.com/apikey')}
      <p class="tiny muted">${X.kind === 'desktop' ? t('keysStoredDesktop') : t('keysStoredExt')} ${t('freeLimits')}</p></div></section>
    <section class="panel" style="margin-bottom:18px"><div class="panel-head"><h3>${t('routingTitle')}</h3></div><div class="panel-body stack" style="gap:14px">
      <div class="grid2"><label class="field"><span>${t('provider')}</span>${sel('kxProvider', c.provider || 'auto', [['auto', t('prov_auto')], ['groq', t('prov_groq')], ['gemini', t('prov_gemini')]])}</label>
      <label class="field"><span>${t('sttProvider')}</span>${sel('kxStt', c.sttProvider || 'auto', [['auto', t('stt_auto')], ['groq', t('stt_groq')], ['gemini', t('stt_gemini')]])}</label></div>
      <div class="grid2"><label class="field"><span>${t('liveEngine')}</span>${sel('kxLive', c.liveEngine || 'auto', liveOpts)}</label>
      <label class="field"><span>${t('chunkSec')}</span><input class="input" type="number" min="8" max="60" id="kxChunk" value="${esc(c.chunkSec || 20)}"></label></div></div></section>
    <section class="panel" style="margin-bottom:18px"><div class="panel-head"><h3>${t('models')}</h3></div><div class="panel-body stack" style="gap:14px">
      <div class="grid2"><label class="field"><span>${t('groqModel')}</span><input class="input" dir="ltr" id="kxGroqModel" list="kxGroqList" value="${esc(c.groqModel || '')}"></label>
      <label class="field"><span>${t('groqSttModel')}</span><input class="input" dir="ltr" id="kxGroqStt" list="kxGroqList" value="${esc(c.groqSttModel || '')}"></label></div>
      <div class="grid2"><label class="field"><span>${t('geminiModel')}</span><input class="input" dir="ltr" id="kxGemModel" list="kxGemList" value="${esc(c.geminiModel || '')}"></label>
      <label class="field"><span>${t('groqBudget')}</span><input class="input" type="number" min="1000" max="120000" step="500" id="kxBudget" value="${esc(c.groqMaxPromptTokens || 9000)}"></label></div>
      <p class="tiny muted">${t('groqBudgetHint')}</p>${dl('kxGroqList', models.groq)}${dl('kxGemList', models.gemini)}</div></section>
    <div class="hero-actions" style="margin-bottom:18px"><button class="btn primary" data-act="kxAiSave">${ic('check')}${t('saveAi')}</button></div>
    ${usage.length ? `<section class="panel"><div class="panel-head"><h3>${t('usageTitle')}</h3></div><div class="panel-body small stack" style="gap:4px">${usage.map(u => `<div>${u}</div>`).join('')}</div></section>` : ''}`;
  };

  /* ------------------------------------------------------------------ install: wrap app functions */
  X.install = function () {
    // AI availability & errors
    AI.ok = () => X.hasKey();
    const origErr = AI.err.bind(AI);
    AI.err = function (e) {
      if (e && e.code === 'no_key') return t('noKeyErr');
      if (e && e.code === 'auth') return t('authErr', { p: e.provider || 'AI' });
      if (e && e.code === 'too_large') return t('tooLargeErr');
      return origErr(e);
    };
    aiSetup = function () {
      return AI.ok() ? '' : `<div class="setup">${ic('spark')}<div><b>${t('aiOffTitle')}</b>${t('aiOffBody')}<div style="margin-top:8px"><button class="btn sm" data-act="kxOpenAi">${t('openAiSettings')}</button></div></div></div>`;
    };

    // Settings → AI tab
    if (!STABS.includes('ai')) STABS.splice(1, 0, 'ai');
    const origSettings = VIEWS.settings;
    VIEWS.settings = function () {
      if (UI.tab !== 'ai') return origSettings();
      if (Date.now() - (X.cfgAt || 0) > 4000) { X.cfgAt = Date.now(); X.loadCfg().then(() => { if (UI.route === 'settings' && UI.tab === 'ai') render(); }); }
      return X.settingsAi();
    };

    // recorder
    const origRecord = VIEWS.record;
    VIEWS.record = () => X.decorateRecord(origRecord());
    REC.srSupported = () => X.liveMode(REC.form || {}) !== 'none';

    const origSR = startSR;
    startSR = function () {
      const mode = REC.liveMode = X.liveMode(REC.form || {});
      if (mode === 'cloud') { STT.start(REC.stream); return; }
      if (mode === 'browser') {
        const f = REC.form, l = f.lang;
        if (l === 'auto') f.lang = S.settings.lang === 'en' ? 'en-US' : 'ar-EG';
        try { origSR(); } finally { f.lang = l; }
      }
    };
    const origCleanup = recCleanup;
    recCleanup = function () { origCleanup(); X.mixCleanup(); };

    const oStart = A.recStart;
    A.recStart = async function () {
      REC.textEdited = false; REC.sttPending = false; REC.liveMode = null;
      const f = REC.form;
      if (f) {
        if (f.sys == null) f.sys = X.defaultSys(f);
        if (f.sys !== 'tab') S.settings.kxSys = f.sys;
        S.settings.kxMic = f.mic || 'default';
        commit();
      }
      await oStart.apply(this, arguments);
    };
    const oPause = A.recPause;
    A.recPause = function () { oPause.apply(this, arguments); if (REC.liveMode === 'cloud') STT.pause(); };
    const oResume = A.recResume;
    A.recResume = function () { oResume.apply(this, arguments); if (REC.liveMode === 'cloud') STT.resume(); };
    const oStop = A.recStop;
    A.recStop = function () {
      if (REC.liveMode === 'cloud' && (STT.active || STT.mr || STT.busy || STT.queue.length)) {
        REC.interim = '';
        const done = STT.stop();
        REC.sttPending = true;
        oStop.apply(this, arguments);
        done.then(() => {
          REC.sttPending = false; REC.interim = '';
          if (REC.state !== 'stopped') return;
          if (!REC.textEdited) REC.text = REC.segs.map(s => '[' + fmtTsLatin(s.t) + '] ' + s.text).join('\n');
          render();
        });
      } else oStop.apply(this, arguments);
    };
    const oGo = A.goRecord;
    A.goRecord = function () {
      if (!REC.active() && REC.state !== 'stopped') { REC.form = null; X.forceSys = X.kind === 'desktop' ? 'off' : null; }
      oGo.apply(this, arguments);
    };
    A.goRecordSys = function () {
      UI.modal = null;
      if (!REC.active() && REC.state !== 'stopped') { REC.form = null; X.forceSys = null; }
      go('record');
    };

    // notifications
    const origNotify = notify;
    notify = function (msg) {
      origNotify(msg);
      if (X.canNotify() && S.settings.notifyDesktop !== false && !document.hasFocus()) { try { P().notify('KEEK', msg); } catch (e) { /* ignore */ } }
    };
    // keep meeting link + mark desktop captures
    const origNew = newMeetingObj;
    newMeetingObj = function (f, source) {
      const m = origNew(f, source);
      if (f && f.url) m.url = f.url;
      if (source === 'browser' && X.kind === 'desktop') m.source = 'desktop';
      return m;
    };

    /* ----- new actions ----- */
    A.kxOpenAi = () => { UI.modal = null; go('settings', {}, 'ai'); };
    A.kxLink = el => { const u = el.dataset.url; if (P().openExternal) P().openExternal(u); else window.open(u, '_blank', 'noopener'); };
    A.kxAiSave = async () => {
      const v = id => { const e = $('#' + id); return e ? e.value.trim() : ''; };
      const patch = {
        provider: v('kxProvider'), sttProvider: v('kxStt'), liveEngine: v('kxLive'),
        chunkSec: Math.min(60, Math.max(8, +v('kxChunk') || 20)),
        groqModel: v('kxGroqModel'), groqSttModel: v('kxGroqStt'), geminiModel: v('kxGemModel'),
        groqMaxPromptTokens: Math.max(1000, +v('kxBudget') || 9000)
      };
      const gk = v('kxKey_groq'), mk = v('kxKey_gemini');
      if (gk) patch.groqKey = gk;
      if (mk) patch.geminiKey = mk;
      try { await P().nlp.setConfig(patch); } catch (e) { toast(String(e.message || e)); return; }
      await X.loadCfg();
      toast(t('aiSaved'));
      render();
      if (gk) A.kxAiTest({ dataset: { p: 'groq' } });
      if (mk) A.kxAiTest({ dataset: { p: 'gemini' } });
    };
    A.kxAiTest = async el => {
      const p = el.dataset.p;
      UI.kxTest = UI.kxTest || {}; UI.kxBusy = UI.kxBusy || {};
      UI.kxBusy[p] = true; render();
      let r;
      try { r = await P().nlp.test(p); } catch (e) { r = { ok: false, error: { message: String(e.message || e) } }; }
      UI.kxTest[p] = r; UI.kxBusy[p] = false;
      if (r.ok) (X.models = X.models || {})[p] = r.models;
      render();
    };
    A.kxAiRemove = async el => {
      const p = el.dataset.p;
      await P().nlp.setConfig({ [p + 'Key']: null });
      if (UI.kxTest) delete UI.kxTest[p];
      await X.loadCfg(); render();
    };
    A.kxCopyCode = () => copyText(X.info.token || '');
    A.kxNewCode = async () => {
      try { X.info = (await P().bridge.regenToken()) || X.info; } catch (e) { toast(String(e.message || e)); }
      render();
    };
    A.uploadTranscribe = async () => {
      const md_ = UI.modal, u = md_ && md_.upload;
      if (!u || md_.busy) return;
      const language = md_.kxLang && md_.kxLang !== 'auto' ? md_.kxLang : undefined;
      md_.busy = true; md_.progress = ''; render();
      try {
        const blob = await (await fetch(u.url)).blob();
        const file = new File([blob], u.name, { type: blob.type || X.mimeFromName(u.name) });
        const segs = await X.transcribeBlob(file, { language, diarize: !!md_.kxDiar, onProgress: (i, n) => { if (UI.modal === md_) { md_.progress = n > 1 ? `${fmtNum(i)}/${fmtNum(n)}` : ''; render(); } } });
        if (UI.modal !== md_) return;
        u.kept = true;
        UI.modal = { type: 'import', form: { date: nowLocal(), platform: 'other', title: u.name.replace(/\.[^.]+$/, ''), audioUrl: u.url, audioName: u.name, audioDur: u.dur, text: X.segsToText(segs) } };
        render();
        if (!segs.length) toast(t('noLiveText'));
      } catch (e) {
        console.error(e);
        md_.busy = false;
        if (UI.modal === md_) render();
        toast(t('sttFailed', { e: e.code ? AI.err(e) : (e.message || String(e)) }));
      }
    };
    A.kxTranscribeRec = async () => {
      if (!REC.url) return;
      UI.busy.kxRec = true; render();
      try {
        const blob = await (await fetch(REC.url)).blob();
        const segs = await X.transcribeBlob(blob, { language: X.whisperLang(REC.form && REC.form.lang), onProgress: (i, n) => { UI.busy.kxRecP = n > 1 ? `${fmtNum(i)}/${fmtNum(n)}` : ''; render(); } });
        REC.segs = segs.map(s => ({ t: s.start, text: s.text }));
        REC.text = X.segsToText(segs);
        REC.textEdited = false;
        if (!segs.length) toast(t('noLiveText'));
      } catch (e) { toast(t('sttFailed', { e: e.code ? AI.err(e) : (e.message || String(e)) })); }
      UI.busy.kxRec = false; UI.busy.kxRecP = '';
      render();
    };

    /* ----- inputs owned by KEEKX ----- */
    document.addEventListener('change', e => {
      const el = e.target, k = el.dataset && el.dataset.kx;
      if (!k) return;
      if (k === 'sys' && REC.form) { REC.form.sys = el.value; render(); }
      else if (k === 'mic' && REC.form) { REC.form.mic = el.value; }
      else if (k === 'upLang' && UI.modal) { UI.modal.kxLang = el.value; }
      else if (k === 'upDiar' && UI.modal) { UI.modal.kxDiar = el.checked; }
    });
    document.addEventListener('input', e => { if (e.target && e.target.id === 'recText') REC.textEdited = true; });
  };
})();

/* KEEK app — extracted from keek.html by tools/extract_app.py. New behaviour lives in keekx.js. */
const I18N={
ar:{
tagline:'اجتماعاتك. معرفتك. مساحة عمل ذكية واحدة.',mainNav:'التنقل الرئيسي',menu:'القائمة',myWorkspace:'مساحة العمل',wsOf:'مساحة {n}',comma:'، ',
nav_dashboard:'لوحة التحكم',nav_meetings:'الاجتماعات',nav_search:'البحث الذكي',nav_projects:'المشاريع',nav_tasks:'المهام',nav_integrations:'التكاملات',nav_team:'الفريق',nav_settings:'الإعدادات',
save_idle:'',save_saving:'جارٍ الحفظ…',save_saved:'تم الحفظ',save_error:'تعذّر الحفظ',
onbWelcome:'أهلاً بك في كيكـ',chooseLang:'لغة الواجهة',onbWorkspace:'مساحة العمل',onbWorkspaceHint:'تُنشأ لك مساحة عمل شخصية تلقائياً؛ هنا تُنظَّم الاجتماعات والمشاريع والمهام.',yourName:'اسمك',namePh:'مثلاً: سارة عادل',
wsPersonal:'شخصية',wsPersonalHint:'لاجتماعاتك وعملائك',wsTeam:'فريق',wsTeamHint:'مساحة مشتركة لأعضاء الفريق',teamNote:'دعوة الأعضاء والأدوار المشتركة تحتاج خادم الفريق ضمن خارطة الطريق. حالياً المساحة خاصة بك وحدك.',
onbDesktop:'تطبيق سطح المكتب',onbDesktopHint:'كيكـ يسجّل صوت النظام والميكروفون مباشرة من جهازك، بدون بوت ينضم للاجتماع.',desktopApp:'تطبيق كيكـ لسطح المكتب',desktopStatusDev:'قيد التطوير لنظامي macOS وWindows — غير متاح للتنزيل بعد.',
onbDesktopNote:'إلى أن يتوفر التطبيق: يمكنك التسجيل من المتصفح بالميكروفون فقط، أو استيراد نص اجتماع، أو رفع ملف صوتي للاستماع إليه بجانب النص.',
onbStart:'جاهز للبدء',onbStartHint:'ابدأ بمساحة فارغة، أو استكشف مساحة تجريبية بمحتوى عربي وإنجليزي.',startEmpty:'مساحة فارغة',startEmptyHint:'سجّل أو استورد أول اجتماع',startSample:'مساحة تجريبية',startSampleHint:'٣ مشاريع و٥ اجتماعات مُعلَّمة كبيانات تجريبية',
back:'رجوع',continue:'متابعة',
storeLocal_local:'لا يمكن الوصول إلى حسابك هنا، لذا ستُحفظ البيانات في هذا المتصفح فقط.',storeLocal_memory:'التخزين غير متاح هنا؛ ستُفقد البيانات عند إغلاق الصفحة.',
goodMorning:'صباح الخير',goodEvening:'مساء الخير',quickRecord:'تسجيل سريع',askHomePh:'اسأل عن اجتماعاتك… مثلاً: ماذا اتفقنا بخصوص الـ onboarding؟',search:'بحث',
statMeetings:'اجتماعات آخر ٣٠ يوماً',statOpen:'مهام مفتوحة',statOverdue:'مهام متأخرة',statReview:'عناصر تحتاج مراجعة',
noMeetingsTitle:'لا توجد اجتماعات بعد',noMeetingsBody:'سجّل أو استورد أول اجتماع، وسيحوّله كيكـ إلى ملخص وقرارات ومهام مرتبطة بمصادرها.',newMeeting:'اجتماع جديد',loadSample:'تحميل البيانات التجريبية',
recentMeetings:'أحدث الاجتماعات',viewAll:'عرض الكل',recentDecisions:'أحدث القرارات',noDecisions:'لا توجد قرارات بعد.',upcoming:'الاجتماعات القادمة',upcomingOff:'اربط Google Calendar لعرض اجتماعاتك القادمة هنا. التكامل مخطط في الإصدار 1.1.',viewIntegrations:'التكاملات',
openItems:'مهام مفتوحة',noOpenTasks:'لا توجد مهام مفتوحة.',
meetingsSub:'كل اجتماعاتك المسجّلة والمستوردة.',searchMeetings:'ابحث في الاجتماعات',project:'المشروع',allProjects:'كل المشاريع',status:'الحالة',allStatuses:'كل الحالات',platform:'المنصة',allPlatforms:'كل المنصات',tags:'الوسوم',allTags:'كل الوسوم',sort:'الترتيب',newest:'الأحدث أولاً',oldest:'الأقدم أولاً',noMatches:'لا نتائج مطابقة.',
st_queued:'في الانتظار',st_transcribing:'التفريغ',st_analyzing:'التحليل',st_indexing:'الفهرسة',st_completed:'مكتمل',st_failed:'فشل',sample:'تجريبي',processing:'مراحل المعالجة',skippedImport:'تم تخطي التفريغ لأن النص مستورد',
pf_meet:'Google Meet',pf_zoom:'Zoom',pf_teams:'Microsoft Teams',pf_inperson:'حضوري',pf_other:'أخرى',
src_import:'نص مستورد',src_upload:'ملف صوتي + نص',src_browser:'تسجيل من المتصفح',src_desktop:'تطبيق سطح المكتب',
nMeetings:'{n} اجتماع',nOpenTasks:'{n} مهمة مفتوحة',
optDesktop:'التسجيل من تطبيق سطح المكتب',optDesktopD:'يلتقط صوت النظام والميكروفون معاً بدون بوت. قيد التطوير.',notDetected:'غير مكتشف',
optBrowser:'التسجيل من المتصفح',optBrowserD:'الميكروفون فقط مع تفريغ مباشر. حل مؤقت حتى يتوفر تطبيق سطح المكتب.',optImport:'استيراد نص اجتماع',optImportD:'الصق نصاً من Zoom أو Meet أو Teams أو أي مصدر.',optUpload:'رفع ملف صوتي',optUploadD:'أرفق التسجيل للاستماع بجانب النص. التفريغ الآلي للملفات غير مُفعّل بعد.',
browserRecording:'تسجيل من المتصفح',browserRecordingSub:'تسجيل بالميكروفون مع تفريغ مباشر.',recorder:'المسجّل',
rs_idle:'جاهز للتسجيل',rs_starting:'جارٍ طلب إذن الميكروفون…',rs_recording:'يسجّل الآن',rs_paused:'متوقف مؤقتاً',rs_stopped:'انتهى التسجيل',
micOnlyNote:'المتصفح يلتقط الميكروفون فقط. صوت الطرف الآخر في مكالمات الإنترنت لا يُسجَّل إلا إذا خرج من السماعات. تطبيق سطح المكتب سيلتقط صوت النظام مباشرة.',
consentText:'أبلغت المشاركين بأن الاجتماع يُسجَّل، وأتحمل مسؤولية الالتزام بقوانين الموافقة المعمول بها.',startRecording:'ابدأ التسجيل',pause:'إيقاف مؤقت',resume:'استئناف',stop:'إيقاف',spokenLang:'لغة الكلام',langArEG:'عربي (مصري)',langAr:'عربي (فصحى)',
srUnsupported:'التفريغ المباشر غير مدعوم في هذا المتصفح. استخدم Chrome أو Edge، أو استورد النص بعد الاجتماع.',srBlocked:'تم رفض خدمة التعرف على الكلام. ما زال الصوت يُسجَّل؛ يمكنك لصق النص بعد الانتهاء.',srNetwork:'تعذّر الوصول لخدمة التعرف على الكلام. ما زال الصوت يُسجَّل.',
micProblem:'مشكلة في الميكروفون',micDenied:'تم رفض إذن الميكروفون. اسمح للصفحة باستخدامه من إعدادات المتصفح ثم حاول مرة أخرى.',micMissing:'لم يتم العثور على ميكروفون متصل.',micBlocked:'الميكروفون غير متاح في هذا العرض. افتح كيكـ في صفحته الخاصة أو استورد النص.',micDisconnected:'انقطع الميكروفون أثناء التسجيل، فتم إيقافه وحفظ ما سُجّل.',
listening:'يستمع… ابدأ الكلام.',reviewRecording:'مراجعة التسجيل',audioLocalNote:'الصوت متاح للاستماع في هذه الجلسة فقط ولا يُرفع؛ يُحفظ النص.',liveTranscript:'النص المفرّغ — يمكنك تعديله',noLiveText:'لم يُلتقط نص. اكتب أو الصق النص هنا لتتم معالجته.',
saveProcess:'حفظ ومعالجة',discard:'تجاهل',discardQ:'تجاهل هذا التسجيل؟ لن يمكن استرجاعه.',
meetingDetails:'تفاصيل الاجتماع',title:'العنوان',titlePh:'مثلاً: متابعة مع العميل',date:'التاريخ والوقت',noProject:'بدون مشروع',participants:'المشاركون',participantsPh:'أسماء مفصولة بفواصل',tagsPh:'مثلاً: عميل، تصميم',
chooseAudio:'اختر ملفاً صوتياً أو فيديو',sttOffTitle:'التفريغ الآلي للملفات غير مُفعّل بعد',sttOffBody:'تحويل الملفات إلى نص يحتاج مزود تفريغ صوتي على خادم كيكـ، ولم يُختر بعد (يُحسم بعد اختبار الدقة على تسجيلات عربية حقيقية). يمكنك إرفاق الملف للاستماع ولصق نصه.',continueWithTranscript:'متابعة ولصق النص',
pasteLabel:'نص الاجتماع',pastePh:'الصق النص هنا. يدعم صيغاً مثل:\n[00:12] أحمد: نبدأ بموضوع الـ onboarding\n00:45 Sara: The designs are ready\nأو سطوراً عادية بدون توقيت.',pasteEmpty:'الصق نص الاجتماع أولاً.',audioAttachedSession:'سيُرفق للاستماع في هذه الجلسة',
untitled:'اجتماع',processed:'اكتملت معالجة "{title}"',aiUnavailable:'الذكاء الاصطناعي غير متاح في هذا العرض.',noTranscript:'لا يوجد نص',noTranscriptBody:'هذا الاجتماع بلا نص.',interrupted:'توقفت المعالجة عند إغلاق الصفحة. أعد المحاولة.',
mt_overview:'نظرة عامة',mt_summary:'الملخص',mt_transcript:'النص',mt_decisions:'القرارات',mt_actions:'المهام',mt_participants:'المشاركون',
edit:'تعديل',export:'تصدير',share:'مشاركة',delete:'حذف',processFailed:'فشلت المعالجة',retry:'إعادة المحاولة',processNow:'معالجة الآن',
noAudio:'لا يوجد صوت في هذه الجلسة.',attachAudio:'إرفاق ملف صوتي',audioAttached:'تم إرفاق الصوت لهذه الجلسة',noAudioToPlay:'أرفق ملفاً صوتياً لتشغيل التسجيل من هذا التوقيت.',playFromHere:'تشغيل من هذه اللحظة',
noReportYet:'لا يوجد تقرير بعد',noReportBody:'يظهر التقرير بعد معالجة النص.',decisions:'القرارات',openQuestions:'أسئلة مفتوحة',risks:'المخاطر والعوائق',noDecisionsMeeting:'لم تُستخرج قرارات صريحة من هذا الاجتماع.',noParticipants:'لم يُحدَّد مشاركون.',
sOverview:'نظرة عامة',sTopics:'المواضيع الرئيسية',sPoints:'نقاط النقاش المهمة',sFollowup:'رسالة متابعة مقترحة',actionItems:'المهام',review:'مراجعة',none:'لا يوجد.',aiGenerated:'مُنشأ بالذكاء الاصطناعي',editedByYou:'عدّلته أنت',aiSuggestion:'اقتراح من كيكـ — راجعه قبل الإرسال',
regenerate:'إعادة إنشاء',regenerating:'جارٍ الإنشاء…',sectionRegenerated:'تمت إعادة إنشاء القسم',droppedNote:'تم استبعاد {n} عنصر لعدم وجود مصدر في النص.',
searchTranscript:'ابحث في النص',copy:'نسخ',transcriptEditHint:'اضغط على التوقيت للاستماع من تلك اللحظة، وعلى أي سطر لتعديله. النص الأصلي محفوظ.',edited:'معدّل',original:'الأصل',nHits:'{n} نتيجة',
renameSpeaker:'إعادة التسمية',renameSpeakerHint:'سيتغيّر "{n}" في كل أسطر هذا الاجتماع.',newName:'الاسم الجديد',
decisionsHint:'كل قرار مرتبط بالسطر الذي ورد فيه. حدّد حالته: مؤكد أو مرفوض أو لم يُحسم.',addDecision:'إضافة قرار',editDecision:'تعديل القرار',manualDecisionNote:'القرارات المضافة يدوياً لا ترتبط بسطر في النص.',addedManually:'مضاف يدوياً',
ds_review:'يحتاج مراجعة',ds_confirmed:'مؤكد',ds_unresolved:'لم يُحسم',ds_rejected:'مرفوض',
actionsHint:'المسؤول والموعد لا يُحددان إلا إذا ذُكرا صراحة. وافق على المهام المستخرجة أو تجاهلها.',addTask:'إضافة مهمة',editTask:'تعديل المهمة',noTasksMeeting:'لا مهام لهذا الاجتماع.',
ts_open:'مفتوحة',ts_in_progress:'قيد التنفيذ',ts_completed:'مكتملة',ts_cancelled:'ملغاة',
unassigned:'بدون مسؤول',aiSuggested:'مقترح من الذكاء الاصطناعي',overdue:'متأخرة',confirm:'تأكيد',markDone:'مكتملة',needsReview:'استُخرجت آلياً — تحتاج مراجعتك',approve:'موافقة',dismiss:'تجاهل',dismissed:'تم تجاهل المهمة',lowConfidence:'ثقة منخفضة',
openSource:'افتح المصدر في النص',source:'المصدر',owner:'المسؤول',dueDate:'الموعد النهائي',saidInMeeting:'قيل في الاجتماع',description:'الوصف',
participantsHint:'المشاركون من بيانات الاجتماع والمتحدثون الذين ظهروا في النص.',name:'الاسم',linesSpoken:'الأسطر',assignedItems:'مهام مسندة',noDiarization:'لا يوجد تمييز للمتحدثين في هذا النص؛ لن يخمّن كيكـ هوية المتحدثين.',
editMeeting:'تعديل بيانات الاجتماع',meetingUrl:'رابط الاجتماع',exportHint:'اختر ما تريد تصديره:',exTxt:'النص الكامل',exSummary:'الملخص (Markdown)',exCsv:'المهام (CSV)',exJson:'كل بيانات الاجتماع (JSON)',exportLater:'تصدير DOCX وPDF والصوت الأصلي يأتي مع الخادم وتطبيق سطح المكتب.',
shareOffTitle:'المشاركة غير متاحة بعد',shareOffBody:'روابط المشاركة المحكومة (عرض فقط، انتهاء صلاحية، إلغاء الوصول) تحتاج خادم الفريق. المشاركة العامة ستكون معطّلة افتراضياً.',shareMeanwhile:'حالياً يمكنك تصدير الملخص أو المهام وإرسالها بنفسك.',
deleteMeetingQ:'حذف هذا الاجتماع ونصه ومهامه وكل ما استُخرج منه نهائياً؟',
nav_search_dummy:'',searchSub:'اسأل بلغتك؛ كل إجابة مبنية على اجتماعاتك ومرتبطة بمصادرها.',keywordPh:'ابحث عن كلمة أو اسم…',modeAI:'سؤال ذكي',modeKeyword:'كلمات',anyone:'أي شخص',from:'من',to:'إلى',suggested:'أسئلة مقترحة',recentQueries:'عمليات بحث سابقة',noQueries:'لا يوجد بعد.',
sug1:'ماذا قرر العميل بخصوص الـ onboarding؟',sug2:'ما المهام المتأخرة ومن المسؤول عنها؟',sug3:'ما الذي لم يُحسم بعد في Project Alpha؟',sug4:'ماذا تغيّر بين آخر ثلاثة اجتماعات؟',sug5:'ما المخاطر التي ظهرت في اجتماعات هذا الشهر؟',sug6:'ما مشاكل الدفع التي ذكرها المستخدمون؟',
thinking:'يبحث في اجتماعاتك…',relatedMeetings:'اجتماعات مرتبطة',sourceExcerpts:'مقتطفات المصادر',newSearch:'بحث جديد',conf_high:'مدعوم جيداً بالمصادر',conf_medium:'مدعوم جزئياً',conf_low:'أدلة غير كافية',
noSourcesInScope:'لا توجد اجتماعات بنص تطابق الفلاتر المختارة، لذا لا تتوفر معلومات كافية للإجابة.',transcriptMoments:'مقاطع من النصوص',
projectsSub:'المشاريع تجمع الاجتماعات المرتبطة وقراراتها ومهامها.',newProject:'مشروع جديد',active:'نشطة',archived:'مؤرشف',noArchived:'لا توجد مشاريع مؤرشفة',noProjects:'لا توجد مشاريع بعد',noProjectsBody:'أنشئ مشروعاً لتجميع الاجتماعات والقرارات والمهام.',
projectName:'اسم المشروع',projectPh:'مثلاً: إعادة تصميم تطبيق العميل',create:'إنشاء',addDescription:'أضف وصفاً للمشروع',searchProject:'ابحث في المشروع',archive:'أرشفة',unarchive:'إلغاء الأرشفة',archivedToast:'تمت أرشفة المشروع',unarchivedToast:'تم إلغاء الأرشفة',
projectContext:'سياق المشروع',overviewHint:'اطلب من كيكـ ملخصاً لحالة المشروع من كل اجتماعاته.',overviewNeedsMeetings:'أضف اجتماعات لهذا المشروع ليتمكن كيكـ من تلخيصه.',addExistingMeeting:'إضافة اجتماع موجود',noProjectMeetings:'لا اجتماعات في هذا المشروع.',
recentActivity:'النشاط الأخير',actMeeting:'اجتماع: {t}',actDone:'اكتملت مهمة: {t}',completedItems:'مهام مكتملة',deleteProjectQ:'حذف المشروع؟ تبقى اجتماعاته بدون مشروع.',refresh:'تحديث',generate:'إنشاء',
tasksSub:'كل المهام المستخرجة من اجتماعاتك أو المضافة يدوياً.',tf_all:'الكل',tf_mine:'مهامي',tf_unassigned:'بدون مسؤول',tf_review:'تحتاج مراجعة',tf_completed:'مكتملة',searchTasks:'ابحث في المهام',anyDue:'أي موعد',due_overdue:'متأخرة',due_week:'خلال ٧ أيام',due_none:'بدون موعد',
noTasks:'لا مهام بعد',noTasksBody:'المهام تُستخرج تلقائياً من الاجتماعات.',setNameTitle:'حدّد اسمك',setNameBody:'"مهامي" تعرض المهام المسندة لاسمك كما يُذكر في الاجتماعات.',sendToIntegration:'إرسال المهام إلى Linear أو Jira أو Slack يتوفر بعد تفعيل تلك التكاملات.',
integrationsSub:'اربط كيكـ بالأدوات التي تعمل بها. لا يوجد تكامل يعمل بعد سوى الذكاء الاصطناعي؛ الباقي مخطط حسب خارطة الطريق.',keekApps:'تطبيقات كيكـ',
desktopDesc:'المحرك الأساسي للتسجيل: صوت النظام (WASAPI على Windows وواجهات macOS الأصلية) مع الميكروفون، تخزين محلي قبل الرفع، وإعادة المحاولة عند انقطاع الشبكة.',chromeExt:'إضافة Chrome',notInstalled:'غير مثبّتة',
chromeDesc:'تكتشف Meet وZoom وTeams على الويب، تقرأ عنوان الاجتماع ورابطه، وتتحكم في التسجيل عبر تطبيق سطح المكتب (Native Messaging). لا تسجّل الصوت بنفسها.',plannedFor:'مخطط في {v}',
svcAI:'الذكاء الاصطناعي (Claude)',aiDesc:'يحلل النصوص ويستخرج الملخص والقرارات والمهام ويجيب على أسئلة البحث بمصادر.',aiRequests:'{n} طلب في هذه المساحة',connected:'متصل',notConnected:'غير متصل',directory:'دليل التكاملات',permissions:'الصلاحيات المطلوبة',connect:'ربط',
in_gcal:'Google Calendar',in_gcal_d:'عرض الاجتماعات القادمة وربط الأحداث بالتسجيلات.',in_gcal_p:'قراءة الأحداث والمشاركين وروابط الاجتماعات.',
in_outlook:'Outlook Calendar',in_outlook_d:'مزامنة أحداث التقويم وسياق الاجتماعات.',in_outlook_p:'قراءة أحداث التقويم.',
in_zoom:'Zoom',in_zoom_d:'جلب بيانات الاجتماعات المسموح بها عبر واجهات Zoom الرسمية.',in_zoom_p:'قراءة بيانات الاجتماع (بدون الوصول للصوت المباشر).',
in_slack:'Slack',in_slack_d:'مشاركة الملخصات وإرسال تنبيهات المهام المعتمدة.',in_slack_p:'نشر الرسائل في القنوات التي تختارها.',
in_notion:'Notion',in_notion_d:'تصدير ملخصات الاجتماعات إلى صفحات Notion.',in_notion_p:'إنشاء صفحات في المساحات التي تختارها.',
in_linear:'Linear',in_linear_d:'إنشاء issues من المهام المعتمدة.',in_linear_p:'إنشاء issues وقراءة الفرق.',
in_jira:'Jira',in_jira_d:'إنشاء أو تحديث issues من المهام المعتمدة.',in_jira_p:'إنشاء وتعديل issues في المشاريع المحددة.',
in_webhooks:'Webhooks',in_webhooks_d:'إرسال أحداث كيكـ إلى أنظمتك أو Zapier.',in_webhooks_p:'إرسال بيانات الاجتماع إلى رابط تحدده.',
integrationsNote:'التكاملات مع منصات الاجتماعات لا تمنح كيكـ وصولاً لصوت الاجتماع المباشر؛ تطبيق سطح المكتب يظل المصدر الأساسي للتسجيل.',
teamSub:'الأعضاء والأدوار والصلاحيات.',members:'الأعضاء',role:'الدور',you:'أنت',activeMember:'نشط',invite:'دعوة عضو',sendInvite:'إرسال الدعوة',inviteOff:'الدعوات تحتاج خادم الفريق والمصادقة المشتركة، ولم تُفعَّل بعد.',rolesPerms:'الأدوار والصلاحيات',allowed:'مسموح',
r_owner:'مالك',r_admin:'مسؤول',r_member:'عضو',r_guest:'ضيف',p_workspace:'التحكم الكامل وحذف المساحة',p_billing:'الفوترة',p_members:'إدارة الأعضاء',p_integrations:'إدارة التكاملات',p_record:'تسجيل وإدارة اجتماعاته',p_shared:'الوصول للاجتماعات المشتركة',p_tasks:'إدارة المهام المسندة',p_viewShared:'عرض المحتوى المشارك صراحة',
set_profile:'الملف الشخصي',set_workspace:'مساحة العمل',set_audio:'الصوت',set_privacy:'الخصوصية والبيانات',set_notifications:'الإشعارات',set_billing:'الخطة والفوترة',
nameHint:'يُستخدم لعرض المهام المسندة إليك.',language:'اللغة',theme:'المظهر',th_system:'حسب الجهاز',th_light:'فاتح',th_dark:'داكن',accountNote:'أنت مسجّل الدخول عبر حسابك على Claude. تسجيل الدخول بالبريد وGoogle وMicrosoft وإدارة الأجهزة تأتي مع خادم كيكـ.',
wsName:'اسم مساحة العمل',wsTypeLabel:'النوع',audioDesktopNote:'اختيار أجهزة الصوت وتفعيل صوت النظام يتم من تطبيق سطح المكتب.',micTest:'اختبار الميكروفون',micTestHint:'تحقق من أن المتصفح يسمع صوتك قبل التسجيل.',testMic:'اختبار',speakNow:'تكلّم الآن…',micOk:'الميكروفون يعمل.',micSilent:'لم يُلتقط صوت. تحقق من الميكروفون المختار.',
sysAudio:'صوت النظام',sysAudioBody:'غير متاح من المتصفح. سيُفعّل عبر تطبيق سطح المكتب (macOS وWindows).',
storeDesc_db:'بياناتك محفوظة في حسابك على Claude داخل مساحة خاصة بك؛ لا يراها أي شخص آخر يفتح هذه الصفحة.',storeDesc_local:'بياناتك محفوظة في هذا المتصفح فقط.',storeDesc_memory:'التخزين غير متاح؛ البيانات تُفقد عند إغلاق الصفحة.',
processorsNote:'معالجات البيانات: Claude من Anthropic لتحليل النصوص، وخدمة التعرف على الكلام في متصفحك عند التسجيل المباشر. الصوت المسجّل من المتصفح لا يُرفع.',noTraining:'لا تُستخدم اجتماعاتك لتدريب أي نموذج.',
consentGuidance:'القوانين تختلف حسب الدولة؛ أبلغ المشاركين دائماً قبل التسجيل.',exportAll:'تصدير كل البيانات (JSON)',removeSample:'حذف البيانات التجريبية',removeSampleQ:'حذف كل المشاريع والاجتماعات التجريبية؟',deleteAll:'حذف كل البيانات',deleteAllQ:'سيتم حذف كل الاجتماعات والنصوص والمهام نهائياً. لا يمكن التراجع.',
notifyInApp:'إشعارات داخل التطبيق',notifyInApp_d:'عند اكتمال المعالجة أو فشلها.',notifyDesktop:'إشعارات سطح المكتب',notifyDesktop_d:'تتوفر مع تطبيق سطح المكتب.',notifyEmail:'إشعارات البريد',notifyEmail_d:'تتوفر مع خادم كيكـ.',notifySlack:'Slack',notifySlack_d:'تتوفر بعد تفعيل تكامل Slack.',
currentPlan:'الخطة الحالية',previewPlan:'نسخة تجريبية بدون حدود استخدام.',usageLine:'{m} اجتماع — {min} دقيقة — {a} طلب ذكاء اصطناعي',current:'الحالية',
plan_free:'مجاني',plan_free_for:'للأفراد لتجربة كيكـ',plan_free_f:'دقائق تسجيل محدودة|ملخصات أساسية|سجل محدود|مساحة شخصية واحدة',
plan_pro:'Pro',plan_pro_for:'للمحترفين',plan_pro_f:'دقائق أكثر|ذكاء الاجتماعات|البحث عبر الاجتماعات|المشاريع والوسوم|التصدير والتكاملات',
plan_team:'Team',plan_team_for:'للفرق الصغيرة والنامية',plan_team_f:'مساحة مشتركة|اجتماعات وبحث مشترك|قرارات ومهام الفريق|إدارة الأعضاء',
plan_enterprise:'Enterprise',plan_enterprise_for:'للمؤسسات',plan_enterprise_f:'صلاحيات متقدمة|سياسات احتفاظ مخصصة|تحكم إداري|دعم مخصص',
pricingNote:'الأسعار لم تُحدد بعد؛ تُحسم بعد قياس تكلفة التفريغ والذكاء الاصطناعي والتخزين.',
areYouSure:'هل أنت متأكد؟',cancel:'إلغاء',close:'إغلاق',save:'حفظ',saved:'تم الحفظ',deleted:'تم الحذف',titleRequired:'العنوان مطلوب.',copied:'تم النسخ',copyFailed:'تعذّر النسخ',copiedInstead:'تعذّر التنزيل هنا، فتم نسخ المحتوى بدلاً منه.',exportUnavailable:'التصدير غير متاح في هذا العرض.',
sampleLoaded:'تم تحميل البيانات التجريبية',sampleRemoved:'تم حذف البيانات التجريبية',allDeleted:'تم حذف كل البيانات',saveFailed:'تعذّر حفظ التغييرات. ستُعاد المحاولة مع التعديل القادم.',tooLarge:'هذا العنصر أكبر من الحد المسموح للحفظ.',loadFailed:'تعذّر تحميل بياناتك من الحساب؛ يتم استخدام نسخة المتصفح.',notFound:'غير موجود',minutes:'{n} دقيقة',
aiOffTitle:'الذكاء الاصطناعي غير متاح هنا',aiOffBody:'التحليل والبحث الذكي يعملان عند فتح كيكـ داخل Claude والسماح له باستخدامه. الاستيراد والبحث بالكلمات والتعديل تعمل.',
aiDeclined:'لم يُسمح لكيكـ باستخدام Claude. يمكنك السماح من قائمة الأذونات.',aiRate:'طلبات كثيرة في وقت قصير. انتظر قليلاً ثم حاول.',aiFailed:'تعذّر إكمال الطلب',recordingNow:'يسجّل الآن',more:'المزيد',filters:'تصفية',today:'اليوم',yesterday:'أمس',thisWeek:'هذا الأسبوع',earlier:'أقدم',selectMeeting:'اختر اجتماعاً',selectMeetingBody:'افتح أي اجتماع من القائمة لعرض ملخصه ونصه وقراراته هنا.'
},
en:{
tagline:'Your meetings. Your knowledge. One intelligent workspace.',mainNav:'Main navigation',menu:'Menu',myWorkspace:'Workspace',wsOf:"{n}'s workspace",comma:', ',
nav_dashboard:'Dashboard',nav_meetings:'Meetings',nav_search:'AI Search',nav_projects:'Projects',nav_tasks:'Action Items',nav_integrations:'Integrations',nav_team:'Team',nav_settings:'Settings',
save_idle:'',save_saving:'Saving…',save_saved:'Saved',save_error:'Couldn’t save',
onbWelcome:'Welcome to KEEK',chooseLang:'Interface language',onbWorkspace:'Your workspace',onbWorkspaceHint:'A personal workspace is created for you; it organises your meetings, projects and action items.',yourName:'Your name',namePh:'e.g. Sara Adel',
wsPersonal:'Personal',wsPersonalHint:'For your own meetings and clients',wsTeam:'Team',wsTeamHint:'A shared space for team members',teamNote:'Inviting members and shared roles need the team backend on the roadmap. For now this workspace is private to you.',
onbDesktop:'Desktop app',onbDesktopHint:'KEEK records system audio and your microphone directly from your device — no bot joins the meeting.',desktopApp:'KEEK Desktop',desktopStatusDev:'In development for macOS and Windows — not available to download yet.',
onbDesktopNote:'Until it ships you can record in the browser (microphone only), import a transcript, or attach an audio file to play alongside the transcript.',
onbStart:'Ready to start',onbStartHint:'Start empty, or explore a sample workspace with Arabic and English content.',startEmpty:'Empty workspace',startEmptyHint:'Record or import your first meeting',startSample:'Sample workspace',startSampleHint:'3 projects and 5 meetings, labelled as sample',
back:'Back',continue:'Continue',
storeLocal_local:'Your account isn’t reachable here, so data is saved in this browser only.',storeLocal_memory:'Storage isn’t available here; data is lost when the page closes.',
goodMorning:'Good morning',goodEvening:'Good evening',quickRecord:'Quick record',askHomePh:'Ask about your meetings… e.g. What did we agree about onboarding?',search:'Search',
statMeetings:'Meetings, last 30 days',statOpen:'Open action items',statOverdue:'Overdue',statReview:'Items to review',
noMeetingsTitle:'No meetings yet',noMeetingsBody:'Record or import your first meeting and KEEK turns it into a summary, decisions and action items linked to their sources.',newMeeting:'New meeting',loadSample:'Load sample data',
recentMeetings:'Recent meetings',viewAll:'View all',recentDecisions:'Recent decisions',noDecisions:'No decisions yet.',upcoming:'Upcoming meetings',upcomingOff:'Connect Google Calendar to see upcoming meetings here. The integration is planned for v1.1.',viewIntegrations:'Integrations',
openItems:'Open action items',noOpenTasks:'No open action items.',
meetingsSub:'Every meeting you’ve recorded or imported.',searchMeetings:'Search meetings',project:'Project',allProjects:'All projects',status:'Status',allStatuses:'All statuses',platform:'Platform',allPlatforms:'All platforms',tags:'Tags',allTags:'All tags',sort:'Sort',newest:'Newest first',oldest:'Oldest first',noMatches:'Nothing matches.',
st_queued:'Queued',st_transcribing:'Transcribing',st_analyzing:'Analyzing',st_indexing:'Indexing',st_completed:'Completed',st_failed:'Failed',sample:'Sample',processing:'Processing stages',skippedImport:'Transcription skipped: the transcript was imported',
pf_meet:'Google Meet',pf_zoom:'Zoom',pf_teams:'Microsoft Teams',pf_inperson:'In person',pf_other:'Other',
src_import:'Imported transcript',src_upload:'Audio file + transcript',src_browser:'Browser recording',src_desktop:'Desktop app',
nMeetings:'{n} meetings',nOpenTasks:'{n} open items',
optDesktop:'Record with the desktop app',optDesktopD:'Captures system audio and microphone together, no bot. In development.',notDetected:'Not detected',
optBrowser:'Record in the browser',optBrowserD:'Microphone only, with live transcription. Interim option until the desktop app ships.',optImport:'Import a transcript',optImportD:'Paste a transcript from Zoom, Meet, Teams or anywhere else.',optUpload:'Upload an audio file',optUploadD:'Attach the recording to play next to the transcript. Automatic file transcription isn’t switched on yet.',
browserRecording:'Browser recording',browserRecordingSub:'Microphone recording with live transcription.',recorder:'Recorder',
rs_idle:'Ready to record',rs_starting:'Asking for microphone access…',rs_recording:'Recording',rs_paused:'Paused',rs_stopped:'Recording finished',
micOnlyNote:'The browser captures your microphone only. The other side of an online call is recorded only if it plays through your speakers. The desktop app will capture system audio directly.',
consentText:'I’ve told participants this meeting is being recorded, and I’m responsible for following applicable consent laws.',startRecording:'Start recording',pause:'Pause',resume:'Resume',stop:'Stop',spokenLang:'Spoken language',langArEG:'Arabic (Egyptian)',langAr:'Arabic (MSA)',
srUnsupported:'Live transcription isn’t supported in this browser. Use Chrome or Edge, or import the transcript afterwards.',srBlocked:'Speech recognition was blocked. Audio is still recording; paste the transcript afterwards.',srNetwork:'Couldn’t reach the speech recognition service. Audio is still recording.',
micProblem:'Microphone problem',micDenied:'Microphone access was denied. Allow it in your browser settings, then try again.',micMissing:'No microphone was found.',micBlocked:'The microphone isn’t available in this view. Open KEEK on its own page, or import a transcript.',micDisconnected:'The microphone disconnected, so recording stopped and what was captured was kept.',
listening:'Listening… start speaking.',reviewRecording:'Review recording',audioLocalNote:'Audio plays back in this session only and isn’t uploaded; the transcript is saved.',liveTranscript:'Transcript — you can edit it',noLiveText:'No speech was captured. Type or paste the transcript here to process it.',
saveProcess:'Save and process',discard:'Discard',discardQ:'Discard this recording? It can’t be recovered.',
meetingDetails:'Meeting details',title:'Title',titlePh:'e.g. Client follow-up',date:'Date and time',noProject:'No project',participants:'Participants',participantsPh:'Names, separated by commas',tagsPh:'e.g. client, design',
chooseAudio:'Choose an audio or video file',sttOffTitle:'Automatic file transcription isn’t switched on yet',sttOffBody:'Turning files into text needs a speech-to-text provider on the KEEK server, which hasn’t been chosen yet (it will be, after benchmarking accuracy on real Arabic recordings). You can attach the file for playback and paste its transcript.',continueWithTranscript:'Continue and paste transcript',
pasteLabel:'Meeting transcript',pastePh:'Paste the transcript here. Supported formats:\n[00:12] Ahmed: Let’s start with onboarding\n00:45 Sara: The designs are ready\nor plain lines without timestamps.',pasteEmpty:'Paste a transcript first.',audioAttachedSession:'attached for playback in this session',
untitled:'Meeting',processed:'Finished processing “{title}”',aiUnavailable:'AI isn’t available in this view.',noTranscript:'No transcript',noTranscriptBody:'This meeting has no transcript.',interrupted:'Processing stopped when the page closed. Try again.',
mt_overview:'Overview',mt_summary:'Summary',mt_transcript:'Transcript',mt_decisions:'Decisions',mt_actions:'Action items',mt_participants:'Participants',
edit:'Edit',export:'Export',share:'Share',delete:'Delete',processFailed:'Processing failed',retry:'Try again',processNow:'Process now',
noAudio:'No audio in this session.',attachAudio:'Attach audio file',audioAttached:'Audio attached for this session',noAudioToPlay:'Attach an audio file to play from this timestamp.',playFromHere:'Play from here',
noReportYet:'No report yet',noReportBody:'The report appears once the transcript is processed.',decisions:'Decisions',openQuestions:'Open questions',risks:'Risks and blockers',noDecisionsMeeting:'No explicit decisions were found in this meeting.',noParticipants:'No participants listed.',
sOverview:'Overview',sTopics:'Main topics',sPoints:'Important discussion points',sFollowup:'Suggested follow-up',actionItems:'Action items',review:'Review',none:'None.',aiGenerated:'AI-generated',editedByYou:'Edited by you',aiSuggestion:'KEEK suggestion — review before sending',
regenerate:'Regenerate',regenerating:'Regenerating…',sectionRegenerated:'Section regenerated',droppedNote:'{n} items were left out because no supporting transcript line was found.',
searchTranscript:'Search the transcript',copy:'Copy',transcriptEditHint:'Click a timestamp to play from that moment, or any line to edit it. The original text is kept.',edited:'Edited',original:'Original',nHits:'{n} matches',
renameSpeaker:'Rename',renameSpeakerHint:'“{n}” will change on every line of this meeting.',newName:'New name',
decisionsHint:'Each decision links to the line where it was made. Mark it confirmed, rejected or unresolved.',addDecision:'Add decision',editDecision:'Edit decision',manualDecisionNote:'Decisions added by hand aren’t linked to a transcript line.',addedManually:'Added manually',
ds_review:'Needs review',ds_confirmed:'Confirmed',ds_unresolved:'Unresolved',ds_rejected:'Rejected',
actionsHint:'Owners and due dates are only filled in when they were said explicitly. Approve or dismiss extracted items.',addTask:'Add action item',editTask:'Edit action item',noTasksMeeting:'No action items for this meeting.',
ts_open:'Open',ts_in_progress:'In progress',ts_completed:'Completed',ts_cancelled:'Cancelled',
unassigned:'Unassigned',aiSuggested:'AI-suggested',overdue:'Overdue',confirm:'Confirm',markDone:'Completed',needsReview:'Extracted automatically — needs your review',approve:'Approve',dismiss:'Dismiss',dismissed:'Action item dismissed',lowConfidence:'Low confidence',
openSource:'Open the source in the transcript',source:'Source',owner:'Owner',dueDate:'Due date',saidInMeeting:'Said in the meeting',description:'Description',
participantsHint:'Participants from the meeting details, plus speakers found in the transcript.',name:'Name',linesSpoken:'Lines',assignedItems:'Assigned items',noDiarization:'This transcript has no speaker labels; KEEK won’t guess who said what.',
editMeeting:'Edit meeting details',meetingUrl:'Meeting link',exportHint:'Choose what to export:',exTxt:'Full transcript',exSummary:'Summary (Markdown)',exCsv:'Action items (CSV)',exJson:'All meeting data (JSON)',exportLater:'DOCX, PDF and original audio export arrive with the backend and desktop app.',
shareOffTitle:'Sharing isn’t available yet',shareOffBody:'Controlled share links (view-only, expiry, revoke access) need the team backend. Public sharing will be off by default.',shareMeanwhile:'For now, export the summary or action items and send them yourself.',
deleteMeetingQ:'Permanently delete this meeting, its transcript, action items and everything derived from it?',
nav_search_dummy:'',searchSub:'Ask in your own words; every answer is grounded in your meetings and linked to its sources.',keywordPh:'Search for a word or a name…',modeAI:'Ask AI',modeKeyword:'Keyword',anyone:'Anyone',from:'From',to:'To',suggested:'Suggested questions',recentQueries:'Recent searches',noQueries:'None yet.',
sug1:'What did the client decide about onboarding?',sug2:'Which action items are overdue, and who owns them?',sug3:'What is still unresolved in Project Alpha?',sug4:'What changed across the last three meetings?',sug5:'Which risks came up in meetings this month?',sug6:'What payment problems did users mention?',
thinking:'Searching your meetings…',relatedMeetings:'Related meetings',sourceExcerpts:'Source excerpts',newSearch:'New search',conf_high:'Well supported by sources',conf_medium:'Partly supported',conf_low:'Not enough evidence',
noSourcesInScope:'No meetings with transcripts match these filters, so there isn’t enough information to answer.',transcriptMoments:'Transcript moments',
projectsSub:'Projects group related meetings with their decisions and action items.',newProject:'New project',active:'Active',archived:'Archived',noArchived:'No archived projects',noProjects:'No projects yet',noProjectsBody:'Create a project to group meetings, decisions and action items.',
projectName:'Project name',projectPh:'e.g. Client app redesign',create:'Create',addDescription:'Add a project description',searchProject:'Search this project',archive:'Archive',unarchive:'Unarchive',archivedToast:'Project archived',unarchivedToast:'Project restored',
projectContext:'Project context',overviewHint:'Ask KEEK for a status summary drawn from all of this project’s meetings.',overviewNeedsMeetings:'Add meetings to this project so KEEK can summarise it.',addExistingMeeting:'Add an existing meeting',noProjectMeetings:'No meetings in this project.',
recentActivity:'Recent activity',actMeeting:'Meeting: {t}',actDone:'Completed: {t}',completedItems:'Completed items',deleteProjectQ:'Delete this project? Its meetings stay, without a project.',refresh:'Refresh',generate:'Generate',
tasksSub:'Every action item extracted from your meetings or added by hand.',tf_all:'All',tf_mine:'My items',tf_unassigned:'Unassigned',tf_review:'Needs review',tf_completed:'Completed',searchTasks:'Search action items',anyDue:'Any due date',due_overdue:'Overdue',due_week:'Due in 7 days',due_none:'No due date',
noTasks:'No action items yet',noTasksBody:'Action items are extracted from meetings automatically.',setNameTitle:'Set your name',setNameBody:'“My items” shows items assigned to your name as it’s said in meetings.',sendToIntegration:'Sending items to Linear, Jira or Slack becomes available once those integrations are live.',
integrationsSub:'Connect KEEK to the tools you work in. Only the AI connection is live today; the rest follow the roadmap.',keekApps:'KEEK apps',
desktopDesc:'The primary capture engine: system audio (WASAPI on Windows, native APIs on macOS) plus microphone, saved locally before upload, with retries on network loss.',chromeExt:'Chrome extension',notInstalled:'Not installed',
chromeDesc:'Detects Meet, Zoom and Teams on the web, reads the meeting title and link, and controls recording through the desktop app (Native Messaging). It does not record audio itself.',plannedFor:'Planned for {v}',
svcAI:'AI (Claude)',aiDesc:'Analyses transcripts, extracts summaries, decisions and action items, and answers search questions with sources.',aiRequests:'{n} requests in this workspace',connected:'Connected',notConnected:'Not connected',directory:'Integration directory',permissions:'Permissions requested',connect:'Connect',
in_gcal:'Google Calendar',in_gcal_d:'Show upcoming meetings and link calendar events to recordings.',in_gcal_p:'Read events, participants and meeting links.',
in_outlook:'Outlook Calendar',in_outlook_d:'Sync calendar events and meeting context.',in_outlook_p:'Read calendar events.',
in_zoom:'Zoom',in_zoom_d:'Fetch permitted meeting metadata through Zoom’s official APIs.',in_zoom_p:'Read meeting metadata (no access to live audio).',
in_slack:'Slack',in_slack_d:'Share summaries and send notifications for approved action items.',in_slack_p:'Post messages to channels you choose.',
in_notion:'Notion',in_notion_d:'Export meeting summaries to Notion pages.',in_notion_p:'Create pages in workspaces you choose.',
in_linear:'Linear',in_linear_d:'Create issues from approved action items.',in_linear_p:'Create issues and read teams.',
in_jira:'Jira',in_jira_d:'Create or update issues from approved action items.',in_jira_p:'Create and edit issues in selected projects.',
in_webhooks:'Webhooks',in_webhooks_d:'Send KEEK events to your own systems or Zapier.',in_webhooks_p:'Send meeting data to a URL you set.',
integrationsNote:'Meeting-platform integrations do not give KEEK access to live meeting audio; the desktop app stays the primary capture method.',
teamSub:'Members, roles and permissions.',members:'Members',role:'Role',you:'You',activeMember:'Active',invite:'Invite a member',sendInvite:'Send invite',inviteOff:'Invitations need the team backend and shared sign-in, which aren’t live yet.',rolesPerms:'Roles and permissions',allowed:'Allowed',
r_owner:'Owner',r_admin:'Admin',r_member:'Member',r_guest:'Guest',p_workspace:'Full control and workspace deletion',p_billing:'Billing',p_members:'Manage members',p_integrations:'Manage integrations',p_record:'Record and manage own meetings',p_shared:'Access shared meetings',p_tasks:'Manage assigned items',p_viewShared:'View explicitly shared content',
set_profile:'Profile',set_workspace:'Workspace',set_audio:'Audio',set_privacy:'Privacy and data',set_notifications:'Notifications',set_billing:'Plan and billing',
nameHint:'Used to show the action items assigned to you.',language:'Language',theme:'Appearance',th_system:'Match device',th_light:'Light',th_dark:'Dark',accountNote:'You’re signed in through your Claude account. Email, Google and Microsoft sign-in and device management arrive with the KEEK backend.',
wsName:'Workspace name',wsTypeLabel:'Type',audioDesktopNote:'Choosing audio devices and enabling system audio happens in the desktop app.',micTest:'Microphone test',micTestHint:'Check that the browser hears you before recording.',testMic:'Test',speakNow:'Speak now…',micOk:'Your microphone is working.',micSilent:'No sound was picked up. Check the selected microphone.',
sysAudio:'System audio',sysAudioBody:'Not available from the browser. It will be enabled through the desktop app (macOS and Windows).',
storeDesc_db:'Your data is stored in your Claude account, in a space only you can read; nobody else who opens this page can see it.',storeDesc_local:'Your data is stored in this browser only.',storeDesc_memory:'Storage isn’t available; data is lost when the page closes.',
processorsNote:'Data processors: Claude by Anthropic analyses transcripts; your browser’s speech recognition service is used during live recording. Audio recorded in the browser isn’t uploaded.',noTraining:'Your meetings are not used to train any model.',
consentGuidance:'Laws differ by country; always tell participants before recording.',exportAll:'Export all data (JSON)',removeSample:'Remove sample data',removeSampleQ:'Remove all sample projects and meetings?',deleteAll:'Delete all data',deleteAllQ:'All meetings, transcripts and action items will be permanently deleted. This can’t be undone.',
notifyInApp:'In-app notifications',notifyInApp_d:'When processing completes or fails.',notifyDesktop:'Desktop notifications',notifyDesktop_d:'Available with the desktop app.',notifyEmail:'Email notifications',notifyEmail_d:'Available with the KEEK backend.',notifySlack:'Slack',notifySlack_d:'Available once the Slack integration is live.',
currentPlan:'Current plan',previewPlan:'Preview with no usage limits.',usageLine:'{m} meetings — {min} minutes — {a} AI requests',current:'Current',
plan_free:'Free',plan_free_for:'For individuals exploring KEEK',plan_free_f:'Limited recording minutes|Basic summaries|Limited history|One personal workspace',
plan_pro:'Pro',plan_pro_for:'For professionals',plan_pro_f:'More recording minutes|Meeting intelligence|Search across meetings|Projects and tags|Export and integrations',
plan_team:'Team',plan_team_for:'For small and growing teams',plan_team_f:'Shared workspace|Shared meetings and search|Team decisions and items|Member management',
plan_enterprise:'Enterprise',plan_enterprise_for:'For organisations',plan_enterprise_f:'Advanced access controls|Custom retention|Admin controls|Dedicated support',
pricingNote:'Prices aren’t set yet; they’ll be decided after measuring transcription, AI and storage costs.',
areYouSure:'Are you sure?',cancel:'Cancel',close:'Close',save:'Save',saved:'Saved',deleted:'Deleted',titleRequired:'A title is required.',copied:'Copied',copyFailed:'Couldn’t copy',copiedInstead:'Download isn’t available here, so the content was copied instead.',exportUnavailable:'Export isn’t available in this view.',
sampleLoaded:'Sample data loaded',sampleRemoved:'Sample data removed',allDeleted:'All data deleted',saveFailed:'Couldn’t save changes. KEEK will retry with your next edit.',tooLarge:'This item is larger than the save limit.',loadFailed:'Couldn’t load your data from your account; using the browser copy.',notFound:'Not found',minutes:'{n} min',
aiOffTitle:'AI isn’t available here',aiOffBody:'Analysis and AI search work when KEEK is opened inside Claude and allowed to use it. Import, keyword search and editing still work.',
aiDeclined:'KEEK wasn’t allowed to use Claude. You can allow it from the permissions menu.',aiRate:'Too many requests in a short time. Wait a moment and try again.',aiFailed:'Couldn’t complete the request',recordingNow:'Recording',more:'More',filters:'Filters',today:'Today',yesterday:'Yesterday',thisWeek:'This week',earlier:'Earlier',selectMeeting:'Select a meeting',selectMeetingBody:'Open any meeting from the list to see its summary, transcript and decisions here.'
}};

/* KEEK sample workspace — loaded only when the person chooses it. Every item carries sample:true. */
function buildSample(){
  const mk=(id,rows)=>rows.map((r,i)=>({id:id+'-'+i,t:r[0]*1000,sp:r[1],text:r[2]}));
  const ts=(m,s)=>m*60+s;
  const P=[
    {id:'p1',name:'مشوار — تطبيق التوصيل',desc:'مشروع فريلانس لإعادة تصميم تجربة التسجيل في تطبيق توصيل لعميل في القاهرة.',sample:true,created:'2026-09-20',archived:false},
    {id:'p2',name:'Project Alpha — منصة تعلم',desc:'Learning platform: quiz builder, question bank and video lessons.',sample:true,created:'2026-09-01',archived:false},
    {id:'p3',name:'بحث المستخدمين — الدفع الإلكتروني',desc:'مقابلات مستخدمين لفهم الثقة والقلق أثناء الدفع من الموبايل.',sample:true,created:'2026-10-15',archived:false}
  ];
  const m1s=mk('m1',[
    [ts(0,5),'أحمد سمير','صباح الخير يا جماعة، النهارده عايزين نقفل موضوع الـ onboarding flow عشان التطوير يبدأ الأسبوع الجاي.'],
    [ts(0,41),'سارة عادل','تمام، أنا جهزت اتنين options: الأول خمس شاشات تعريفية، والتاني شاشة واحدة وبعدها الـ sign up على طول.'],
    [ts(1,30),'أحمد سمير','بصراحة الناس بتقفل التطبيق من كتر الشاشات. أنا مع الشاشة الواحدة.'],
    [ts(2,12),'كريم فؤاد','من ناحية التطوير الشاشة الواحدة أسهل، بس محتاجين نقرر هل التسجيل برقم الموبايل بس ولا كمان بالإيميل.'],
    [ts(3,5),'أحمد سمير','خلّوه رقم الموبايل بس في الأول، والإيميل نضيفه بعدين في الإعدادات.'],
    [ts(3,48),'سارة عادل','يبقى اتفقنا: شاشة تعريف واحدة، وتسجيل برقم الموبايل و OTP.'],
    [ts(4,20),'أحمد سمير','اتفقنا. سارة، ممكن تبعتيلي التصميم النهائي يوم الخميس؟'],
    [ts(4,35),'سارة عادل','أكيد، الخميس الصبح يكون عندك.'],
    [ts(5,10),'كريم فؤاد','وأنا محتاج أعرف مين الـ SMS provider اللي هنستخدمه عشان الـ OTP.'],
    [ts(5,40),'أحمد سمير','لسه بنقارن بين اتنين، هرد عليك بعد ما أكلم الإدارة.'],
    [ts(6,15),'أحمد سمير','آخر حاجة: عايزين نقيس نسبة اللي بيكملوا التسجيل من أول يوم.']
  ]);
  const m2s=mk('m2',[
    [ts(0,3),'Omar Hany','OK let\'s start sprint 14 planning. الهدف الأساسي السبرينت ده هو الـ quiz builder.'],
    [ts(0,38),'Nour Ali','The quiz builder designs are ready, بس لسه الـ question bank مش متصمم.'],
    [ts(1,20),'Youssef Adel','I estimate the builder at around 8 days if we skip the question bank for now.'],
    [ts(2,5),'Omar Hany','Then let\'s do that. Quiz builder in this sprint, question bank next sprint. Agreed?'],
    [ts(2,15),'Nour Ali','Agreed.'],
    [ts(2,40),'Youssef Adel','One risk: the video upload bug is still open and customers are complaining.'],
    [ts(3,10),'Omar Hany','Youssef, please fix the video upload bug first, before Wednesday.'],
    [ts(3,22),'Youssef Adel','Fine, I\'ll take it.'],
    [ts(4,0),'Nour Ali','I\'ll run two usability tests on the builder prototype this week.'],
    [ts(4,45),'Omar Hany','Do we need a separate mobile layout for the builder? I\'m not sure yet.'],
    [ts(5,20),'Nour Ali','خلينا نشوف نتايج الـ tests الأول وبعدين نقرر.']
  ]);
  const m3s=mk('m3',[
    [ts(0,10),'منى','شكراً إنك معانا. احكيلي آخر مرة دفعت أونلاين كانت إزاي؟'],
    [ts(0,35),'مشارك ٣','امبارح دفعت فاتورة النت من الموبايل، بس اتلخبطت في خطوة الـ OTP لأن الرسالة اتأخرت.'],
    [ts(1,20),'منى','اتأخرت قد إيه تقريباً؟'],
    [ts(1,28),'مشارك ٣','يمكن دقيقتين، وكنت خايف الفلوس تتسحب مرتين فقفلت الصفحة.'],
    [ts(2,15),'منى','وإيه اللي كان ممكن يطمنك في اللحظة دي؟'],
    [ts(2,30),'مشارك ٣','لو كان فيه رسالة واضحة إن العملية لسه ماتمتش وإن مفيش فلوس اتسحبت.'],
    [ts(3,40),'مشارك ٣','كمان أنا مش بثق أحفظ الكارت، بفضل أدخله كل مرة.'],
    [ts(4,30),'منى','تمام، ده مفيد جداً. هبعتلك قسيمة الشكر النهارده.']
  ]);
  const m4s=mk('m4',[
    [ts(0,4),'سارة عادل','دي النسخة الجديدة من شاشة التسجيل بعد ما شيلنا الشاشات التعريفية.'],
    [ts(0,30),'أحمد سمير','حلوة جداً. بس الزرار الأخضر صغير شوية على الموبايلات الصغيرة.'],
    [ts(1,5),'سارة عادل','هكبّره لـ 48 بكسل على الأقل.'],
    [ts(1,40),'أحمد سمير','وموضوع الـ SMS provider: الإدارة وافقت على المزود الأرخص.'],
    [ts(2,10),'سارة عادل','يعني نكمل على الـ OTP زي ما اتفقنا الشهر اللي فات؟'],
    [ts(2,20),'أحمد سمير','أيوه، مفيش تغيير.'],
    [ts(3,0),'أحمد سمير','محتاجين النسخة النهائية من كل الشاشات قبل يوم 15.'],
    [ts(3,15),'سارة عادل','تمام، 15 نوفمبر هتكون جاهزة.']
  ]);
  const m5s=mk('m5',[
    [ts(0,2),'Omar Hany','Quick sync. Youssef, where are we on the video bug?'],
    [ts(0,15),'Youssef Adel','Still in progress, the root cause is the upload timeout on large files. I need two more days.'],
    [ts(0,50),'Omar Hany','OK. Nour, how did the usability tests go?'],
    [ts(1,5),'Nour Ali','Both participants finished the quiz, but both missed the "add question" button. It needs to be more visible.'],
    [ts(1,50),'Omar Hany','Let\'s move the button to the top of the builder then.'],
    [ts(2,5),'Nour Ali','Agreed, I\'ll update the design today.'],
    [ts(2,40),'Omar Hany','Mobile layout is still not decided, let\'s keep it open until we have more data.']
  ]);
  const r=(m,arr)=>arr.map(i=>m+'-'+i);
  const dec=(m,id,title,description,refs,status)=>({id,title,description,refs:r(m,refs),confidence:'high',status});
  const M=[
    {id:'m1',title:'متابعة مع العميل — شاشة الـ Onboarding',date:'2026-10-08T11:00',duration:ts(6,40)*1000,platform:'meet',projectId:'p1',tags:['عميل','onboarding'],status:'completed',participants:['أحمد سمير','سارة عادل','كريم فؤاد'],sample:true,source:'import',transcript:m1s,
     report:{overview:'اجتماع مع العميل أحمد سمير لحسم تجربة الـ Onboarding في تطبيق مشوار قبل بدء التطوير. قورن خياران، واستقر الفريق على شاشة تعريف واحدة يليها التسجيل برقم الموبايل ورمز OTP، مع تأجيل التسجيل بالبريد الإلكتروني. بقي اختيار مزود الرسائل النصية مفتوحاً.',
      topics:['Onboarding','التسجيل و OTP','مزود SMS'],
      points:[{title:'خيارات تصميم الـ Onboarding',detail:'خمس شاشات تعريفية مقابل شاشة واحدة؛ العميل يرى أن كثرة الشاشات تدفع المستخدمين لإغلاق التطبيق.',refs:r('m1',[1,2])},{title:'طريقة التسجيل',detail:'رقم الموبايل فقط في البداية، والبريد الإلكتروني لاحقاً من الإعدادات.',refs:r('m1',[3,4])},{title:'قياس النجاح',detail:'قياس نسبة من يكملون التسجيل من أول يوم.',refs:r('m1',[10])}],
      decisions:[dec('m1','d-m1-1','شاشة تعريف واحدة بدلاً من خمس شاشات','اعتماد شاشة تعريفية واحدة ثم الانتقال مباشرة إلى التسجيل.',[2,5],'confirmed'),dec('m1','d-m1-2','التسجيل برقم الموبايل و OTP فقط في الإصدار الأول','يُضاف التسجيل بالبريد الإلكتروني لاحقاً من الإعدادات.',[4,5],'confirmed')],
      questions:[{text:'أي مزود رسائل نصية (SMS) سيُعتمد للـ OTP؟',refs:r('m1',[8,9])}],
      risks:[{text:'بدء التطوير الأسبوع القادم يعتمد على حسم مزود الرسائل النصية.',refs:r('m1',[0,8,9])}],
      followup:{subject:'ملخص اجتماع الـ Onboarding — ٨ أكتوبر',body:'أهلاً أحمد،\n\nشكراً على وقتك اليوم. باختصار ما اتفقنا عليه:\n- شاشة تعريف واحدة ثم التسجيل مباشرة.\n- التسجيل برقم الموبايل و OTP فقط في الإصدار الأول، والبريد الإلكتروني لاحقاً.\n\nالخطوات التالية:\n- سارة ترسل التصميم النهائي يوم الخميس.\n- في انتظار ردك بخصوص مزود الرسائل النصية.\n\nتحياتي'},at:'sample'}},
    {id:'m2',title:'Sprint 14 planning — Alpha',date:'2026-11-02T10:00',duration:ts(5,50)*1000,platform:'zoom',projectId:'p2',tags:['sprint','planning'],status:'completed',participants:['Omar Hany','Nour Ali','Youssef Adel'],sample:true,source:'import',transcript:m2s,
     report:{overview:'Sprint 14 planning for Project Alpha. The team agreed to build the quiz builder this sprint and move the question bank to the next one, based on an estimate of about 8 days. Fixing the open video upload bug was made the first priority. Whether the builder needs a separate mobile layout stays open until usability tests report back.',
      topics:['Quiz builder','Video upload bug','Mobile layout'],
      points:[{title:'Sprint goal',detail:'The quiz builder is the main goal; designs are ready but the question bank is not designed yet.',refs:r('m2',[0,1,2])},{title:'Customer-facing bug',detail:'The video upload bug is still open and customers are complaining.',refs:r('m2',[5])}],
      decisions:[dec('m2','d-m2-1','Quiz builder this sprint; question bank next sprint','Scope the sprint to the builder only.',[2,3,4],'confirmed'),dec('m2','d-m2-2','Fix the video upload bug first','The bug fix takes priority over new work.',[6,7],'confirmed')],
      questions:[{text:'Does the builder need a separate mobile layout?',refs:r('m2',[9,10])}],
      risks:[{text:'Open video upload bug is affecting customers.',refs:r('m2',[5])},{text:'The 8-day estimate assumes the question bank stays out of scope.',refs:r('m2',[2])}],
      followup:{subject:'Sprint 14 — scope and priorities',body:'Hi team,\n\nSprint 14 scope: the quiz builder only; the question bank moves to sprint 15.\nFirst priority: Youssef fixes the video upload bug before Wednesday.\nNour runs two usability tests on the builder prototype this week.\n\nStill open: whether the builder needs a separate mobile layout.'},at:'sample'}},
    {id:'m3',title:'مقابلة مستخدم ٣ — تجربة الدفع',date:'2026-10-28T15:30',duration:ts(5,0)*1000,platform:'inperson',projectId:'p3',tags:['بحث','مقابلة'],status:'completed',participants:['منى','مشارك ٣'],sample:true,source:'import',transcript:m3s,
     report:{overview:'مقابلة بحثية مع المشارك الثالث حول تجربته الأخيرة في الدفع من الموبايل. تأخر رسالة الـ OTP دقيقتين جعله يخشى الخصم المزدوج فأغلق الصفحة، وقال إن رسالة واضحة بحالة العملية كانت ستطمئنه. كما أبدى عدم ثقة في حفظ بيانات البطاقة.',
      topics:['OTP','الثقة في الدفع','حفظ البطاقة'],
      points:[{title:'تأخر الـ OTP يسبب قلقاً',detail:'تأخر حوالي دقيقتين أدى إلى الخوف من الخصم مرتين وإغلاق الصفحة.',refs:r('m3',[1,3])},{title:'الحاجة إلى رسالة حالة واضحة',detail:'رسالة توضح أن العملية لم تكتمل وأنه لم يُخصم أي مبلغ.',refs:r('m3',[5])},{title:'ضعف الثقة في حفظ البطاقة',detail:'يفضّل إدخال بيانات البطاقة كل مرة.',refs:r('m3',[6])}],
      decisions:[],questions:[{text:'هل يتكرر تأخر الـ OTP مع باقي المشاركين؟',refs:r('m3',[1,3])}],
      risks:[{text:'المستخدم أغلق صفحة الدفع أثناء انتظار الـ OTP، ما قد يعني عمليات غير مكتملة.',refs:r('m3',[3])}],
      followup:{subject:'شكراً لمشاركتك',body:'أهلاً،\n\nشكراً على وقتك في المقابلة اليوم؛ ملاحظاتك عن تجربة الدفع مفيدة جداً. قسيمة الشكر في الطريق إليك.\n\nمع التحية،\nمنى'},at:'sample'}},
    {id:'m4',title:'مراجعة التصميم — مشوار',date:'2026-11-05T13:00',duration:ts(3,40)*1000,platform:'meet',projectId:'p1',tags:['عميل','تصميم'],status:'completed',participants:['أحمد سمير','سارة عادل'],sample:true,source:'import',transcript:m4s,
     report:{overview:'مراجعة النسخة الجديدة من شاشة التسجيل بعد إزالة الشاشات التعريفية. طلب العميل تكبير الزر الرئيسي للموبايلات الصغيرة، وأكد موافقة الإدارة على مزود الرسائل الأرخص مع الإبقاء على مسار الـ OTP. التسليم النهائي قبل ١٥ نوفمبر.',
      topics:['تصميم التسجيل','مزود SMS','التسليم النهائي'],
      points:[{title:'ملاحظات على شاشة التسجيل',detail:'الزر الأخضر صغير على الشاشات الصغيرة.',refs:r('m4',[1,2])},{title:'مزود الرسائل النصية',detail:'وافقت الإدارة على المزود الأرخص.',refs:r('m4',[3])}],
      decisions:[dec('m4','d-m4-1','اعتماد مزود الرسائل النصية الأرخص','وافقت إدارة العميل على المزود الأرخص للـ OTP.',[3],'confirmed'),dec('m4','d-m4-2','الإبقاء على مسار التسجيل بالـ OTP دون تغيير','استمرار ما اتُّفق عليه في اجتماع أكتوبر.',[4,5],'review')],
      questions:[],risks:[{text:'موعد التسليم ١٥ نوفمبر يشمل كل الشاشات وليس شاشة التسجيل فقط.',refs:r('m4',[6,7])}],
      followup:{subject:'مراجعة التصميم — الخطوات التالية',body:'أهلاً أحمد،\n\nتم تسجيل ملاحظتك: سيتم تكبير الزر الرئيسي إلى ٤٨ بكسل على الأقل.\nسنكمل على مسار الـ OTP مع المزود الذي وافقت عليه الإدارة.\nالنسخة النهائية من كل الشاشات يوم ١٥ نوفمبر.\n\nتحياتي، سارة'},at:'sample'}},
    {id:'m5',title:'Weekly sync — Alpha',date:'2026-11-06T09:30',duration:ts(3,0)*1000,platform:'teams',projectId:'p2',tags:['sync'],status:'completed',participants:['Omar Hany','Nour Ali','Youssef Adel'],sample:true,source:'import',transcript:m5s,
     report:{overview:'Short weekly sync for Project Alpha. The video upload bug is still in progress; the cause is an upload timeout on large files and Youssef needs two more days. Both usability-test participants missed the "add question" button, so the team agreed to move it to the top of the builder. The mobile layout question stays open.',
      topics:['Video upload bug','Usability tests','Mobile layout'],
      points:[{title:'Video bug status',detail:'Root cause found (timeout on large uploads); two more days needed.',refs:r('m5',[1])},{title:'Usability test results',detail:'Both participants completed the quiz but missed the add-question button.',refs:r('m5',[3])}],
      decisions:[dec('m5','d-m5-1','Move the "add question" button to the top of the builder','Response to both usability participants missing it.',[4,5],'review')],
      questions:[{text:'Does the builder need a separate mobile layout?',refs:r('m5',[6])}],
      risks:[{text:'Video bug fix has slipped past its Wednesday deadline.',refs:r('m5',[1])}],
      followup:{subject:'Weekly sync — Alpha',body:'Hi all,\n\n- Video bug: root cause is the upload timeout on large files; Youssef needs two more days.\n- Usability: both participants missed the add-question button; it moves to the top of the builder. Nour updates the design today.\n- Mobile layout: still open.'},at:'sample'}}
  ];
  const tk=(id,title,owner,ownerState,due,dueText,status,mid,pid,refs,extra={})=>({id,title,description:'',owner,ownerState,due,dueText,status,meetingId:mid,projectId:pid,refs:r(mid,refs),confidence:'high',review:false,sample:true,...extra});
  const T=[
    tk('t1','إرسال التصميم النهائي لشاشة الـ Onboarding','سارة عادل','confirmed','2026-10-09','الخميس الصبح','completed','m1','p1',[6,7],{completedAt:'2026-10-09'}),
    tk('t2','تحديد مزود الرسائل النصية (SMS) للـ OTP','أحمد سمير','confirmed',null,null,'completed','m1','p1',[8,9],{completedAt:'2026-11-05'}),
    tk('t3','إضافة قياس نسبة إكمال التسجيل في اليوم الأول',null,null,null,null,'open','m1','p1',[10],{confidence:'low',review:true}),
    tk('t4','Fix the video upload bug','Youssef Adel','confirmed','2026-11-04','before Wednesday','in_progress','m2','p2',[6,7]),
    tk('t5','Run two usability tests on the builder prototype','Nour Ali','confirmed',null,'this week','completed','m2','p2',[8],{completedAt:'2026-11-06'}),
    tk('t6','إرسال قسيمة الشكر للمشارك ٣','منى','confirmed','2026-10-28','النهارده','completed','m3','p3',[7],{completedAt:'2026-10-28'}),
    tk('t7','تكبير الزر الرئيسي إلى ٤٨ بكسل على الأقل','سارة عادل','ai',null,null,'open','m4','p1',[1,2],{review:true}),
    tk('t8','تسليم النسخة النهائية من كل الشاشات','سارة عادل','confirmed','2026-11-15','15 نوفمبر','open','m4','p1',[6,7]),
    tk('t9','Update the builder design: add-question button at top','Nour Ali','ai','2026-11-06','today','open','m5','p2',[4,5],{review:true})
  ];
  return {projects:P,meetings:M,tasks:T};
}

/* ---------- utilities ---------- */
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const todayISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const nowLocal=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)};
const norm=s=>String(s||'').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const tokens=s=>norm(s).split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>1);
const arabicRatio=s=>{const a=(s.match(/[\u0600-\u06FF]/g)||[]).length,l=(s.match(/[A-Za-z]/g)||[]).length;return a/Math.max(1,a+l)};
const locale=()=>S&&S.settings.lang==='en'?'en-US':'ar-EG';
const fmtNum=n=>new Intl.NumberFormat(locale()).format(n);
const fmtDate=(iso,opt={day:'numeric',month:'short',year:'numeric'})=>{if(!iso)return'';const d=new Date(iso.length===10?iso+'T12:00':iso);return isNaN(d)?esc(iso):new Intl.DateTimeFormat(locale(),opt).format(d)};
const fmtDateTime=iso=>fmtDate(iso,{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'});
const fmtTs=ms=>{if(ms==null)return'—';const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;const f=n=>new Intl.NumberFormat(locale(),{minimumIntegerDigits:2}).format(n);return(h?f(h)+':':'')+f(m)+':'+f(x)};
const fmtDur=ms=>{if((ms||0)<60000)return fmtTs(ms||0);const m=Math.round(ms/60000);return t('minutes',{n:fmtNum(m)})};
const initials=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('');
const debounce=(fn,ms)=>{let h;return(...a)=>{clearTimeout(h);h=setTimeout(()=>fn(...a),ms)}};
function t(k,v){const d=I18N[S?S.settings.lang:(UI.onb.lang||'ar')]||I18N.ar;let s=d[k]??I18N.en[k]??k;if(v)for(const x in v)s=s.split('{'+x+'}').join(v[x]);return s}
function toast(msg){const box=$('#toasts');const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=msg;box.appendChild(el);setTimeout(()=>el.remove(),3800)}

/* ---------- state ---------- */
let S=null;
const UI={route:'overview',params:{},tab:'overview',q:'',filters:{},modal:null,lang:'ar',ready:false,busy:{},onb:{step:0,lang:'ar',kind:'personal',name:'',project:''}};
const blankState=()=>({v:2,settings:{lang:UI.onb.lang,theme:'system',myName:'',wsName:'',wsKind:'personal',notifyInApp:true},projects:[],meetings:[],tasks:[],searches:[],usage:{ai:0}});

/* ---------- storage: per-person private db subtree, browser storage as fallback ---------- */
const Store={mode:'none',col:null,last:{},queue:Promise.resolve(),status:'idle',
  async init(){
    const C=window.claude;
    if(C&&C.use){
      try{
        const [db,user]=await Promise.all([C.use('db'),C.use('user')]);
        const id=user?await user.id():null;
        if(db&&id){this.col=db.collection('data/users/'+id+'/keek');this.mode='db';}
      }catch(e){console.warn('db unavailable',e)}
      try{AI.fn=await C.use('sample');}catch(e){AI.fn=null}
      try{Store.dl=await C.use('downloads');}catch(e){Store.dl=null}
    }
    if(this.mode!=='db')this.mode=(()=>{try{localStorage.setItem('keek-test','1');localStorage.removeItem('keek-test');return'local'}catch(e){return'memory'}})();
  },
  async load(){
    if(this.mode==='db'){
      const snap=await Promise.race([this.col.get(),new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),10000))]);
      const docs={};snap.docs.forEach(d=>{if(d.exists){docs[d.id]=d.data();this.last[d.id]=JSON.stringify(d.data())}});
      if(!docs.ws)return null;
      const ws=docs.ws;
      if(ws.v!==2)return null;
      return {v:2,settings:ws.settings,projects:ws.projects||[],tasks:ws.tasks||[],searches:ws.searches||[],usage:ws.usage||{ai:0},
        meetings:(ws.meetingIds||[]).map(i=>docs['m_'+i]).filter(Boolean)};
    }
    if(this.mode==='local'){try{const raw=localStorage.getItem('keek-v2');return raw?JSON.parse(raw):null}catch(e){return null}}
    return null;
  },
  entries(){
    const e={ws:{v:2,settings:S.settings,projects:S.projects,tasks:S.tasks,usage:S.usage,
      searches:S.searches.slice(0,20),meetingIds:S.meetings.map(m=>m.id)}};
    S.meetings.forEach(m=>e['m_'+m.id]=m);
    return e;
  },
  save:null,
  async flush(){
    if(!S)return;
    if(this.mode==='local'){try{localStorage.setItem('keek-v2',JSON.stringify(S));this.setStatus('saved')}catch(e){this.setStatus('error')}return}
    if(this.mode!=='db')return;
    const e=this.entries();const jobs=[];
    for(const k in e){const s=JSON.stringify(e[k]);if(this.last[k]!==s){if(s.length>250000){toast(t('tooLarge'));continue}jobs.push(['set',k,e[k],s])}}
    for(const k in this.last){if(!(k in e))jobs.push(['del',k])}
    if(!jobs.length)return;
    this.setStatus('saving');
    this.queue=this.queue.then(async()=>{
      try{for(const j of jobs){if(j[0]==='set'){await this.col.doc(j[1]).set(j[2]);this.last[j[1]]=j[3]}else{await this.col.doc(j[1]).delete();delete this.last[j[1]]}}this.setStatus('saved')}
      catch(err){console.error(err);this.setStatus('error');toast(t('saveFailed'))}
    });
  },
  setStatus(s){this.status=s;const el=$('#saveState');if(el)el.textContent=t('save_'+s)}
};
Store.save=debounce(()=>Store.flush(),1200);
const commit=()=>Store.save();

/* ---------- AI (Claude via the page's sample capability) ---------- */
const AI={fn:null,
  ok(){return!!this.fn},
  err(e){if(!e)return t('aiFailed');if(e.code==='not_granted')return t('aiDeclined');if(e.code==='rate_limited')return t('aiRate');return t('aiFailed')+(e.message?' ('+e.message+')':'')},
  async json(prompt){return await this.fn.json(prompt,{modelTier:'default',cache:false})},
  async text(input,onText){const r=await this.fn(input,{modelTier:'default',cache:false,onText:onText?({text})=>onText(text):undefined});return r.text}
};

/* ---------- lookups ---------- */
const P=id=>S.projects.find(p=>p.id===id);
const M=id=>S.meetings.find(m=>m.id===id);
const D=id=>S.documents.find(d=>d.id===id);
const segOf=(m,sid)=>m&&m.transcript?m.transcript.find(s=>s.id===sid):null;
const isDone=tk=>tk.status==='completed'||tk.status==='cancelled';
const isOverdue=tk=>!isDone(tk)&&!tk.dismissed&&tk.due&&tk.due<todayISO();
const allDecisions=()=>S.meetings.flatMap(m=>(m.report?.decisions||[]).map(d=>({...d,meeting:m})));
const liveTasks=()=>S.tasks.filter(x=>!x.dismissed);
const isMine=tk=>{const me=norm(S.settings.myName);return !!me&&!!tk.owner&&(norm(tk.owner).includes(me)||me.includes(norm(tk.owner)))};
function people(){
  const map={};
  const add=(n,kind,ref)=>{if(!n)return;const k=norm(n);(map[k]=map[k]||{name:n,meetings:new Set(),tasks:[]});if(kind==='m')map[k].meetings.add(ref);else map[k].tasks.push(ref)};
  S.meetings.forEach(m=>{(m.participants||[]).forEach(p=>add(p,'m',m.id));(m.transcript||[]).forEach(s=>{if(s.sp&&!/^(speaker|متحدث)\s*\d+$/i.test(s.sp))add(s.sp,'m',m.id)})});
  S.tasks.filter(x=>!x.dismissed).forEach(tk=>add(tk.owner,'t',tk.id));
  return Object.values(map).map(p=>({...p,meetings:[...p.meetings]})).sort((a,b)=>b.meetings.length-a.meetings.length);
}

/* ---------- transcript import ---------- */
function parseTranscript(raw,mid,start=0){
  const lines=raw.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const out=[];
  const re=/^[\[\(]?((?:\d{1,2}:)?\d{1,2}:\d{2})(?:[.,]\d+)?[\]\)]?\s*[-–—]?\s*/;
  for(const l of lines){
    let rest=l,tms=null,sp=null;
    const m=rest.match(re);
    if(m){const p=m[1].split(':').map(Number);tms=(p.length===3?p[0]*3600+p[1]*60+p[2]:p[0]*60+p[1])*1000;rest=rest.slice(m[0].length)}
    const s=rest.match(/^([^:：]{1,40})[:：]\s+(.+)$/);
    if(s&&!/https?$/i.test(s[1])){sp=s[1].trim();rest=s[2]}
    if(!m&&!s&&out.length&&(out.at(-1).sp||out.at(-1).t!=null)){out.at(-1).text+=' '+rest;continue}
    out.push({t:tms,sp,text:rest});
  }
  return out.map((x,i)=>({id:mid+'-'+(start+i),t:x.t,sp:x.sp,text:x.text}));
}

/* ---------- processing pipeline: queued → (transcribing) → analyzing → indexing → completed ---------- */
const nextSeq=m=>m.seq??(m.transcript||[]).reduce((n,s)=>Math.max(n,+String(s.id).split('-').pop()+1),0);
const outLang=m=>arabicRatio((m.transcript||[]).map(s=>s.text).join(' '))>0.5?'Arabic (natural Modern Standard Arabic; speakers may use Egyptian dialect)':'English';
const tLines=m=>(m.transcript||[]).map(s=>s.id.split('-').pop()+' ['+fmtTsLatin(s.t)+'] '+(s.sp?s.sp+': ':'')+s.text).join('\n');
const fixRefs=(m,a)=>{const ids=new Set((m.transcript||[]).map(s=>s.id));return(Array.isArray(a)?a:[]).map(n=>m.id+'-'+String(n).replace(/\D/g,'')).filter(x=>ids.has(x))};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function notify(msg){if(S.settings.notifyInApp!==false)toast(msg)}
async function processMeeting(m){
  if(!AI.ok()){m.status='failed';m.error=t('aiUnavailable');commit();render();return}
  if(!m.transcript||!m.transcript.length){m.status='failed';m.error=t('noTranscript');commit();render();return}
  m.error=null;m.status='queued';commit();render();await wait(250);
  m.status='analyzing';commit();render();
  const full=tLines(m),body=full.length>100000?full.slice(0,100000):full;
  const prompt=`You are KEEK's meeting analyst. Analyse the meeting transcript below.
Rules:
- Use ONLY what the transcript says. Never invent facts, agreements, names, owners or deadlines.
- Every item MUST list in "refs" the numeric ids of the transcript lines that support it (the number at the start of each line).
- Decisions: only things explicitly agreed. Proposals that were not agreed belong in open questions.
- Action items: "owner" only if the task was explicitly assigned to or taken by a named person, else null. "due_text" only if a deadline was said. "due_iso" YYYY-MM-DD only if certain from the meeting date (${(m.date||'').slice(0,10)}), else null.
- "confidence": "low" when wording is ambiguous, else "high".
- "risks": risks and blockers that were actually raised or are directly evident from what was said.
- "followup": a short follow-up message the user could send to participants, based only on what was said.
- Write all text in ${outLang(m)}.
Return ONLY JSON:
{"overview":"3-5 sentences: what, why, main topics, outcomes","topics":["2-5 short labels"],"points":[{"title":"","detail":"","refs":[1]}],"decisions":[{"title":"","description":"","refs":[2],"confidence":"high"}],"actions":[{"title":"","description":"","owner":null,"due_text":null,"due_iso":null,"refs":[3],"confidence":"high"}],"questions":[{"text":"","refs":[4]}],"risks":[{"text":"","refs":[5]}],"followup":{"subject":"","body":""}}

Meeting: ${m.title}
Participants: ${(m.participants||[]).join(', ')||'not given'}
Transcript${full.length>100000?' (truncated)':''}:
${body}`;
  try{
    const r=await AI.json(prompt);S.usage.ai=(S.usage.ai||0)+1;
    const live=M(m.id);if(!live)return;
    let dropped=0;const keep=x=>{if(!x.title&&!x.text){return false}if(!x.refs.length){dropped++;return false}return true};
    const decisions=(r.decisions||[]).map(d=>({id:'d-'+uid(),title:String(d.title||''),description:String(d.description||''),refs:fixRefs(live,d.refs),confidence:d.confidence==='low'?'low':'high',status:'review'})).filter(keep);
    const acts=(r.actions||[]).map(a=>({id:'t-'+uid(),title:String(a.title||''),description:String(a.description||''),owner:a.owner||null,ownerState:a.owner?'ai':null,due:/^\d{4}-\d{2}-\d{2}$/.test(a.due_iso||'')?a.due_iso:null,dueText:a.due_text||null,status:'open',meetingId:live.id,projectId:live.projectId||null,refs:fixRefs(live,a.refs),confidence:a.confidence==='low'?'low':'high',review:true})).filter(keep);
    const list=(a)=>(a||[]).map(x=>({text:String(x.text||x||''),refs:fixRefs(live,x.refs)})).filter(x=>x.text);
    live.report={overview:String(r.overview||''),topics:(r.topics||[]).map(String).slice(0,5),points:(r.points||[]).map(p=>({title:String(p.title||''),detail:String(p.detail||''),refs:fixRefs(live,p.refs)})),
      decisions,questions:list(r.questions),risks:list(r.risks),followup:{subject:String(r.followup?.subject||''),body:String(r.followup?.body||'')},dropped,at:new Date().toISOString()};
    S.tasks=S.tasks.filter(x=>!(x.meetingId===live.id&&!x.manual&&x.review));
    S.tasks.push(...acts);
    live.status='indexing';commit();render();await wait(300);
    live.status='completed';live.processedAt=new Date().toISOString();commit();render();notify(t('processed',{title:live.title}));
  }catch(e){
    console.error(e);const live=M(m.id);if(!live)return;
    live.status='failed';live.error=AI.err(e);commit();render();
  }
}
const SECTION_SHAPES={overview:'"a 3-5 sentence overview string"',topics:'["2-5 short topic labels"]',points:'[{"title":"","detail":"","refs":[1]}]',questions:'[{"text":"","refs":[1]}]',risks:'[{"text":"","refs":[1]}]',followup:'{"subject":"","body":""}'};
async function regenSection(m,key){
  const prompt=`Rewrite only the "${key}" section of a meeting report, using ONLY the transcript below. Never invent anything. Items need "refs" with the numeric ids of supporting transcript lines. Write in ${outLang(m)}.
Return ONLY JSON: {"value": ${SECTION_SHAPES[key]}}

Meeting: ${m.title}
Transcript:
${tLines(m).slice(0,100000)}`;
  const r=await AI.json(prompt);S.usage.ai=(S.usage.ai||0)+1;
  let v=r.value;
  if(key==='points')v=(v||[]).map(p=>({title:String(p.title||''),detail:String(p.detail||''),refs:fixRefs(m,p.refs)}));
  else if(key==='questions'||key==='risks')v=(v||[]).map(x=>({text:String(x.text||''),refs:fixRefs(m,x.refs)})).filter(x=>x.text&&x.refs.length);
  else if(key==='topics')v=(v||[]).map(String).slice(0,5);
  else if(key==='followup')v={subject:String(v?.subject||''),body:String(v?.body||'')};
  else v=String(v||'');
  m.report[key]=v;m.report.edited=true;
}
const fmtTsLatin=ms=>{if(ms==null)return'--:--';const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};

/* ---------- retrieval for the assistant ---------- */
function scopeMeetings(scope){
  const done=S.meetings.filter(m=>m.transcript&&m.transcript.length);
  if(scope.type==='meeting'||scope.type==='meetings')return done.filter(m=>(scope.ids||[]).includes(m.id));
  if(scope.type==='project')return done.filter(m=>m.projectId===scope.ids?.[0]);
  return done;
}
function buildContext(scope,question){
  const ms=scopeMeetings(scope).sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  const fixed=[],segs=[];
  const q=new Set(tokens(question));
  for(const m of ms){
    const head=`Meeting "${m.title}" (${(m.date||'').slice(0,10)}${m.projectId&&P(m.projectId)?', project '+P(m.projectId).name:''})`;
    if(m.report){
      fixed.push({src:{m:m.id,tab:'summary'},line:`(AI summary of ${head}) ${m.report.overview}`});
      (m.report.risks||[]).forEach(x=>fixed.push({src:{m:m.id,tab:'summary',s:x.refs?.[0]},line:`(AI-extracted risk, ${head}) ${x.text}`}));
      (m.report.decisions||[]).filter(d=>d.status!=='rejected').forEach(d=>fixed.push({src:{m:m.id,tab:'decisions',s:d.refs[0]},line:`(Decision, ${head}, status: ${d.status==='confirmed'?'confirmed by user':d.status==='unresolved'?'marked unresolved':'AI-extracted, not yet reviewed'}) ${d.title}. ${d.description}`}));
      (m.report.questions||[]).forEach(x=>fixed.push({src:{m:m.id,tab:'summary',s:x.refs?.[0]},line:`(AI-extracted open question, ${head}) ${x.text}`}));
    }
    S.tasks.filter(x=>x.meetingId===m.id&&!x.dismissed).forEach(x=>fixed.push({src:{m:m.id,tab:'actions',s:x.refs?.[0]},line:`(Action item from ${head}) ${x.title}; owner: ${x.owner?x.owner+(x.ownerState==='ai'?' (AI-suggested)':''):'unassigned'}; due: ${x.due||x.dueText||'not stated'}; status: ${x.status}${isOverdue(x)?' (overdue)':''}`}));
    (m.transcript||[]).forEach((s,i)=>{const sc=tokens(s.text+' '+(s.sp||'')).filter(w=>q.has(w)).length;segs.push({src:{m:m.id,tab:'transcript',s:s.id},score:sc,order:i,line:`(Transcript, ${head}, ${fmtTsLatin(s.t)}${s.sp?', '+s.sp:''}) ${s.text}`})});
  }
  const budget=70000;let used=fixed.reduce((n,x)=>n+x.line.length,0);
  let keep=segs;
  if(used+segs.reduce((n,x)=>n+x.line.length,0)>budget){
    keep=[...segs].sort((a,b)=>b.score-a.score);const out=[];
    for(const s of keep){if(used+s.line.length>budget)break;out.push(s);used+=s.line.length}
    keep=out.sort((a,b)=>a.src.m===b.src.m?a.order-b.order:0);
  }
  const all=[...fixed,...keep];
  return {srcs:all.map(x=>x.src),text:all.map((x,i)=>`[${i+1}] ${x.line}`).join('\n'),meetings:ms.length};
}
function htmlToText(h){const d=document.createElement('div');d.innerHTML=h||'';return d.innerText||d.textContent||''}

/* ---------- light markdown ---------- */
function md(src,cite){
  const lines=String(src||'').split(/\r?\n/);let html='',list=null;
  const inline=s=>{let x=esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>');if(cite)x=cite(x);return x};
  const close=()=>{if(list){html+='</'+list+'>';list=null}};
  for(const raw of lines){
    const l=raw.trimEnd();
    let m;
    if(!l.trim()){close();continue}
    if((m=l.match(/^(#{1,3})\s+(.*)$/))){close();html+=`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`;continue}
    if((m=l.match(/^\s*[-*•]\s+(.*)$/))){if(list!=='ul'){close();html+='<ul>';list='ul'}html+='<li>'+inline(m[1])+'</li>';continue}
    if((m=l.match(/^\s*\d+[.)]\s+(.*)$/))){if(list!=='ol'){close();html+='<ol>';list='ol'}html+='<li>'+inline(m[1])+'</li>';continue}
    close();html+='<p>'+inline(l)+'</p>';
  }
  close();return html;
}
function htmlToMd(html){
  const d=document.createElement('div');d.innerHTML=html||'';
  const walk=(n,ctx)=>{
    if(n.nodeType===3)return n.textContent;
    const tag=n.tagName,kids=()=>[...n.childNodes].map(c=>walk(c,ctx)).join('');
    if(/^H[1-3]$/.test(tag))return'#'.repeat(+tag[1])+' '+kids().trim()+'\n\n';
    if(tag==='P'||tag==='DIV')return kids().trim()+'\n\n';
    if(tag==='UL')return[...n.children].map(li=>'- '+walk(li).trim()).join('\n')+'\n\n';
    if(tag==='OL')return[...n.children].map((li,i)=>(i+1)+'. '+walk(li).trim()).join('\n')+'\n\n';
    if(tag==='STRONG'||tag==='B')return'**'+kids()+'**';
    if(tag==='EM'||tag==='I')return'*'+kids()+'*';
    if(tag==='BR')return'\n';
    return kids();
  };
  return walk(d).replace(/\n{3,}/g,'\n\n').trim()+'\n';
}
async function saveFile(name,data){
  if(Store.dl){try{await Store.dl.save({filename:name,data});return}catch(e){if(e&&e.code==='declined')return}}
  try{await navigator.clipboard.writeText(typeof data==='string'?data:'');toast(t('copiedInstead'))}catch(e){toast(t('exportUnavailable'))}
}
async function copyText(s){try{await navigator.clipboard.writeText(s);toast(t('copied'))}catch(e){toast(t('copyFailed'))}}

/* ---------- icons ---------- */
const ICONS={
 home:'<path class="d" d="M5 10.5 12 5l7 5.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M3.5 11 12 4l8.5 7"/><path d="M6 9.5V19a1 1 0 0 0 1 1h3.5v-5h3v5H17a1 1 0 0 0 1-1V9.5"/>',
 mic:'<rect class="d" x="8.5" y="3" width="7" height="12" rx="3.5"/><rect x="8.5" y="3" width="7" height="12" rx="3.5"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
 folder:'<path class="d" d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7V17a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17z"/><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.2h7.5A2.5 2.5 0 0 1 21 9.7V17a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17z"/>',
 search:'<circle class="d" cx="10.5" cy="10.5" r="6.5"/><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>',
 tasks:'<rect class="d" x="3.5" y="3.5" width="17" height="17" rx="5"/><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="m8 12.2 2.8 2.8L16.5 9"/>',
 plug:'<path class="d" d="M7 8h10v3.5a5 5 0 0 1-10 0z"/><path d="M9 3.5V8M15 3.5V8M7 8h10v3.5a5 5 0 0 1-10 0zM12 16.5V21"/>',
 users:'<circle class="d" cx="9" cy="8" r="3.5"/><circle cx="9" cy="8" r="3.5"/><path d="M3 19.5a6 6 0 0 1 12 0M16 4.8a3.3 3.3 0 0 1 0 6.4M18.2 14a5.5 5.5 0 0 1 2.8 5.5"/>',
 gear:'<circle class="d" cx="12" cy="12" r="7"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/><circle cx="12" cy="12" r="3"/>',
 check:'<path d="M5 12.5 10 17.5 19 7"/>',
 upload:'<path class="d" d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3z"/><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 pause:'<rect class="d" x="6" y="5" width="4" height="14" rx="1.5"/><rect class="d" x="14" y="5" width="4" height="14" rx="1.5"/><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/>',
 play:'<path class="d" d="M7 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.8L8.5 4.6A1 1 0 0 0 7 5.5z"/><path d="M7 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.8L8.5 4.6A1 1 0 0 0 7 5.5z"/>',
 stop:'<rect class="d" x="6" y="6" width="12" height="12" rx="3"/><rect x="6" y="6" width="12" height="12" rx="3"/>',
 quote:'<path d="M4 12h.5M8 8.5v7M12 5v14M16 8.5v7M20 12h-.5"/>',
 trash:'<path class="d" d="M6.5 7h11l-.9 12.1a2 2 0 0 1-2 1.9H9.4a2 2 0 0 1-2-1.9z"/><path d="M4 7h16M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M6.5 7l.9 12.1a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9L17.5 7"/>',
 copy:'<rect class="d" x="8" y="8" width="12" height="12" rx="3"/><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
 download:'<path class="d" d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3z"/><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/>',
 spark:'<path class="d" d="M11 3.5l1.9 5.1L18 10.5l-5.1 1.9L11 17.5l-1.9-5.1L4 10.5l5.1-1.9z"/><path d="M11 3.5l1.9 5.1L18 10.5l-5.1 1.9L11 17.5l-1.9-5.1L4 10.5l5.1-1.9zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
 refresh:'<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9M19.5 4.5V9H15"/>',
 edit:'<path class="d" d="M5 19l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L9 18z"/><path d="M5 19l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L9 18zM13.5 7.5l3 3"/>',
 send:'<path class="d" d="M4.5 11.5 19.5 4.5l-5 15.5-3-6.5z"/><path d="M4.5 11.5 19.5 4.5l-5 15.5-3-6.5zM11.5 13.5l8-9"/>',
 globe:'<circle class="d" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/>',
 monitor:'<rect class="d" x="3" y="4" width="18" height="12" rx="2.5"/><rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8.5 20h7M12 16v4"/>',
 chrome:'<circle class="d" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.3"/><path d="M12 8.7h7.6M9.1 13.7 5.4 7.4M14.9 13.7 11 20.4"/>',
 file:'<path class="d" d="M6.5 3h7l4.5 4.5V19a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M6.5 3h7l4.5 4.5V19a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM13.5 3v4.5H18M8.5 13h6M8.5 16.5h4"/>',
 share:'<path class="d" d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6z"/><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6M12 3.5V15M8 7.5l4-4 4 4"/>',
 cal:'<rect class="d" x="4" y="5" width="16" height="15" rx="3"/><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 more:'<circle class="f" cx="5.5" cy="12" r="1.6"/><circle class="f" cx="12" cy="12" r="1.6"/><circle class="f" cx="18.5" cy="12" r="1.6"/>',
 chev:'<path d="m9.5 6 6 6-6 6"/>',
 filter:'<path d="M4 7h16M7 12h10M10 17h4"/>'
};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
const icS=n=>ic(n).replace('<svg','<svg width="14" height="14"');
const LOGO=`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADAAMADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6oACgKoCgcAAYAoopM18/cBaM0hNFK4C5pM0UlK4Ck0ZpKKVwCiiilcAoooouAUUUUXAKXNJRTuAtGaKSi4Ds0U2lp3AWlpuaXNO4BQwDKVYAgjBB6Giii4CZpKKKi4C0lFJmlcQtFJRSuAuaM02louAZozzRSUrhcWiims2KVwHUZpqtmnU7gGaXNNoouFx1FJRTuAtKKbzRTuAtFFFO4CigGkpadxiH3pM5opKzbELRSZopXAWkopKm4WFopM0lFwHZopuaM0rjFqC5k2jrUpOBWZfzckVE52RE5WRetnDCp6y9Pm5wTWkDkUQldChLmQ/NFNzRmruWOopM0Zp3AdRSZop3AWgGkpapMBc0dqSgU7gJRmkzSE1ncBTRmkpKm4C5oopKVxi0lFGaVxBR0pCcVDPMqL1qXKwm0hLqYIp5rFuZC7nmpLu43tjNUyc1zVJ3OOrU5tEWLaQowNbVrMHUVzoOKuWdwUYDNOnOwUqnLozeparwTK461NmulSudiaY4UUlAp3GLRmkpadwFzS02jNUmA6ikzS1SYWG0lBorK4BmjIpKRulS2AuaCarzOy8iqsl4VqHOxLmluaOQKa0ijvWS9+e1V5bt271DqoydaKNS4u1UHBrLublnJ5qu8jN3pmaxlUbMJ1XIcWyaTNUdR1XTdOTff31tbAf89JAD+XWsnSPGei6vrK6XpbzXUm1naRYyI0UdyTQoSaukY3OkzSq2KZS1NwLltclD1Nadvdqw5rAzzT0kZTnNXGbRtCq4nSrIrDrT8+9YEV2y9zUkurQ20fmXM8cKDq0jBR+taqrc6FWizczS5rhrz4keF7a4W2XUhd3DsEWK1QyMzE4AGOK7CGR3UEgqfQ9q1u+qLjUUtizmiminVSZYtANJS1SYCZpKTvRWbYBRSZoqGwGuoYYNUby2BBIFaFNYZFRLUmUVJHNzoUbFRZrX1C3yCQKyHBUkGueSszhqQ5WJmuQ+IUmr6g8Hh/w/cpBeSDzpmM/llYxxx35Pp6V12a89+J3hy/8AtaeK9CllF9aqDLGpySq/xKPbuO4rWhbnVzJmbY/CaeZxNrOubmPLCFC5P/AmruPCnhTSPDQlOnJM0swCySyvuYgdh6Cq3gPxVb+JtM3/ACx3sQAnh9D/AHh7GukzVVq1VtxkwQ7NFQW1zFcGYRNnyZDG/HRhjP8AOps1zjHUA02lzQBgeP8AUrjT/DzpYyrHfXTCC3LOEwx75PAwK4Oy+F/ifV5BNrOswpu5+aVp2/w/Wu38d+EU8WWkMf22S2ntyTEcbkJP94f1Fcz4S1PxL8Ptbt9I8UQySaPcOI4rjO9IyTgFW9PVTXfQk1T9x6jSu9djsPA/ws0XQNRg1N7i4vbuHJjMgCop9Qo7+nNeiooAx2pE4HGKdUubk7s9CEFBWQtFJmlBoTLFpc02lqkwuNNFJSZrNsBaTNBpKhsRDfzm2sLi5UBjFE7gHuQCcfpXlWhfHHSpkC6zpVzav3e3IkT8jg16zIiyRtG6hkYFWBGQQeorz7Wvg/4Pv5Gkt4rrTnbtbyZQf8BbNXTdP7ZnUU94lhPir4GnTnVXiJ7SW7j+lZl98RfBu4lNW3/7sL/4Vlz/AAKsCf3PiO6Udg9up/kaqT/BK2hGW8RTMPa2H+NU4Yd7yZzz9q1qi5P8TvC0f3JrqX/cgP8AWsu8+LemoP8AQ9LupT2Mjqg/rUtv8JtEjb/SNSv5sdlCp/jW3pvgPwpYEMmli4cfxXDl/wBOlTfDR7s59Tzho9YjhPxB0W0jsIWnYPbxEsAvQsR/dJyCO1aqfFy9MaqdFtzJ0yJmwT9MV6qscKwfZ1hjWHbt8sIAu30x0xXHX1v8P/D2t2sU+n2cN5cPlMgssfoxBOFGaar06uko37COM0/xvrXhrxDqMGpWayJNcNLNbk4KMe6n0xiuwsvil4bmUfaFvLZu4aLcPzBqe5/4QvxvqFxZSqk93a/L5qHY5HqrfxAGsm7+EukuxNrq95COweNXx+PFVJ0J/GrMDdX4i+EiM/2mw+sLf4U2T4keEk6X8r/7sDVzX/CoUzxr5x/17f8A16sW/wAIrHcPO1y5cf7EAH8zU8mG/mf9fIepr/8AC2PC8BykV/OR/diA/maq3fxTg8Ssnhyx8Ki6F84hC3UuRknG7CjjHXOe1beh/CPwjHh7pL28PpLNtH5Liu60Pw9oWiLjSdJtLQ/3o4xuP/AjzRehH4U2dNOnNrfQ04U8qFIs52KFz64GKkzTaKyudg4GlptGapMBwpabS1aYDaTNFFZNgFBNITSVDYhc0lGabmpcgHE1T1AZjNWSaq3x/dGpbJlsc9McOaj3UXLDzDUJeoPOluTbjWPrPhzRdY1C1vtQtBLNbH5TnAcdlcdwDzWlvo3VUZOLuhGdovhzRtHv7q+0+zEU1yfmPUIO6oOwJ5rY3VDupQ1EpOTuwJw1SwkFxVUNU1s3zj61I47nSWIxGKtVVsj+6FWQa0TPSjsOzRSZoqkxjqKbmnZq0wFBpabS5qkxiE02ikJrJsQtITSE00mocgFJpCabmmk1DkIcTVLUpNsRqyzcVlao5YbV5zU3Jm7IxZ2zIcURxux4Bq7bWRc5Yda04LREHShyOWNFy1Zjx2cjdjUy2DHtW0qKO1OwPSp5zVUUYZsH9Kiezde1dDgUjIp7Uc4OijmWjZTyDSwNhxmt2a1RgeKzrizKHKiqUkZSouOqNjT3BjFXQax9McqNprUVqdzqg9CUGnZqIGnA1SkWSZoFMB96dVpgOBpabmlzVpgNJpGNNJppNYtgKTTSaQmmMazchClqaTTS3vTSahsQrtxVQxb3yanJzSZqeYT1FRQowBTs0zdTd3vU8wEu6k3VHupN1LmAmDUZqLdRuo5hk2aa6hhimBqUNVKQiNYtr5FWozwOajzSg1XMC0Jw1OBqEGng1SkUSg08GoQaeDWiYEmaUGmA0oNaJgMJphPNDGo2NYtgKWphNITzTWasmxXFJpjNTWNNJzUOQhxNNLGmlqaWrNyAfmk3VGWppap5hEu6jdUO6jdS5gJt1KGqHdQGp8wXJw1KGqEGlDU1ILk4alDVCGp4arUhkymng1ADT1arTGTA1IDUANPVq0TAnBpQajU08GtExkLGoyaNwYBgQQRkEHIIpjGsWxAx5qNjSsaiY1k2IUmmFqQmmM1ZuQrji1MZqaWphas2wHlqQtUZam7qlyES7qN1Q7vejdS5gJt1KGqDdShqfMBOG5pwaoA1ODVSkBYDU4NUAanqatMZOGp4NQBqeDVpjuTqakBqBTUimtExk4NPU8VApqQMApZiAAMknoK1TGf/2Q==`;
const PLATFORMS=['meet','zoom','teams','inperson','other'];
const PIPE=['queued','transcribing','analyzing','indexing','completed'];

/* ---------- small renderers ---------- */
const statusBadge=s=>{const cls={completed:'ok',failed:'fail',queued:'work',transcribing:'work',analyzing:'work',indexing:'work'}[s]||'';return`<span class="badge ${cls}">${['queued','transcribing','analyzing','indexing'].includes(s)?'<span class="dot"></span>':''}${t('st_'+s)}</span>`};
const sampleBadge=x=>x&&x.sample?`<span class="badge sample">${t('sample')}</span>`:'';
function srcChip(mid,sid,tab){
  const m=M(mid);if(!m)return'';const sg=sid?segOf(m,sid):null;
  return`<button class="src" data-act="src" data-m="${esc(mid)}" data-s="${esc(sid||'')}" data-tab="${esc(tab||'transcript')}" title="${esc(t('openSource'))}">${ic('quote')}${sg?fmtTs(sg.t):esc(t('source'))}</button>`;
}
const refChips=(mid,refs)=>(refs||[]).slice(0,4).map(r=>srcChip(mid,r)).join('');
const person=n=>n?`<span class="person"><span class="avatar">${esc(initials(n))}</span>${esc(n)}</span>`:'';
function empty(title,body,btn){return`<div class="empty"><img class="mark" src="${LOGO}" alt=""><h3>${esc(title)}</h3>${body?`<p>${esc(body)}</p>`:''}${btn||''}</div>`}
function aiSetup(){return AI.ok()?'':`<div class="setup">${ic('spark')}<div><b>${t('aiOffTitle')}</b>${t('aiOffBody')}</div></div>`}
function projectSelect(attrs,val,withNone=true){return`<select class="select" ${attrs}>${withNone?`<option value="">${t('noProject')}</option>`:''}${S.projects.filter(p=>!p.archived||p.id===val).map(p=>`<option value="${p.id}" ${p.id===val?'selected':''}>${esc(p.name)}</option>`).join('')}</select>`}
const platSelect=(attrs,val)=>`<select class="select" ${attrs}>${PLATFORMS.map(k=>`<option value="${k}" ${val===k?'selected':''}>${t('pf_'+k)}</option>`).join('')}</select>`;
const TSTAT=['open','in_progress','completed','cancelled'];
function taskItem(tk,opt={}){
  const m=M(tk.meetingId),p=P(tk.projectId);
  return`<div class="item ${isDone(tk)?'done':''} ${tk.review?'unconf':''}">
   <button class="check" role="checkbox" aria-checked="${tk.status==='completed'}" aria-label="${esc(t('markDone'))}" data-act="toggleTask" data-id="${tk.id}">${tk.status==='completed'?ic('check'):''}</button>
   <div class="body"><div class="title">${esc(tk.title)}</div>${tk.description?`<div class="desc">${esc(tk.description)}</div>`:''}
    <div class="meta">${tk.owner?person(tk.owner)+(tk.ownerState==='ai'?`<span class="badge warn">${t('aiSuggested')}</span><button class="btn sm ghost" data-act="confirmOwner" data-id="${tk.id}">${t('confirm')}</button>`:''):`<span class="badge">${t('unassigned')}</span>`}
     ${tk.due?`<span class="badge ${isOverdue(tk)?'fail':''}">${isOverdue(tk)?t('overdue')+' · ':''}${fmtDate(tk.due)}</span>`:tk.dueText?`<span class="badge">${esc(tk.dueText)}</span>`:''}
     <select class="select sm" data-ch="taskStatus" data-id="${tk.id}" aria-label="${esc(t('status'))}">${TSTAT.map(s=>`<option value="${s}" ${tk.status===s?'selected':''}>${t('ts_'+s)}</option>`).join('')}</select>
     ${tk.confidence==='low'?`<span class="badge warn">${t('lowConfidence')}</span>`:''}
     ${m?refChips(m.id,tk.refs):''}
     ${opt.showMeeting&&m?`<button class="btn sm ghost" data-act="openMeeting" data-id="${m.id}">${esc(m.title)}</button>`:''}
     ${opt.showProject&&p?`<span class="tag">${esc(p.name)}</span>`:''}</div>
    ${tk.review?`<div class="meta"><span class="small muted">${t('needsReview')}</span><button class="btn sm" data-act="approveTask" data-id="${tk.id}">${ic('check')}${t('approve')}</button><button class="btn sm ghost" data-act="dismissTask" data-id="${tk.id}">${t('dismiss')}</button></div>`:''}</div>
   <button class="btn sm ghost" data-act="editTask" data-id="${tk.id}" aria-label="${esc(t('edit'))}">${ic('edit')}</button></div>`;
}
const DSTAT=['review','confirmed','unresolved','rejected'];
function decisionItem(d,m,opt={}){
  return`<div class="item ${d.status==='review'?'unconf':''} ${d.status==='rejected'?'done':''}"><div class="body">
   <div class="title">${esc(d.title)}</div>${d.description?`<div class="desc">${esc(d.description)}</div>`:''}
   <div class="meta">${opt.edit?`<select class="select sm" data-ch="decStatus" data-m="${m.id}" data-id="${d.id}" aria-label="${esc(t('status'))}">${DSTAT.map(s=>`<option value="${s}" ${d.status===s?'selected':''}>${t('ds_'+s)}</option>`).join('')}</select>`:`<span class="badge ${d.status==='confirmed'?'ok':d.status==='review'?'warn':''}">${t('ds_'+d.status)}</span>`}
   ${d.manual?`<span class="badge">${t('addedManually')}</span>`:''}${refChips(m.id,d.refs)}
   ${opt.showMeeting?`<button class="btn sm ghost" data-act="openMeeting" data-id="${m.id}">${esc(m.title)} — ${fmtDate(m.date)}</button>`:''}</div></div>
   ${opt.edit?`<button class="btn sm ghost" data-act="editDecision" data-m="${m.id}" data-id="${d.id}" aria-label="${esc(t('edit'))}">${ic('edit')}</button>`:''}</div>`;
}
function meetingRow(m){
  const p=P(m.projectId);
  return`<li><button class="row-btn" data-act="openMeeting" data-id="${m.id}"><span class="tile">${ic('mic')}</span><span class="row-main"><span class="row-title">${esc(m.title)}</span><span class="row-meta">${fmtDateTime(m.date)}${m.duration?' — '+fmtDur(m.duration):''} — ${t('pf_'+(m.platform||'other'))}${p?' — '+esc(p.name):''}</span></span>${(m.tags||[]).slice(0,2).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}${sampleBadge(m)}${statusBadge(m.status)}<span class="chev">${ic('chev')}</span></button></li>`;
}
function projectRow(p){const n=S.meetings.filter(m=>m.projectId===p.id).length,o=liveTasks().filter(x=>x.projectId===p.id&&!isDone(x)).length;
  return`<li><button class="row-btn" data-act="openProject" data-id="${p.id}"><span class="tile">${ic('folder')}</span><span class="row-main"><span class="row-title">${esc(p.name)}</span><span class="row-meta">${t('nMeetings',{n:fmtNum(n)})} — ${t('nOpenTasks',{n:fmtNum(o)})}</span></span>${p.archived?`<span class="badge">${t('archived')}</span>`:''}${sampleBadge(p)}<span class="chev">${ic('chev')}</span></button></li>`}

/* ---------- shell ---------- */
const NAV=[['dashboard','home'],['meetings','mic'],['search','search'],['projects','folder'],['tasks','tasks'],['integrations','plug'],['team','users'],['settings','gear']];
const routeRoot={meeting:'meetings',record:'meetings',project:'projects'};
function sidebar(){
  const cur=routeRoot[UI.route]||UI.route,open=liveTasks().filter(x=>!isDone(x)).length;
  return`<aside class="side ${UI.menu?'open':''}" aria-label="${esc(t('mainNav'))}">
   <div class="brand"><img src="${LOGO}" alt="كيكـ"><div><b>KEEK</b><small>${esc(S.settings.wsName||t('myWorkspace'))}</small></div></div>
   <nav class="nav">${NAV.map(([k,i])=>`<button data-act="nav" data-to="${k}" ${cur===k?'aria-current="page"':''}>${ic(i)}<span>${t('nav_'+k)}</span>${k==='tasks'&&open?`<span class="count num">${fmtNum(open)}</span>`:''}</button>`).join('')}</nav>
   ${REC.active()?`<button class="rec-pill" data-act="nav" data-to="record"><span class="dot"></span><span class="row-main"><span class="row-title">${t('recordingNow')}</span><span class="row-meta num" id="sideTimer">${fmtTs(REC.elapsed())}</span></span></button>`:''}
   <div class="side-foot"><button class="btn sm" data-act="setLang" data-lang="${S.settings.lang==='ar'?'en':'ar'}">${ic('globe')}${S.settings.lang==='ar'?'English':'العربية'}</button>
   <span class="tiny muted" id="saveState" aria-live="polite">${t('save_'+Store.status)}</span></div></aside>`;
}
let lastRoute='';
function tabbar(){
  const cur=routeRoot[UI.route]||UI.route,main=['dashboard','meetings','search','tasks'];
  return`<nav class="tabbar" aria-label="${esc(t('mainNav'))}">${main.map(k=>{const i=NAV.find(n=>n[0]===k)[1];return`<button data-act="nav" data-to="${k}" ${cur===k?'aria-current="page"':''}>${ic(i)}<span>${t('nav_'+k)}</span></button>`}).join('')}<button data-act="menu" ${!main.includes(cur)?'aria-current="page"':''}>${ic('more')}<span>${t('more')}</span></button></nav>`;
}
function render(){
  const root=$('#root'),lang=S?S.settings.lang:UI.onb.lang;
  document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  const th=S?.settings.theme;if(th&&th!=='system')document.documentElement.dataset.theme=th;else delete document.documentElement.dataset.theme;
  if(!UI.ready){root.innerHTML=`<div class="onb"><div class="onb-card" style="align-items:center"><img class="onb-logo" src="${LOGO}" alt="كيكـ"><div class="sk" style="width:200px"></div></div></div>`;return}
  if(!S){root.innerHTML=onboarding()+modalHtml();return}
  const ae=document.activeElement,focusId=ae&&ae.id&&(ae.tagName==='TEXTAREA'||ae.tagName==='INPUT')?ae.id:null,sel=focusId?[ae.selectionStart,ae.selectionEnd]:null;
  const audio=$('#player'),aState=audio?{t:audio.currentTime,p:!audio.paused,src:audio.getAttribute('src')}:null;
  const same=lastRoute===UI.route+JSON.stringify(UI.params),sc=id=>{const e=document.getElementById(id);return e?e.scrollTop:0};
  const keep=same?sc('main'):0,keepD=same?sc('splitDetail'):0,keepL=['meetings','meeting'].includes(UI.route)?sc('splitList'):0;
  const view=(VIEWS[UI.route]||VIEWS.dashboard)(),split=['meetings','meeting'].includes(UI.route);
  root.innerHTML=`<div class="app">${sidebar()}${UI.menu?'<div class="side-scrim" data-act="menu"></div>':''}<div class="main" id="main"><main class="page ${split?'page-split':''}">${view}</main></div>${tabbar()}</div>${modalHtml()}`;
  $('#main').scrollTop=keep;const d=$('#splitDetail');if(d)d.scrollTop=keepD;const l=$('#splitList');if(l)l.scrollTop=keepL;lastRoute=UI.route+JSON.stringify(UI.params);
  const na=$('#player');if(na&&aState&&aState.src===na.getAttribute('src')){na.currentTime=aState.t;if(aState.p)na.play().catch(()=>{})}
  if(focusId){const el=document.getElementById(focusId);if(el){el.focus();try{el.setSelectionRange(sel[0],sel[1])}catch(e){}}}
  AFTER.splice(0).forEach(f=>{try{f()}catch(e){console.error(e)}});
}
const AFTER=[];
function go(route,params={},tab){UI.route=route;UI.params=params;UI.tab=tab||'overview';UI.q='';UI.menu=false;render();$('#main')&&($('#main').scrollTop=0)}

/* ---------- onboarding (web part of PRD 9.1) ---------- */
function onboarding(){
  const o=UI.onb,steps=`<div class="steps">${[0,1,2,3].map(i=>`<i class="${i<=o.step?'on':''}"></i>`).join('')}</div>`;
  let body='';
  if(o.step===0)body=`<img class="onb-logo" src="${LOGO}" alt="كيكـ"><div><h1>${t('onbWelcome')}</h1><p class="muted" style="margin-top:6px">${t('tagline')}</p></div>
   <label class="field"><span>${t('chooseLang')}</span></label><div class="choice"><button data-act="onbLang" data-v="ar" aria-pressed="${o.lang==='ar'}"><b>العربية</b><span class="small muted">واجهة من اليمين لليسار</span></button><button data-act="onbLang" data-v="en" aria-pressed="${o.lang==='en'}"><b>English</b><span class="small muted">Left-to-right interface</span></button></div>`;
  if(o.step===1)body=`<div><h2>${t('onbWorkspace')}</h2><p class="muted" style="margin-top:4px">${t('onbWorkspaceHint')}</p></div><label class="field"><span>${t('yourName')}</span><input class="input" id="onbName" data-in="onbName" value="${esc(o.name)}" placeholder="${esc(t('namePh'))}"></label>
   <div class="choice"><button data-act="onbKind" data-v="personal" aria-pressed="${o.kind==='personal'}"><b>${t('wsPersonal')}</b><span class="small muted">${t('wsPersonalHint')}</span></button><button data-act="onbKind" data-v="team" aria-pressed="${o.kind==='team'}"><b>${t('wsTeam')}</b><span class="small muted">${t('wsTeamHint')}</span></button></div>
   ${o.kind==='team'?`<p class="note">${t('teamNote')}</p>`:''}`;
  if(o.step===2)body=`<div><h2>${t('onbDesktop')}</h2><p class="muted" style="margin-top:4px">${t('onbDesktopHint')}</p></div>
   <div class="option" aria-disabled="true">${ic('monitor')}<div><b>${t('desktopApp')}</b><span class="small muted">${t('desktopStatusDev')}</span></div></div>
   <p class="note">${t('onbDesktopNote')}</p>`;
  if(o.step===3)body=`<div><h2>${t('onbStart')}</h2><p class="muted" style="margin-top:4px">${t('onbStartHint')}</p></div><div class="choice"><button data-act="onbFinish" data-v="empty"><b>${t('startEmpty')}</b><span class="small muted">${t('startEmptyHint')}</span></button><button data-act="onbFinish" data-v="sample"><b>${t('startSample')}</b><span class="small muted">${t('startSampleHint')}</span></button></div>`;
  return`<div class="onb"><div class="onb-card">${steps}${body}<div style="display:flex;justify-content:space-between;gap:8px">${o.step?`<button class="btn ghost" data-act="onbBack">${t('back')}</button>`:'<span></span>'}${o.step<3?`<button class="btn primary" data-act="onbNext">${t('continue')}</button>`:''}</div>${Store.mode!=='db'?`<p class="note">${t('storeLocal_'+Store.mode)}</p>`:''}</div></div>`;
}

/* ---------- dashboard ---------- */
const VIEWS={},LISTS={};
VIEWS.dashboard=()=>{
  const h=new Date().getHours(),name=S.settings.myName;
  const recent=[...S.meetings].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,5);
  const open=liveTasks().filter(x=>!isDone(x)).sort((a,b)=>(isOverdue(b)-isOverdue(a))||((a.due||'9')>(b.due||'9')?1:-1));
  const decs=allDecisions().filter(d=>d.status!=='rejected').sort((a,b)=>(b.meeting.date||'').localeCompare(a.meeting.date||'')).slice(0,4);
  const since=new Date(Date.now()-30*864e5).toISOString().slice(0,16);
  const stats=[[S.meetings.filter(m=>(m.date||'')>=since).length,t('statMeetings')],[open.length,t('statOpen')],[open.filter(isOverdue).length,t('statOverdue')],[allDecisions().filter(d=>d.status==='review').length+liveTasks().filter(x=>x.review).length,t('statReview')]];
  return`<div class="hero"><div><h1>${t(h<12?'goodMorning':'goodEvening')}${name?t('comma')+esc(name.split(' ')[0]):''}</h1><p class="muted">${fmtDate(todayISO(),{weekday:'long',day:'numeric',month:'long'})}</p></div>
   <div class="hero-actions"><button class="rec-cta" data-act="newMeeting"><span class="ring"></span>${t('quickRecord')}</button></div></div>
  <div class="askbar">${ic('search')}<input id="dashAsk" placeholder="${esc(t('askHomePh'))}" aria-label="${esc(t('askHomePh'))}"><button class="btn primary sm" data-act="dashAsk" aria-label="${esc(t('search'))}">${ic('send')}</button></div>
  <div class="strip">${stats.map(([n,l])=>`<div><b>${fmtNum(n)}</b><span>${l}</span></div>`).join('')}</div>
  ${!S.meetings.length?`<div class="panel">${empty(t('noMeetingsTitle'),t('noMeetingsBody'),`<div class="hero-actions"><button class="btn primary" data-act="newMeeting">${ic('mic')}${t('newMeeting')}</button><button class="btn" data-act="loadSample">${t('loadSample')}</button></div>`)}</div>`:
  `<div class="cols"><div class="stack">
    <section class="panel"><div class="panel-head"><h3>${t('recentMeetings')}</h3><button class="btn sm ghost" data-act="nav" data-to="meetings">${t('viewAll')}</button></div><ul class="rows">${recent.map(meetingRow).join('')}</ul></section>
    <section class="panel"><div class="panel-head"><h3>${t('recentDecisions')}</h3></div>${decs.map(d=>decisionItem(d,d.meeting,{showMeeting:true})).join('')||`<p class="row-pad muted">${t('noDecisions')}</p>`}</section>
   </div><div class="stack">
    <section class="panel"><div class="panel-head"><h3>${t('upcoming')}</h3></div><div class="panel-body stack" style="gap:10px"><p class="small muted">${t('upcomingOff')}</p><button class="btn sm" data-act="nav" data-to="integrations" style="align-self:flex-start">${ic('cal')}${t('viewIntegrations')}</button></div></section>
    <section class="panel"><div class="panel-head"><h3>${t('openItems')}</h3><button class="btn sm ghost" data-act="nav" data-to="tasks">${t('viewAll')}</button></div>${open.slice(0,4).map(x=>taskItem(x,{showMeeting:true})).join('')||`<p class="row-pad muted">${t('noOpenTasks')}</p>`}</section>
   </div></div>`}`;
};

/* ---------- meetings ---------- */
VIEWS.meetings=()=>`<div class="split"><div class="split-list" id="splitList">${meetingsColumn()}</div><div class="split-detail split-empty" id="splitDetail">${empty(t('selectMeeting'),t('selectMeetingBody'))}</div></div>`;
function meetingsColumn(){
  const f=UI.filters,tags=[...new Set(S.meetings.flatMap(m=>m.tags||[]))],n=['mp','ms','mf','mt'].filter(k=>f[k]).length;
  return`<div class="col-head"><h1>${t('nav_meetings')}</h1><button class="btn icon primary" data-act="newMeeting" aria-label="${esc(t('newMeeting'))}" title="${esc(t('newMeeting'))}">${ic('plus')}</button></div>
  <div class="searchfield">${ic('search')}<input id="mq" type="search" data-in="mq" value="${esc(UI.mq||'')}" placeholder="${esc(t('searchMeetings'))}" aria-label="${esc(t('searchMeetings'))}"></div>
  <div class="filterbar"><button class="chipbtn ${n?'on':''}" data-act="toggleFilters" aria-expanded="${!!UI.showFilters}">${ic('filter')}${t('filters')}${n?` · ${fmtNum(n)}`:''}</button>
   <select class="select sm" data-ch="filter" data-k="mo" aria-label="${esc(t('sort'))}"><option value="new">${t('newest')}</option><option value="old" ${f.mo==='old'?'selected':''}>${t('oldest')}</option></select></div>
  ${UI.showFilters?`<div class="filters">
   <select class="select" data-ch="filter" data-k="mp" aria-label="${esc(t('project'))}"><option value="">${t('allProjects')}</option>${S.projects.map(p=>`<option value="${p.id}" ${f.mp===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
   <select class="select" data-ch="filter" data-k="ms" aria-label="${esc(t('status'))}"><option value="">${t('allStatuses')}</option>${['completed','analyzing','failed'].map(x=>`<option value="${x}" ${f.ms===x?'selected':''}>${t('st_'+x)}</option>`).join('')}</select>
   <select class="select" data-ch="filter" data-k="mf" aria-label="${esc(t('platform'))}"><option value="">${t('allPlatforms')}</option>${PLATFORMS.map(k=>`<option value="${k}" ${f.mf===k?'selected':''}>${t('pf_'+k)}</option>`).join('')}</select>
   ${tags.length?`<select class="select" data-ch="filter" data-k="mt" aria-label="${esc(t('tags'))}"><option value="">${t('allTags')}</option>${tags.map(x=>`<option value="${esc(x)}" ${f.mt===x?'selected':''}>${esc(x)}</option>`).join('')}</select>`:''}</div>`:''}
  <div id="mlist">${LISTS.mcol()}</div>`;
}
LISTS.mcol=()=>{
  const q=norm(UI.mq),f=UI.filters,working=s=>['queued','transcribing','analyzing','indexing'].includes(s);
  if(!S.meetings.length)return empty(t('noMeetingsTitle'),t('noMeetingsBody'),`<button class="btn primary" data-act="newMeeting">${ic('mic')}${t('newMeeting')}</button>`);
  const list=S.meetings.filter(m=>(!f.mp||m.projectId===f.mp)&&(!f.ms||m.status===f.ms||(f.ms==='analyzing'&&working(m.status)))&&(!f.mf||m.platform===f.mf)&&(!f.mt||(m.tags||[]).includes(f.mt))&&(!q||norm(m.title+' '+(m.participants||[]).join(' ')+' '+(m.tags||[]).join(' ')+' '+(m.report?.overview||'')).includes(q)))
   .sort((a,b)=>f.mo==='old'?(a.date||'').localeCompare(b.date||''):(b.date||'').localeCompare(a.date||''));
  if(!list.length)return`<p class="row-pad muted">${t('noMatches')}</p>`;
  const day=iso=>{const d=new Date((iso||'').slice(0,10)+'T12:00'),n=new Date(todayISO()+'T12:00'),x=Math.round((n-d)/864e5);return x<=0?'today':x===1?'yesterday':x<7?'thisWeek':'earlier'};
  let last='',out='';
  for(const m of list){const g=f.mo==='old'?'':day(m.date);if(g&&g!==last){out+=`<div class="daylbl">${t(g)}</div>`;last=g}
    const p=P(m.projectId),sel=UI.route==='meeting'&&UI.params.id===m.id;
    out+=`<button class="cell" data-act="openMeeting" data-id="${m.id}" ${sel?'aria-current="true"':''}><div class="cell-top"><b>${esc(m.title)}</b><span>${fmtDate(m.date,{day:'numeric',month:'short'})}</span></div>
     <div class="cell-sub">${t('pf_'+(m.platform||'other'))}${p?' · '+esc(p.name):''}${m.duration?' · '+fmtDur(m.duration):''}</div>
     ${m.report?.overview?`<div class="cell-prev">${esc(m.report.overview)}</div>`:''}
     ${m.status!=='completed'?`<div class="cell-tags">${statusBadge(m.status)}</div>`:''}</button>`}
  return out;
};

/* ---------- browser recording (interim until the desktop app ships) ---------- */
const REC={state:'idle',segs:[],interim:'',acc:0,startAt:0,urls:{},
  active(){return['recording','paused','starting'].includes(this.state)},
  elapsed(){return this.acc+(this.state==='recording'?Date.now()-this.startAt:0)},
  srSupported(){return!!(window.SpeechRecognition||window.webkitSpeechRecognition)}};
VIEWS.record=()=>{
  const f=REC.form||(REC.form={title:'',date:nowLocal(),projectId:'',platform:'inperson',participants:'',tags:'',lang:S.settings.lang==='en'?'en-US':'ar-EG',consent:false});
  const st=REC.state;
  let main;
  if(st==='stopped')main=`<section class="panel"><div class="panel-head"><h3>${t('reviewRecording')}</h3><span class="badge">${fmtTs(REC.acc)}</span></div><div class="panel-body stack" style="gap:14px">
    ${REC.url?`<audio controls src="${REC.url}" style="width:100%"></audio><p class="tiny muted">${t('audioLocalNote')}</p>`:''}
    <label class="field"><span>${t('liveTranscript')} (${fmtNum(REC.segs.length)})</span><textarea class="input" id="recText" data-in="recText" style="min-height:220px">${esc(REC.text||'')}</textarea></label>
    ${!REC.segs.length?`<p class="note">${t('noLiveText')}</p>`:''}
    <div class="hero-actions"><button class="btn primary" data-act="recSave">${ic('spark')}${t('saveProcess')}</button><button class="btn danger" data-act="recDiscard">${t('discard')}</button></div></div></section>`;
  else main=`<section class="recorder" aria-label="${esc(t('recorder'))}">
   <div class="glow"><svg id="recGlow" viewBox="0 0 100 100"><polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="#B7E57D"/></svg></div>
   <div class="rec-state ${st==='recording'?'live':''}" aria-live="polite"><span class="dot"></span>${t('rs_'+st)}</div>
   <div class="timer" id="recTimer">${fmtTs(REC.elapsed())}</div>
   <div class="meter" id="recMeter" aria-hidden="true">${Array.from({length:28},()=>'<i></i>').join('')}</div>
   ${KEEKX.captureNote(f)}
   ${REC.err?`<div class="setup" style="position:relative;max-width:560px">${ic('mic')}<div><b>${t('micProblem')}</b>${esc(REC.err)}</div></div>`:''}
   ${st==='idle'?KEEKX.sourcePicker(f):''}
   ${st==='idle'?`<label class="consent"><input type="checkbox" data-ch="consent" ${f.consent?'checked':''}><span>${t('consentText')}</span></label>`:''}
   <div class="rec-controls">
    ${st==='idle'?`<button class="btn primary" data-act="recStart" ${f.consent?'':'disabled'}>${ic('mic')}${t('startRecording')}</button>`:''}
    ${st==='starting'?`<button class="btn" disabled>${t('rs_starting')}</button>`:''}
    ${st==='recording'?`<button class="btn" data-act="recPause">${ic('pause')}${t('pause')}</button>`:''}
    ${st==='paused'?`<button class="btn" data-act="recResume">${ic('play')}${t('resume')}</button>`:''}
    ${st==='recording'||st==='paused'?`<button class="btn primary" data-act="recStop">${ic('stop')}${t('stop')}</button>`:''}</div>
   ${st==='idle'?`<label class="field" style="position:relative;width:min(320px,100%)"><span>${t('spokenLang')}</span><select class="select" data-ch="recForm" data-k="lang"><option value="ar-EG" ${f.lang==='ar-EG'?'selected':''}>${t('langArEG')}</option><option value="ar-SA" ${f.lang==='ar-SA'?'selected':''}>${t('langAr')}</option><option value="en-US" ${f.lang==='en-US'?'selected':''}>English</option>${KEEKX.autoLangOption(f)}</select></label>`:''}
   ${!REC.srSupported()?`<p class="note" style="position:relative;max-width:560px">${t('srUnsupported')}</p>`:''}
   ${REC.srErr?`<p class="note" style="position:relative">${esc(REC.srErr)}</p>`:''}
   ${REC.active()?`<div class="live-text" id="liveText" aria-live="polite">${liveHtml()}</div>`:''}</section>`;
  return`<div class="crumb"><button data-act="nav" data-to="meetings">${t('nav_meetings')}</button></div>
  <div class="page-head"><div><h1>${t('browserRecording')}</h1><p>${t('browserRecordingSub')}</p></div></div>
  <div class="cols"><div class="stack">${main}</div>${metaForm(f,'recForm')}</div>`;
};
const liveHtml=()=>REC.segs.length||REC.interim?REC.segs.map(s=>`<div><span class="tiny muted num">${fmtTs(s.t)}</span> ${esc(s.text)}</div>`).join('')+(REC.interim?`<div class="interim">${esc(REC.interim)}</div>`:''):`<span class="muted">${t('listening')}</span>`;
function metaForm(f,ch){
  return`<section class="panel"><div class="panel-head"><h3>${t('meetingDetails')}</h3></div><div class="panel-body stack" style="gap:14px">
   <label class="field"><span>${t('title')}</span><input class="input" id="${ch}-title" data-in="${ch}" data-k="title" value="${esc(f.title)}" placeholder="${esc(t('titlePh'))}"></label>
   <div class="grid2"><label class="field"><span>${t('date')}</span><input class="input" type="datetime-local" data-in="${ch}" data-k="date" value="${esc(f.date)}"></label><label class="field"><span>${t('platform')}</span>${platSelect(`data-ch="${ch}" data-k="platform"`,f.platform)}</label></div>
   <label class="field"><span>${t('project')}</span>${projectSelect(`data-ch="${ch}" data-k="projectId"`,f.projectId)}</label>
   <label class="field"><span>${t('participants')}</span><input class="input" id="${ch}-part" data-in="${ch}" data-k="participants" value="${esc(f.participants)}" placeholder="${esc(t('participantsPh'))}"></label>
   <label class="field"><span>${t('tags')}</span><input class="input" id="${ch}-tags" data-in="${ch}" data-k="tags" value="${esc(f.tags)}" placeholder="${esc(t('tagsPh'))}"></label></div></section>`;
}

/* ---------- meeting details ---------- */
const MTABS=['overview','summary','transcript','decisions','actions','participants'];
function pipeline(m){
  if(m.status==='failed')return`<div class="pipeline"><span class="fail">${t('st_failed')}</span></div>`;
  const idx=PIPE.indexOf(m.status);if(idx<0)return'';
  return`<div class="pipeline" aria-label="${esc(t('processing'))}">${PIPE.map((s,i)=>{const skip=s==='transcribing'&&m.source!=='desktop';return`<span class="${skip?'skip':i<idx||m.status==='completed'?'done':i===idx?'now':''}" ${skip?`title="${esc(t('skippedImport'))}"`:''}>${t('st_'+s)}</span>`}).join('')}</div>`;
}
VIEWS.meeting=()=>`<div class="split"><div class="split-list hide-narrow" id="splitList">${meetingsColumn()}</div><div class="split-detail" id="splitDetail"><div class="detail-inner">${meetingDetail()}</div></div></div>`;
function meetingDetail(){
  const m=M(UI.params.id);if(!m)return empty(t('notFound'),'',`<button class="btn" data-act="nav" data-to="meetings">${t('nav_meetings')}</button>`);
  const tab=MTABS.includes(UI.tab)?UI.tab:'overview',tasks=liveTasks().filter(x=>x.meetingId===m.id),url=REC.urls[m.id];
  const end=m.duration&&m.date?new Date(new Date(m.date).getTime()+m.duration).toISOString():null;
  return`<div class="crumb"><button data-act="nav" data-to="meetings">${t('nav_meetings')}</button></div>
   <div class="page-head"><div style="flex:1;min-width:260px"><h1 contenteditable="true" data-edit="meetingTitle" data-id="${m.id}" spellcheck="false">${esc(m.title)}</h1>
   <p>${fmtDateTime(m.date)}${end?' – '+fmtDate(end,{hour:'numeric',minute:'2-digit'}):''}${m.duration?' — '+fmtDur(m.duration):''} — ${t('pf_'+(m.platform||'other'))} — ${t('src_'+(m.source||'import'))} ${sampleBadge(m)}</p>
   ${(m.tags||[]).length?`<div class="chips" style="margin-top:8px">${m.tags.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`:''}</div>
   <div class="hero-actions"><button class="btn" data-act="editMeeting" data-id="${m.id}">${ic('edit')}${t('edit')}</button><button class="btn" data-act="exportModal" data-id="${m.id}">${ic('download')}${t('export')}</button><button class="btn" data-act="shareModal" data-id="${m.id}">${ic('share')}${t('share')}</button><button class="btn ghost" data-act="deleteMeeting" data-id="${m.id}" aria-label="${esc(t('delete'))}">${ic('trash')}</button></div></div>
   ${pipeline(m)}
   ${m.status==='failed'?`<div class="setup" style="margin-bottom:16px">${ic('refresh')}<div><b>${t('processFailed')}</b>${esc(m.error||'')}<div style="margin-top:8px"><button class="btn sm" data-act="reprocess" data-id="${m.id}">${t('retry')}</button></div></div></div>`:''}
   <div class="player">${url?`<audio id="player" controls src="${url}"></audio>`:`<div class="small muted" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${t('noAudio')}<button class="btn sm" data-act="attachAudio" data-id="${m.id}">${ic('upload')}${t('attachAudio')}</button></div>`}</div>
   <div class="tabs" role="tablist">${MTABS.map(k=>`<button role="tab" aria-selected="${tab===k}" data-act="tab" data-v="${k}">${t('mt_'+k)}${k==='decisions'&&m.report?.decisions.length?' '+fmtNum(m.report.decisions.length):''}${k==='actions'&&tasks.length?' '+fmtNum(tasks.length):''}</button>`).join('')}</div>
   ${MEETING_TABS[tab](m,tasks)}`;
}
const skel=()=>`<div class="panel"><div class="panel-body"><div class="sk"></div><div class="sk" style="width:85%"></div><div class="sk" style="width:70%"></div></div></div>`;
const noReport=m=>['queued','analyzing','indexing','transcribing'].includes(m.status)?skel():`<div class="panel">${empty(t('noReportYet'),t('noReportBody'),m.transcript?.length&&AI.ok()?`<button class="btn primary" data-act="reprocess" data-id="${m.id}">${ic('spark')}${t('processNow')}</button>`:'')}</div>${aiSetup()}`;
const regenBtn=(m,k)=>AI.ok()&&m.transcript?.length?`<button class="btn sm ghost" data-act="regenSection" data-id="${m.id}" data-k="${k}" ${UI.busy['rg'+m.id+k]?'disabled':''}>${ic('refresh')}${UI.busy['rg'+m.id+k]?t('regenerating'):t('regenerate')}</button>`:'';
const MEETING_TABS={
 overview(m,tasks){
  const r=m.report;if(!r)return noReport(m);
  const openT=tasks.filter(x=>!isDone(x));
  return`<div class="strip">${[[r.decisions.length,t('decisions')],[openT.length,t('openItems')],[r.questions.length,t('openQuestions')],[(r.risks||[]).length,t('risks')]].map(([n,l])=>`<div><b>${fmtNum(n)}</b><span>${l}</span></div>`).join('')}</div>
  <div class="cols"><div class="stack">
   <section class="panel"><div class="panel-head"><h3>${t('sOverview')}</h3><span class="badge">${r.edited?t('editedByYou'):t('aiGenerated')}</span></div><div class="panel-body"><p>${esc(r.overview)}</p>${r.topics?.length?`<div class="chips" style="margin-top:12px">${r.topics.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`:''}</div></section>
   <section class="panel"><div class="panel-head"><h3>${t('decisions')}</h3><button class="btn sm ghost" data-act="tab" data-v="decisions">${t('viewAll')}</button></div>${r.decisions.slice(0,3).map(d=>decisionItem(d,m)).join('')||`<p class="row-pad muted">${t('noDecisionsMeeting')}</p>`}</section>
  </div><div class="stack">
   <section class="panel"><div class="panel-head"><h3>${t('openItems')}</h3><button class="btn sm ghost" data-act="tab" data-v="actions">${t('viewAll')}</button></div>${openT.slice(0,4).map(x=>taskItem(x)).join('')||`<p class="row-pad muted">${t('noOpenTasks')}</p>`}</section>
   <section class="panel"><div class="panel-head"><h3>${t('participants')}</h3><button class="btn sm ghost" data-act="tab" data-v="participants">${t('viewAll')}</button></div><div class="panel-body chips">${(m.participants||[]).map(person).join('')||`<span class="muted small">${t('noParticipants')}</span>`}</div></section>
  </div></div>`;
 },
 summary(m,tasks){
  const r=m.report;if(!r)return noReport(m);
  const sec=(k,title,body)=>`<section class="panel"><div class="panel-head"><h3>${title}</h3>${regenBtn(m,k)}</div>${body}</section>`;
  const list=(k,arr)=>(arr||[]).map((x,i)=>`<div class="item"><div class="body"><div contenteditable="true" data-edit="listItem" data-id="${m.id}" data-k="${k}" data-i="${i}">${esc(x.text)}</div><div class="meta">${refChips(m.id,x.refs)}</div></div></div>`).join('')||`<p class="row-pad muted">${t('none')}</p>`;
  return`<div class="stack">
   ${sec('overview','1. '+t('sOverview'),`<div class="panel-body"><p contenteditable="true" data-edit="overview" data-id="${m.id}">${esc(r.overview)}</p></div>`)}
   ${sec('topics','2. '+t('sTopics'),`<div class="panel-body"><div class="chips">${(r.topics||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')||`<span class="muted small">${t('none')}</span>`}</div></div>`)}
   ${sec('points','3. '+t('sPoints'),(r.points||[]).map((p,i)=>`<div class="item"><div class="body"><div class="title" contenteditable="true" data-edit="pointTitle" data-id="${m.id}" data-i="${i}">${esc(p.title)}</div><div class="desc" contenteditable="true" data-edit="pointDetail" data-id="${m.id}" data-i="${i}">${esc(p.detail)}</div><div class="meta">${refChips(m.id,p.refs)}</div></div></div>`).join('')||`<p class="row-pad muted">${t('none')}</p>`)}
   <section class="panel"><div class="panel-head"><h3>4. ${t('decisions')}</h3><button class="btn sm ghost" data-act="tab" data-v="decisions">${t('review')}</button></div>${r.decisions.map(d=>`<div class="item"><div class="body"><div class="title">${esc(d.title)}</div><div class="meta"><span class="badge ${d.status==='confirmed'?'ok':d.status==='review'?'warn':''}">${t('ds_'+d.status)}</span>${refChips(m.id,d.refs)}</div></div></div>`).join('')||`<p class="row-pad muted">${t('noDecisionsMeeting')}</p>`}</section>
   <section class="panel"><div class="panel-head"><h3>5. ${t('actionItems')}</h3><button class="btn sm ghost" data-act="tab" data-v="actions">${t('review')}</button></div>${tasks.map(x=>`<div class="item"><div class="body"><div class="title">${esc(x.title)}</div><div class="meta">${x.owner?person(x.owner):`<span class="badge">${t('unassigned')}</span>`}<span class="badge">${t('ts_'+x.status)}</span></div></div></div>`).join('')||`<p class="row-pad muted">${t('noTasksMeeting')}</p>`}</section>
   ${sec('questions','6. '+t('openQuestions'),list('questions',r.questions))}
   ${sec('risks','7. '+t('risks'),list('risks',r.risks))}
   ${sec('followup','8. '+t('sFollowup'),`<div class="panel-body stack" style="gap:10px"><div class="suggest"><div class="lbl">${t('aiSuggestion')}</div><div contenteditable="true" data-edit="fuSubject" data-id="${m.id}" style="font-weight:600">${esc(r.followup?.subject||'')}</div><div contenteditable="true" data-edit="fuBody" data-id="${m.id}" style="white-space:pre-wrap;margin-top:6px">${esc(r.followup?.body||'')}</div></div><div><button class="btn sm" data-act="copyFollowup" data-id="${m.id}">${ic('copy')}${t('copy')}</button></div></div>`)}
   ${r.dropped?`<p class="tiny muted">${t('droppedNote',{n:fmtNum(r.dropped)})}</p>`:''}</div>`;
 },
 transcript(m){
  if(!m.transcript?.length)return`<div class="panel">${empty(t('noTranscript'),t('noTranscriptBody'))}</div>`;
  return`<div class="toolbar"><input class="input" id="tq" type="search" data-in="q" value="${esc(UI.q)}" placeholder="${esc(t('searchTranscript'))}"><span class="small muted" id="hitCount"></span><span style="flex:1"></span>
   <button class="btn sm" data-act="copyTranscript" data-id="${m.id}">${ic('copy')}${t('copy')}</button><button class="btn sm" data-act="exportTxt" data-id="${m.id}">${ic('download')}TXT</button></div>
   <p class="tiny muted" style="margin-bottom:8px">${t('transcriptEditHint')}</p>
   <section class="panel" id="listArea">${LISTS.meeting()}</section>`;
 },
 decisions(m){
  const r=m.report;if(!r)return noReport(m);
  return`<div class="toolbar"><p class="small muted" style="flex:1">${t('decisionsHint')}</p><button class="btn sm" data-act="addDecision" data-m="${m.id}">${ic('plus')}${t('addDecision')}</button></div>
   <section class="panel">${r.decisions.map(d=>decisionItem(d,m,{edit:true})).join('')||`<p class="row-pad muted">${t('noDecisionsMeeting')}</p>`}</section>`;
 },
 actions(m,tasks){
  if(!m.report&&['queued','analyzing','indexing'].includes(m.status))return skel();
  return`<div class="toolbar"><p class="small muted" style="flex:1">${t('actionsHint')}</p><button class="btn sm" data-act="exportCsv" data-m="${m.id}">${ic('download')}CSV</button><button class="btn sm" data-act="addTask" data-m="${m.id}">${ic('plus')}${t('addTask')}</button></div>
   <section class="panel">${tasks.map(x=>taskItem(x)).join('')||`<p class="row-pad muted">${t('noTasksMeeting')}</p>`}</section>`;
 },
 participants(m,tasks){
  const sp=[...new Set((m.transcript||[]).map(s=>s.sp).filter(Boolean))];
  const ppl=[...new Set([...(m.participants||[]),...sp])];
  return`<p class="small muted" style="margin-bottom:12px">${t('participantsHint')}</p><section class="panel"><div class="tblwrap"><table class="tbl"><thead><tr><th>${t('name')}</th><th>${t('linesSpoken')}</th><th>${t('assignedItems')}</th><th></th></tr></thead><tbody>
   ${ppl.map(n=>`<tr><td>${person(n)}</td><td class="num">${fmtNum((m.transcript||[]).filter(s=>s.sp===n).length)}</td><td class="num">${fmtNum(tasks.filter(x=>x.owner===n).length)}</td><td style="text-align:end;white-space:nowrap">${sp.includes(n)?`<button class="btn sm ghost" data-act="renameSpeaker" data-id="${m.id}" data-v="${esc(n)}">${t('renameSpeaker')}</button>`:''}<button class="btn sm ghost" data-act="searchPerson" data-v="${esc(n)}" aria-label="${esc(t('search'))}">${ic('search')}</button></td></tr>`).join('')||`<tr><td colspan="4" class="muted">${t('noParticipants')}</td></tr>`}</tbody></table></div></section>
   ${!sp.length&&m.transcript?.length?`<p class="note" style="margin-top:12px">${t('noDiarization')}</p>`:''}`;
 }
};
LISTS.meeting=()=>{
  const m=M(UI.params.id),q=norm(UI.q),hl=UI.params.hl;
  const rows=(m.transcript||[]).map(s=>{const hit=q&&norm(s.text+' '+(s.sp||'')).includes(q);if(q&&!hit)return'';
    let txt=esc(s.text);if(UI.q){const re=new RegExp('('+UI.q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');txt=txt.replace(re,'<mark>$1</mark>')}
    const lr=arabicRatio(s.text),lang=lr>0.8?'AR':lr<0.2?'EN':'AR/EN';
    return`<div class="seg-row ${s.id===hl?'hit':''}" id="seg-${esc(s.id)}"><button class="ts" data-act="seek" data-t="${s.t??''}" title="${esc(t('playFromHere'))}">${fmtTs(s.t)}</button><div>${s.sp?`<button class="spk" style="border:0;background:none;padding:0;cursor:pointer" data-act="renameSpeaker" data-id="${m.id}" data-v="${esc(s.sp)}" title="${esc(t('renameSpeaker'))}">${esc(s.sp)}</button>`:''}<span class="lang">${lang}</span><div class="txt" contenteditable="true" data-edit="segText" data-id="${m.id}" data-s="${esc(s.id)}">${txt}</div>${s.orig&&s.orig!==s.text?`<div class="tiny muted">${t('edited')} — ${t('original')}: ${esc(s.orig.slice(0,100))}</div>`:''}</div></div>`}).join('');
  return rows||`<p class="row-pad muted">${t('noMatches')}</p>`;
};

/* ---------- AI search ---------- */
VIEWS.search=()=>{
  const f=UI.sf||(UI.sf={}),mode=UI.smode||'ai',res=S.searches.find(x=>x.id===UI.params.sid);
  const ppl=people().map(p=>p.name),tags=[...new Set(S.meetings.flatMap(m=>m.tags||[]))];
  return`<div class="page-head"><div><h1>${t('nav_search')}</h1><p>${t('searchSub')}</p></div></div>
  <div class="askbar">${ic('search')}<input id="sInput" value="${esc(UI.sq||'')}" placeholder="${esc(mode==='ai'?t('askHomePh'):t('keywordPh'))}" aria-label="${esc(t('search'))}"><button class="btn primary sm" data-act="runSearch" ${UI.busy.search?'disabled':''} aria-label="${esc(t('search'))}">${ic('send')}</button></div>
  <div class="toolbar"><div class="seg" role="group"><button data-act="smode" data-v="ai" aria-pressed="${mode==='ai'}">${t('modeAI')}</button><button data-act="smode" data-v="kw" aria-pressed="${mode==='kw'}">${t('modeKeyword')}</button></div>
   <select class="select" data-ch="sf" data-k="project" aria-label="${esc(t('project'))}"><option value="">${t('allProjects')}</option>${S.projects.map(p=>`<option value="${p.id}" ${f.project===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
   <select class="select" data-ch="sf" data-k="person" aria-label="${esc(t('participants'))}"><option value="">${t('anyone')}</option>${ppl.map(n=>`<option ${f.person===n?'selected':''}>${esc(n)}</option>`).join('')}</select>
   <select class="select" data-ch="sf" data-k="platform" aria-label="${esc(t('platform'))}"><option value="">${t('allPlatforms')}</option>${PLATFORMS.map(k=>`<option value="${k}" ${f.platform===k?'selected':''}>${t('pf_'+k)}</option>`).join('')}</select>
   ${tags.length?`<select class="select" data-ch="sf" data-k="tag" aria-label="${esc(t('tags'))}"><option value="">${t('allTags')}</option>${tags.map(x=>`<option ${f.tag===x?'selected':''}>${esc(x)}</option>`).join('')}</select>`:''}
   <label class="small muted">${t('from')} <input class="input" type="date" style="width:auto" data-ch="sf" data-k="from" value="${esc(f.from||'')}"></label><label class="small muted">${t('to')} <input class="input" type="date" style="width:auto" data-ch="sf" data-k="to" value="${esc(f.to||'')}"></label></div>
  ${!AI.ok()&&mode==='ai'?aiSetup():''}
  <div id="searchOut">${mode==='kw'&&UI.sq?keywordResults():mode==='ai'&&res?answerView(res):
   `<div class="cols"><section><h3 class="day">${t('suggested')}</h3><div class="prompts">${['sug1','sug2','sug3','sug4','sug5','sug6'].map(k=>`<button data-act="suggest" data-v="${esc(t(k))}">${esc(t(k))}</button>`).join('')}</div></section>
    <section class="panel"><div class="panel-head"><h3>${t('recentQueries')}</h3></div><ul class="rows">${S.searches.slice(0,8).map(x=>`<li><button class="row-btn" data-act="openSearch" data-id="${x.id}"><span class="row-main"><span class="row-title">${esc(x.q)}</span><span class="row-meta">${fmtDateTime(x.at)}</span></span></button></li>`).join('')||`<li class="row-pad muted small">${t('noQueries')}</li>`}</ul></section></div>`}</div>`;
};
function filterMeetings(f){
  return S.meetings.filter(m=>(!f.project||m.projectId===f.project)&&(!f.platform||m.platform===f.platform)&&(!f.tag||(m.tags||[]).includes(f.tag))&&(!f.person||(m.participants||[]).includes(f.person)||(m.transcript||[]).some(s=>s.sp===f.person))&&(!f.from||(m.date||'').slice(0,10)>=f.from)&&(!f.to||(m.date||'').slice(0,10)<=f.to));
}
function keywordResults(){
  const q=norm(UI.sq),ms=filterMeetings(UI.sf||{}),ids=new Set(ms.map(m=>m.id));
  const mHits=ms.filter(m=>norm(m.title+' '+(m.report?.overview||'')+' '+(m.tags||[]).join(' ')).includes(q));
  const segHits=ms.flatMap(m=>(m.transcript||[]).filter(s=>norm(s.text+' '+(s.sp||'')).includes(q)).map(s=>({m,s})));
  const decHits=allDecisions().filter(d=>ids.has(d.meeting.id)&&norm(d.title+' '+d.description).includes(q));
  const taskHits=liveTasks().filter(x=>ids.has(x.meetingId)&&norm(x.title+' '+(x.owner||'')).includes(q));
  if(!mHits.length&&!segHits.length&&!decHits.length&&!taskHits.length)return`<section class="panel"><p class="row-pad muted">${t('noMatches')}</p></section>`;
  return`<div class="stack">${decHits.length?`<section class="panel"><div class="panel-head"><h3>${t('decisions')} (${fmtNum(decHits.length)})</h3></div>${decHits.map(d=>decisionItem(d,d.meeting,{showMeeting:true})).join('')}</section>`:''}
   ${taskHits.length?`<section class="panel"><div class="panel-head"><h3>${t('actionItems')} (${fmtNum(taskHits.length)})</h3></div>${taskHits.map(x=>taskItem(x,{showMeeting:true})).join('')}</section>`:''}
   ${mHits.length?`<section class="panel"><div class="panel-head"><h3>${t('nav_meetings')} (${fmtNum(mHits.length)})</h3></div><ul class="rows">${mHits.map(meetingRow).join('')}</ul></section>`:''}
   ${segHits.length?`<section class="panel"><div class="panel-head"><h3>${t('transcriptMoments')} (${fmtNum(segHits.length)})</h3></div>${segHits.slice(0,50).map(({m,s})=>`<div class="item"><div class="body"><div class="desc">${s.sp?`<b>${esc(s.sp)}:</b> `:''}${esc(s.text)}</div><div class="meta">${srcChip(m.id,s.id)}<span class="tiny muted">${esc(m.title)} — ${fmtDate(m.date)}</span></div></div></div>`).join('')}</section>`:''}</div>`;
}
function answerView(x){
  if(x.pending&&!x.answer)return`<div class="answer"><div class="sec-head" style="margin-bottom:10px"><b>${esc(x.q)}</b></div><div class="thinking"><i></i><i></i><i></i>${t('thinking')}</div></div>`;
  const used=x.error?[]:[...new Set((x.answer.match(/\[(\d+)\]/g)||[]).map(s=>+s.slice(1,-1)))].map(n=>({n,s:x.srcs[n-1]})).filter(o=>o.s&&M(o.s.m));
  const related=[...new Set(used.map(o=>o.s.m))].map(M).filter(Boolean);
  return`<div class="stack"><div class="answer" id="answerBox"><div class="sec-head" style="margin-bottom:10px"><b>${esc(x.q)}</b>${x.confidence&&!x.pending?`<span class="badge ${x.confidence==='high'?'ok':x.confidence==='low'?'warn':''}">${t('conf_'+x.confidence)}</span>`:''}</div>${answerHtml(x)}</div>
   ${related.length&&!x.pending?`<section class="panel"><div class="panel-head"><h3>${t('relatedMeetings')}</h3></div><ul class="rows">${related.map(meetingRow).join('')}</ul></section>`:''}
   ${used.length&&!x.pending?`<section class="panel"><div class="panel-head"><h3>${t('sourceExcerpts')}</h3></div>${used.map(({n,s})=>{const m=M(s.m),sg=s.s?segOf(m,s.s):null;return`<div class="item"><span class="badge num">${fmtNum(n)}</span><div class="body"><div class="desc">${sg?(sg.sp?`<b>${esc(sg.sp)}:</b> `:'')+esc(sg.text):esc((x.lines||[])[n-1]||'')}</div><div class="meta">${srcChip(m.id,s.s,s.tab)}<span class="tiny muted">${esc(m.title)} — ${fmtDate(m.date)}</span></div></div></div>`}).join('')}</section>`:''}
   ${x.pending?'':`<div><button class="btn sm ghost" data-act="newSearch">${t('newSearch')}</button></div>`}</div>`;
}
function answerHtml(x){
  if(x.error)return`<div class="setup">${ic('refresh')}<div>${esc(x.error)}</div></div>`;
  const body=x.answer.replace(/\n?CONFIDENCE:.*$/s,'');
  const cite=h=>h.replace(/\[(\d+(?:\s*[,،]\s*\d+)*)\]/g,(all,nums)=>nums.split(/[,،]/).map(n=>{const s=(x.srcs||[])[+n.trim()-1];if(!s)return'';const m=M(s.m);if(!m)return'';const sg=s.s?segOf(m,s.s):null;return`<button class="src" data-act="src" data-m="${m.id}" data-s="${esc(s.s||'')}" data-tab="${s.tab}" title="${esc(m.title)}">${ic('quote')}${fmtNum(+n.trim())}${sg?' · '+fmtTs(sg.t):''}</button>`}).join(''));
  const split=body.split(/\n(?=\**\s*(?:Suggestions?|اقتراح(?:ات)?)\s*\**\s*[:：])/i);
  let html=`<div class="md">${md(split[0],cite)}</div>`;
  if(split[1])html+=`<div class="suggest" style="margin-top:10px"><div class="lbl">${t('aiSuggestion')}</div><div class="md">${md(split[1].replace(/^\**\s*(?:Suggestions?|اقتراح(?:ات)?)\s*\**\s*[:：]\s*/i,''),cite)}</div></div>`;
  return html;
}

/* ---------- projects ---------- */
VIEWS.projects=()=>{
  const arch=UI.filters.parch;const list=S.projects.filter(p=>!!p.archived===!!arch);
  return`<div class="page-head"><div><h1>${t('nav_projects')}</h1><p>${t('projectsSub')}</p></div><button class="btn primary" data-act="newProject">${ic('plus')}${t('newProject')}</button></div>
  <div class="toolbar"><div class="seg"><button data-act="pArch" data-v="" aria-pressed="${!arch}">${t('active')}</button><button data-act="pArch" data-v="1" aria-pressed="${!!arch}">${t('archived')}</button></div></div>
  <section class="panel">${list.length?`<ul class="rows">${list.map(projectRow).join('')}</ul>`:empty(arch?t('noArchived'):t('noProjects'),arch?'':t('noProjectsBody'),arch?'':`<button class="btn primary" data-act="newProject">${ic('plus')}${t('newProject')}</button>`)}</section>`;
};
VIEWS.project=()=>{
  const p=P(UI.params.id);if(!p)return empty(t('notFound'),'');
  const ms=S.meetings.filter(m=>m.projectId===p.id).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const decs=allDecisions().filter(d=>d.meeting.projectId===p.id&&d.status!=='rejected').sort((a,b)=>(b.meeting.date||'').localeCompare(a.meeting.date||''));
  const tasks=liveTasks().filter(x=>x.projectId===p.id),open=tasks.filter(x=>!isDone(x)),done=tasks.filter(x=>x.status==='completed');
  const ppl=[...new Set(ms.flatMap(m=>m.participants||[]))];
  const act=[...ms.map(m=>({at:m.date,txt:t('actMeeting',{t:m.title})})),...done.filter(x=>x.completedAt).map(x=>({at:x.completedAt,txt:t('actDone',{t:x.title})}))].sort((a,b)=>(b.at||'').localeCompare(a.at||'')).slice(0,8);
  const unassigned=S.meetings.filter(m=>!m.projectId);
  return`<div class="crumb"><button data-act="nav" data-to="projects">${t('nav_projects')}</button></div>
  <div class="page-head"><div style="flex:1;min-width:260px"><h1 contenteditable="true" data-edit="projectName" data-id="${p.id}">${esc(p.name)}</h1><p contenteditable="true" data-edit="projectDesc" data-id="${p.id}">${esc(p.desc||t('addDescription'))}</p></div>
  <div class="hero-actions"><button class="btn" data-act="askProject" data-id="${p.id}">${ic('search')}${t('searchProject')}</button><button class="btn" data-act="archiveProject" data-id="${p.id}">${p.archived?t('unarchive'):t('archive')}</button><button class="btn ghost" data-act="deleteProject" data-id="${p.id}" aria-label="${esc(t('delete'))}">${ic('trash')}</button></div></div>
  <section class="panel" style="margin-bottom:20px"><div class="panel-head"><h3>${t('projectContext')}</h3>${AI.ok()&&ms.length?`<button class="btn sm" data-act="projectOverview" data-id="${p.id}" ${UI.busy['po'+p.id]?'disabled':''}>${ic('spark')}${p.overview?t('refresh'):t('generate')}</button>`:''}</div><div class="panel-body">
   ${UI.busy['po'+p.id]?'<div class="sk"></div><div class="sk" style="width:75%"></div>':p.overview?`<div class="md">${md(p.overview.text)}</div><p class="tiny muted" style="margin-top:8px">${t('aiGenerated')} — ${fmtDateTime(p.overview.at)}</p>`:`<p class="muted small">${ms.length?t('overviewHint'):t('overviewNeedsMeetings')}</p>${AI.ok()?'':aiSetup()}`}</div></section>
  <div class="cols"><div class="stack">
   <section class="panel"><div class="panel-head"><h3>${t('nav_meetings')} (${fmtNum(ms.length)})</h3>${unassigned.length?`<select class="select sm" data-ch="assignMeeting" data-id="${p.id}"><option value="">${t('addExistingMeeting')}</option>${unassigned.map(m=>`<option value="${m.id}">${esc(m.title)}</option>`).join('')}</select>`:''}</div><ul class="rows">${ms.map(meetingRow).join('')||`<li class="row-pad muted">${t('noProjectMeetings')}</li>`}</ul></section>
   <section class="panel"><div class="panel-head"><h3>${t('recentDecisions')}</h3></div>${decs.map(d=>decisionItem(d,d.meeting,{showMeeting:true})).join('')||`<p class="row-pad muted">${t('noDecisions')}</p>`}</section>
   <section class="panel"><div class="panel-head"><h3>${t('recentActivity')}</h3></div>${act.map(a=>`<div class="item"><div class="body"><div class="desc">${esc(a.txt)}</div><div class="tiny muted">${fmtDate(a.at)}</div></div></div>`).join('')||`<p class="row-pad muted">—</p>`}</section>
  </div><div class="stack">
   <section class="panel"><div class="panel-head"><h3>${t('openItems')} (${fmtNum(open.length)})</h3></div>${open.map(x=>taskItem(x,{showMeeting:true})).join('')||`<p class="row-pad muted">${t('noOpenTasks')}</p>`}</section>
   <section class="panel"><div class="panel-head"><h3>${t('completedItems')} (${fmtNum(done.length)})</h3></div>${done.map(x=>taskItem(x)).join('')||`<p class="row-pad muted">—</p>`}</section>
   <section class="panel"><div class="panel-head"><h3>${t('participants')}</h3></div><div class="panel-body chips">${ppl.map(n=>`<button class="btn sm ghost" data-act="searchPerson" data-v="${esc(n)}">${person(n)}</button>`).join('')||'—'}</div></section>
  </div></div>`;
};

/* ---------- action items ---------- */
function taskFilter(k){return liveTasks().filter(x=>k==='all'||(k==='mine'&&isMine(x))||(k==='unassigned'&&!x.owner&&!isDone(x))||(k==='completed'&&x.status==='completed')||(k==='review'&&x.review))}
VIEWS.tasks=()=>{
  const f=UI.filters.tf||'all';
  return`<div class="page-head"><div><h1>${t('nav_tasks')}</h1><p>${t('tasksSub')}</p></div><div class="hero-actions"><button class="btn" data-act="exportCsv">${ic('download')}CSV</button><button class="btn primary" data-act="addTask">${ic('plus')}${t('addTask')}</button></div></div>
  <div class="tabs" role="tablist">${['all','mine','unassigned','review','completed'].map(k=>`<button role="tab" aria-selected="${f===k}" data-act="taskFilter" data-v="${k}">${t('tf_'+k)} <span class="muted num">${fmtNum(taskFilter(k).length)}</span></button>`).join('')}</div>
  <div class="toolbar"><input class="input" id="tkq" type="search" data-in="q" value="${esc(UI.q)}" placeholder="${esc(t('searchTasks'))}">
   <select class="select" data-ch="filter" data-k="tst" aria-label="${esc(t('status'))}"><option value="">${t('allStatuses')}</option>${TSTAT.map(s=>`<option value="${s}" ${UI.filters.tst===s?'selected':''}>${t('ts_'+s)}</option>`).join('')}</select>
   <select class="select" data-ch="filter" data-k="tp" aria-label="${esc(t('project'))}"><option value="">${t('allProjects')}</option>${S.projects.map(p=>`<option value="${p.id}" ${UI.filters.tp===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
   <select class="select" data-ch="filter" data-k="td" aria-label="${esc(t('dueDate'))}"><option value="">${t('anyDue')}</option>${['overdue','week','none'].map(k=>`<option value="${k}" ${UI.filters.td===k?'selected':''}>${t('due_'+k)}</option>`).join('')}</select></div>
  ${f==='mine'&&!S.settings.myName?`<div class="setup" style="margin-bottom:16px">${ic('gear')}<div><b>${t('setNameTitle')}</b>${t('setNameBody')} <button class="btn sm" data-act="nav" data-to="settings">${t('nav_settings')}</button></div></div>`:''}
  <p class="tiny muted" style="margin-bottom:8px">${t('sendToIntegration')}</p>
  <section class="panel" id="listArea">${LISTS.tasks()}</section>`;
};
LISTS.tasks=()=>{
  const q=norm(UI.q),F=UI.filters,wk=new Date(Date.now()+7*864e5).toISOString().slice(0,10);
  const l=taskFilter(F.tf||'all').filter(x=>(!F.tp||x.projectId===F.tp)&&(!F.tst||x.status===F.tst)&&(!F.td||(F.td==='overdue'&&isOverdue(x))||(F.td==='week'&&x.due&&x.due<=wk&&!isDone(x))||(F.td==='none'&&!x.due))&&(!q||norm(x.title+' '+(x.owner||'')).includes(q)))
   .sort((a,b)=>isDone(a)-isDone(b)||(isOverdue(b)-isOverdue(a))||((a.due||'9999')<(b.due||'9999')?-1:1));
  if(!liveTasks().length)return empty(t('noTasks'),t('noTasksBody'));
  return l.map(x=>taskItem(x,{showMeeting:true,showProject:true})).join('')||`<p class="row-pad muted">${t('noMatches')}</p>`;
};

/* ---------- integrations ---------- */
const INTEGRATIONS=[['gcal','cal','v1.1'],['outlook','cal','v1.2'],['zoom','monitor','v1.2'],['slack','plug','v1.2'],['notion','file','v1.2'],['linear','tasks','v1.2'],['jira','tasks','v1.2'],['webhooks','plug','v1.2']];
VIEWS.integrations=()=>`<div class="page-head"><div><h1>${t('nav_integrations')}</h1><p>${t('integrationsSub')}</p></div></div>
 <h3 class="day">${t('keekApps')}</h3>
 ${KEEKX.appCards()}
 <h3 class="day">${t('directory')}</h3>
 <div class="cards">${INTEGRATIONS.map(([k,i,v])=>`<div class="card"><h3><span class="person">${ic(i)}${t('in_'+k)}</span><span class="badge">${t('plannedFor',{v})}</span></h3><p class="small">${t('in_'+k+'_d')}</p><p class="perm"><b>${t('permissions')}:</b> ${t('in_'+k+'_p')}</p><button class="btn sm" disabled>${t('connect')}</button></div>`).join('')}</div>
 <p class="note" style="margin-top:20px">${t('integrationsNote')}</p>`;

/* ---------- team ---------- */
const ROLES=['owner','admin','member','guest'],PERMS=['p_workspace','p_billing','p_members','p_integrations','p_record','p_shared','p_tasks','p_viewShared'];
const MATRIX={owner:[1,1,1,1,1,1,1,1],admin:[0,0,1,1,1,1,1,1],member:[0,0,0,0,1,1,1,1],guest:[0,0,0,0,0,0,0,1]};
VIEWS.team=()=>`<div class="page-head"><div><h1>${t('nav_team')}</h1><p>${t('teamSub')}</p></div></div>
 <div class="cols"><div class="stack">
  <section class="panel"><div class="panel-head"><h3>${t('members')}</h3></div><div class="tblwrap"><table class="tbl"><thead><tr><th>${t('name')}</th><th>${t('role')}</th><th>${t('status')}</th></tr></thead><tbody><tr><td>${person(S.settings.myName||t('you'))}</td><td>${t('r_owner')}</td><td><span class="badge ok">${t('activeMember')}</span></td></tr></tbody></table></div></section>
  <section class="panel"><div class="panel-head"><h3>${t('invite')}</h3></div><div class="panel-body stack" style="gap:10px"><div style="display:flex;gap:8px;flex-wrap:wrap"><input class="input" type="email" style="flex:1;min-width:180px" disabled placeholder="name@company.com" aria-label="${esc(t('invite'))}"><select class="select" style="width:auto" disabled><option>${t('r_member')}</option></select><button class="btn" disabled>${t('sendInvite')}</button></div><p class="note">${t('inviteOff')}</p></div></section>
 </div>
 <section class="panel"><div class="panel-head"><h3>${t('rolesPerms')}</h3></div><div class="tblwrap"><table class="tbl"><thead><tr><th></th>${ROLES.map(r=>`<th>${t('r_'+r)}</th>`).join('')}</tr></thead><tbody>${PERMS.map((p,i)=>`<tr><td class="small">${t(p)}</td>${ROLES.map(r=>`<td>${MATRIX[r][i]?`<span style="color:var(--accent)" aria-label="${esc(t('allowed'))}">${icS('check')}</span>`:'<span class="muted">—</span>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section></div>`;

/* ---------- settings ---------- */
const STABS=['profile','workspace','audio','privacy','notifications','billing'];
VIEWS.settings=()=>{
  const s=S.settings,tab=STABS.includes(UI.tab)?UI.tab:'profile';
  const body={
   profile:()=>`<section class="panel"><div class="panel-body stack" style="gap:14px">
     <label class="field"><span>${t('yourName')}</span><input class="input" data-ch="setting" data-k="myName" value="${esc(s.myName)}" placeholder="${esc(t('namePh'))}"><span class="tiny">${t('nameHint')}</span></label>
     <div class="grid2"><label class="field"><span>${t('language')}</span><select class="select" data-ch="setting" data-k="lang"><option value="ar" ${s.lang==='ar'?'selected':''}>العربية</option><option value="en" ${s.lang==='en'?'selected':''}>English</option></select></label>
     <label class="field"><span>${t('theme')}</span><select class="select" data-ch="setting" data-k="theme">${['system','light','dark'].map(k=>`<option value="${k}" ${s.theme===k?'selected':''}>${t('th_'+k)}</option>`).join('')}</select></label></div>
     <p class="small muted">${t('accountNote')}</p></div></section>`,
   workspace:()=>`<section class="panel"><div class="panel-body stack" style="gap:14px"><label class="field"><span>${t('wsName')}</span><input class="input" data-ch="setting" data-k="wsName" value="${esc(s.wsName)}" placeholder="${esc(t('myWorkspace'))}"></label>
     <p class="small">${t('wsTypeLabel')}: <b>${t(s.wsKind==='team'?'wsTeam':'wsPersonal')}</b></p>${s.wsKind==='team'?`<p class="note">${t('teamNote')}</p>`:''}</div></section>`,
   audio:()=>`<section class="panel"><div class="panel-body stack" style="gap:14px"><p class="small">${t('audioDesktopNote')}</p>
     <div><b>${t('micTest')}</b><p class="small muted">${t('micTestHint')}</p></div>
     <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">${UI.micTest?`<button class="btn" data-act="micTestStop">${ic('stop')}${t('stop')}</button>`:`<button class="btn" data-act="micTest">${ic('mic')}${t('testMic')}</button>`}<span class="meter" id="testMeter" aria-hidden="true" style="height:24px">${Array.from({length:20},()=>'<i></i>').join('')}</span><span class="small muted" id="micTestOut">${esc(UI.micTestMsg||'')}</span></div>
     <div class="setup">${ic('monitor')}<div><b>${t('sysAudio')}</b>${t('sysAudioBody')}</div></div></div></section>`,
   privacy:()=>`<section class="panel"><div class="panel-body stack" style="gap:12px">
     <p class="small">${t('storeDesc_'+Store.mode)}</p><p class="small">${t('processorsNote')}</p><p class="small">${t('noTraining')}</p><p class="small muted">${t('consentGuidance')}</p>
     <div class="hero-actions"><button class="btn" data-act="exportAll">${ic('download')}${t('exportAll')}</button>${S.meetings.some(m=>m.sample)?`<button class="btn" data-act="removeSample">${t('removeSample')}</button>`:`<button class="btn" data-act="loadSample">${t('loadSample')}</button>`}<button class="btn danger" data-act="deleteAll">${ic('trash')}${t('deleteAll')}</button></div></div></section>`,
   notifications:()=>`<section class="panel">${[['notifyInApp',true],['notifyDesktop',!!KEEKX.canNotify()],['notifyEmail',false],['notifySlack',false]].map(([k,on])=>`<div class="toggle"><div><b class="small">${t(k)}</b><div class="tiny muted">${t(k+'_d')}</div></div><button class="switch" role="switch" aria-checked="${on&&s[k]!==false}" aria-label="${esc(t(k))}" ${on?`data-act="toggleSetting" data-k="${k}"`:'disabled'}></button></div>`).join('')}</section>`,
   billing:()=>`<section class="panel" style="margin-bottom:16px"><div class="panel-body"><p class="small">${t('currentPlan')}: <b>${t('plan_free')}</b> — ${t('previewPlan')}</p><p class="small muted" style="margin-top:6px">${t('usageLine',{m:fmtNum(S.meetings.length),min:fmtNum(Math.round(S.meetings.reduce((n,m)=>n+(m.duration||0),0)/60000)),a:fmtNum(S.usage.ai||0)})}</p></div></section>
     <div class="cards">${['free','pro','team','enterprise'].map(p=>`<div class="card"><h3>${t('plan_'+p)}${p==='free'?`<span class="badge ok">${t('current')}</span>`:''}</h3><p class="small muted">${t('plan_'+p+'_for')}</p><ul class="small" style="margin:0;padding-inline-start:18px">${t('plan_'+p+'_f').split('|').map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div><p class="note" style="margin-top:14px">${t('pricingNote')}</p>`
  };
  return`<div class="page-head"><div><h1>${t('nav_settings')}</h1></div></div><div class="tabs" role="tablist">${STABS.map(k=>`<button role="tab" aria-selected="${tab===k}" data-act="tab" data-v="${k}">${t('set_'+k)}</button>`).join('')}</div>${body[tab]()}`;
};

/* ---------- modals ---------- */
function modalHtml(){
  const md_=UI.modal;if(!md_)return'';
  const wrap=(title,body,foot,wide)=>`<div class="scrim" data-act="modalScrim"><div class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><h3>${esc(title)}</h3><button class="btn sm ghost" data-act="modalClose" aria-label="${esc(t('close'))}">${ic('x')}</button></div><div class="modal-body">${body}</div>${foot?`<div class="modal-foot">${foot}</div>`:''}</div></div>`;
  const cancel=`<button class="btn ghost" data-act="modalClose">${t('cancel')}</button>`;
  const ppl=()=>`<datalist id="peopleList">${people().map(p=>`<option value="${esc(p.name)}">`).join('')}</datalist>`;
  if(md_.type==='confirm')return wrap(t('areYouSure'),`<p>${esc(md_.msg)}</p>`,cancel+`<button class="btn primary" data-act="confirmYes">${esc(md_.yesLabel||t('confirm'))}</button>`);
  if(md_.type==='newMeeting')return wrap(t('newMeeting'),`
   ${KEEKX.desktopOption()}
   <button class="option" data-act="goRecord">${ic('mic')}<div><b>${t('optBrowser')}</b><span class="small muted">${t('optBrowserD')}</span></div></button>
   <button class="option" data-act="importModal">${ic('file')}<div><b>${t('optImport')}</b><span class="small muted">${t('optImportD')}</span></div></button>
   <button class="option" data-act="uploadModal">${ic('upload')}<div><b>${t('optUpload')}</b><span class="small muted">${t('optUploadD')}</span></div></button>`,'');
  if(md_.type==='import'){const f=md_.form;return wrap(t('optImport'),`<div class="grid2"><label class="field"><span>${t('title')}</span><input class="input" id="imTitle" value="${esc(f.title||'')}" placeholder="${esc(t('titlePh'))}"></label><label class="field"><span>${t('date')}</span><input class="input" type="datetime-local" id="imDate" value="${esc(f.date)}"></label></div>
   <div class="grid2"><label class="field"><span>${t('platform')}</span>${platSelect('id="imPlat"',f.platform||'meet')}</label><label class="field"><span>${t('project')}</span>${projectSelect('id="imProj"',f.projectId)}</label></div>
   <div class="grid2"><label class="field"><span>${t('participants')}</span><input class="input" id="imPart" placeholder="${esc(t('participantsPh'))}"></label><label class="field"><span>${t('tags')}</span><input class="input" id="imTags" placeholder="${esc(t('tagsPh'))}"></label></div>
   ${f.audioName?`<p class="small">${icS('upload')} ${esc(f.audioName)} — ${t('audioAttachedSession')}</p>`:''}
   <label class="field"><span>${t('pasteLabel')}</span><textarea class="input" id="imText" style="min-height:220px" placeholder="${esc(t('pastePh'))}">${esc(f.text||'')}</textarea></label>${aiSetup()}`,cancel+`<button class="btn primary" data-act="saveImport">${ic('spark')}${t('saveProcess')}</button>`,true)}
  if(md_.type==='upload'){const u=md_.upload;return wrap(t('optUpload'),`<label class="drop" for="audioFile">${ic('upload')}<div style="margin-top:6px"><b>${t('chooseAudio')}</b></div><div class="small muted">MP3, WAV, M4A, WebM, MP4</div></label><input type="file" id="audioFile" class="sr" accept=".mp3,.wav,.m4a,.webm,.mp4,audio/*,video/mp4" data-ch="audioFile">
   ${u?`<div><b>${esc(u.name)}</b> <span class="small muted">${fmtNum(Math.round(u.size/1048576*10)/10)} MB${u.dur?' — '+fmtTs(u.dur*1000):''}</span><audio controls src="${u.url}" style="width:100%;margin-top:8px"></audio></div>`:''}
   ${KEEKX.uploadSttBlock(md_)}`,cancel+KEEKX.uploadBtn(md_)+(md_.mid?`<button class="btn primary" data-act="saveAttach" ${u?'':'disabled'}>${t('attachAudio')}</button>`:`<button class="btn primary" data-act="uploadThenImport" ${u?'':'disabled'}>${t('continueWithTranscript')}</button>`))}
  if(md_.type==='editMeeting'){const m=M(md_.mid);return wrap(t('editMeeting'),`<label class="field"><span>${t('title')}</span><input class="input" id="emTitle" value="${esc(m.title)}"></label>
   <div class="grid2"><label class="field"><span>${t('date')}</span><input class="input" type="datetime-local" id="emDate" value="${esc((m.date||'').slice(0,16))}"></label><label class="field"><span>${t('platform')}</span>${platSelect('id="emPlat"',m.platform)}</label></div>
   <div class="grid2"><label class="field"><span>${t('project')}</span>${projectSelect('id="emProj"',m.projectId)}</label><label class="field"><span>${t('meetingUrl')}</span><input class="input" id="emUrl" value="${esc(m.url||'')}" placeholder="https://"></label></div>
   <label class="field"><span>${t('participants')}</span><input class="input" id="emPart" value="${esc((m.participants||[]).join(', '))}"></label><label class="field"><span>${t('tags')}</span><input class="input" id="emTags" value="${esc((m.tags||[]).join(', '))}"></label>`,cancel+`<button class="btn primary" data-act="saveMeeting">${t('save')}</button>`)}
  if(md_.type==='export'){const m=M(md_.mid);return wrap(t('export'),`<p class="small muted">${t('exportHint')}</p>
   <button class="option" data-act="exportTxt" data-id="${m.id}" ${m.transcript?.length?'':'disabled'}>${ic('file')}<div><b>${t('exTxt')}</b><span class="small muted">.txt</span></div></button>
   <button class="option" data-act="exportSummary" data-id="${m.id}" ${m.report?'':'disabled'}>${ic('file')}<div><b>${t('exSummary')}</b><span class="small muted">.md</span></div></button>
   <button class="option" data-act="exportCsv" data-m="${m.id}">${ic('tasks')}<div><b>${t('exCsv')}</b><span class="small muted">.csv</span></div></button>
   <button class="option" data-act="exportJson" data-id="${m.id}">${ic('download')}<div><b>${t('exJson')}</b><span class="small muted">.json</span></div></button>
   <p class="tiny muted">${t('exportLater')}</p>`,'')}
  if(md_.type==='share')return wrap(t('share'),`<div class="setup">${ic('share')}<div><b>${t('shareOffTitle')}</b>${t('shareOffBody')}</div></div><p class="small muted">${t('shareMeanwhile')}</p>`,`<button class="btn" data-act="exportModal" data-id="${md_.mid}">${ic('download')}${t('export')}</button><button class="btn primary" data-act="modalClose">${t('close')}</button>`);
  if(md_.type==='project')return wrap(t('newProject'),`<label class="field"><span>${t('projectName')}</span><input class="input" id="fName" placeholder="${esc(t('projectPh'))}"></label><label class="field"><span>${t('description')}</span><textarea class="input" id="fDesc" style="min-height:80px"></textarea></label>`,cancel+`<button class="btn primary" data-act="saveProject">${t('create')}</button>`);
  if(md_.type==='task'){const x=md_.task;return wrap(md_.isNew?t('addTask'):t('editTask'),`<label class="field"><span>${t('title')}</span><input class="input" id="fTitle" value="${esc(x.title)}"></label><label class="field"><span>${t('description')}</span><textarea class="input" id="fDesc" style="min-height:70px">${esc(x.description||'')}</textarea></label>
   <div class="grid2"><label class="field"><span>${t('owner')}</span><input class="input" id="fOwner" value="${esc(x.owner||'')}" list="peopleList">${ppl()}</label><label class="field"><span>${t('dueDate')}</span><input class="input" type="date" id="fDue" value="${esc(x.due||'')}"></label></div>
   ${x.dueText?`<p class="tiny muted">${t('saidInMeeting')}: “${esc(x.dueText)}”</p>`:''}
   <div class="grid2"><label class="field"><span>${t('status')}</span><select class="select" id="fStat">${TSTAT.map(s=>`<option value="${s}" ${x.status===s?'selected':''}>${t('ts_'+s)}</option>`).join('')}</select></label><label class="field"><span>${t('project')}</span>${projectSelect('id="fProj"',x.projectId)}</label></div>`,
   (md_.isNew?'':`<button class="btn danger" data-act="deleteTask" data-id="${x.id}" style="margin-inline-end:auto">${t('delete')}</button>`)+cancel+`<button class="btn primary" data-act="saveTask">${t('save')}</button>`)}
  if(md_.type==='decision'){const d=md_.dec;return wrap(md_.isNew?t('addDecision'):t('editDecision'),`<label class="field"><span>${t('title')}</span><input class="input" id="fTitle" value="${esc(d.title)}"></label><label class="field"><span>${t('description')}</span><textarea class="input" id="fDesc" style="min-height:80px">${esc(d.description)}</textarea></label>${md_.isNew?`<p class="tiny muted">${t('manualDecisionNote')}</p>`:''}`,
   (md_.isNew?'':`<button class="btn danger" data-act="deleteDecision" style="margin-inline-end:auto">${t('delete')}</button>`)+cancel+`<button class="btn primary" data-act="saveDecision">${t('save')}</button>`)}
  if(md_.type==='speaker')return wrap(t('renameSpeaker'),`<p class="small muted">${t('renameSpeakerHint',{n:esc(md_.from)})}</p><label class="field"><span>${t('newName')}</span><input class="input" id="fName" value="${esc(md_.from)}" list="peopleList">${ppl()}</label>`,cancel+`<button class="btn primary" data-act="saveSpeaker">${t('save')}</button>`);
  return'';
}

/* ---------- actions ---------- */
const A={};
const splitList=s=>String(s||'').split(/[,،]/).map(x=>x.trim()).filter(Boolean);
const safeName=s=>(String(s).replace(/[\\/:*?"<>|]/g,'').slice(0,60)||'keek');
A.nav=el=>{if(el.dataset.to==='settings'||el.dataset.to==='record')go(el.dataset.to,{},el.dataset.to==='settings'?'profile':undefined);else go(el.dataset.to)};
A.menu=()=>{UI.menu=!UI.menu;render()};
A.toggleFilters=()=>{UI.showFilters=!UI.showFilters;render()};
A.openMeeting=el=>go('meeting',{id:el.dataset.id});
A.openProject=el=>go('project',{id:el.dataset.id});
A.tab=el=>{UI.tab=el.dataset.v;UI.q='';render()};
A.src=el=>{
  const mid=el.dataset.m,sid=el.dataset.s;
  UI.route='meeting';UI.params={id:mid,hl:sid||null};UI.tab=sid?'transcript':(el.dataset.tab||'overview');UI.q='';UI.menu=false;UI.modal=null;
  if(sid)AFTER.push(()=>{const r=document.getElementById('seg-'+sid);r&&r.scrollIntoView({block:'center'});seekTo(segOf(M(mid),sid)?.t)});
  render();
};
function seekTo(ms){const a=$('#player');if(a&&ms!=null){a.currentTime=ms/1000;a.play().catch(()=>{})}}
A.seek=el=>{const ms=el.dataset.t===''?null:+el.dataset.t;if(!$('#player')){toast(t('noAudioToPlay'));return}seekTo(ms)};
A.modalClose=()=>{UI.modal=null;render()};
A.modalScrim=(el,e)=>{if(e.target===el){UI.modal=null;render()}};
A.confirmYes=()=>{const m=UI.modal;UI.modal=null;CONFIRM[m.yes]&&CONFIRM[m.yes](m);render()};
const ask=(msg,yes,extra={})=>{UI.modal={type:'confirm',msg,yes,...extra};render()};
const CONFIRM={
  deleteMeeting(m){if(REC.urls[m.id]){URL.revokeObjectURL(REC.urls[m.id]);delete REC.urls[m.id]}S.meetings=S.meetings.filter(x=>x.id!==m.id);S.tasks=S.tasks.filter(x=>x.meetingId!==m.id);commit();toast(t('deleted'));go('meetings')},
  deleteProject(m){S.projects=S.projects.filter(x=>x.id!==m.id);S.meetings.forEach(x=>{if(x.projectId===m.id)x.projectId=null});S.tasks.forEach(x=>{if(x.projectId===m.id)x.projectId=null});commit();go('projects')},
  removeSample(){const ids=new Set(S.meetings.filter(x=>x.sample).map(x=>x.id));S.meetings=S.meetings.filter(x=>!x.sample);S.projects=S.projects.filter(x=>!x.sample);S.tasks=S.tasks.filter(x=>!x.sample&&!ids.has(x.meetingId));S.searches=[];commit();toast(t('sampleRemoved'))},
  deleteAll(){const lang=S.settings.lang;S=null;UI.onb={step:0,lang,kind:'personal',name:''};Store.flushDeleteAll()},
  discardRecording(){recCleanup();if(REC.url)URL.revokeObjectURL(REC.url);Object.assign(REC,{state:'idle',segs:[],acc:0,url:null,text:'',form:null});go('meetings')}
};
Store.flushDeleteAll=async function(){
  if(this.mode==='local'){try{localStorage.removeItem('keek-v2')}catch(e){}}
  if(this.mode==='db'){for(const k of Object.keys(this.last)){try{await this.col.doc(k).delete()}catch(e){}delete this.last[k]}}
  toast(t('allDeleted'));render();
};

/* onboarding */
A.onbLang=el=>{UI.onb.lang=el.dataset.v;render()};
A.onbKind=el=>{UI.onb.kind=el.dataset.v;render()};
A.onbNext=()=>{UI.onb.step++;render()};
A.onbBack=()=>{UI.onb.step--;render()};
A.onbFinish=el=>{
  const o=UI.onb;S=blankState();S.settings.myName=o.name.trim();S.settings.wsKind=o.kind;S.settings.wsName=o.name.trim()?t('wsOf',{n:o.name.trim().split(' ')[0]}):'';
  if(el.dataset.v==='sample')loadSampleInto();
  commit();go('dashboard');
};
function loadSampleInto(){const s=buildSample();
  S.projects.push(...s.projects.filter(p=>!S.projects.some(x=>x.id===p.id)));S.meetings.push(...s.meetings.filter(m=>!S.meetings.some(x=>x.id===m.id)));S.tasks.push(...s.tasks.filter(x=>!S.tasks.some(y=>y.id===x.id)))}
A.loadSample=()=>{loadSampleInto();commit();toast(t('sampleLoaded'));render()};
A.removeSample=()=>ask(t('removeSampleQ'),'removeSample');
A.deleteAll=()=>ask(t('deleteAllQ'),'deleteAll',{yesLabel:t('deleteAll')});
A.setLang=el=>{S.settings.lang=el.dataset.lang;commit();render()};
A.exportAll=()=>saveFile('keek-workspace.json',JSON.stringify({exportedAt:new Date().toISOString(),...S},null,2));
A.toggleSetting=el=>{const k=el.dataset.k;S.settings[k]=S.settings[k]===false;commit();render()};

/* capture: new meeting entry points */
A.newMeeting=()=>{UI.modal={type:'newMeeting'};render()};
A.goRecord=()=>{UI.modal=null;go('record')};
A.importModal=(el)=>{UI.modal={type:'import',form:{date:nowLocal(),platform:'meet',projectId:UI.route==='project'?UI.params.id:''}};render();AFTER.push(()=>$('#imTitle')?.focus());render()};
A.uploadModal=()=>{UI.modal={type:'upload'};render()};
A.attachAudio=el=>{UI.modal={type:'upload',mid:el.dataset.id};render()};
A.saveAttach=()=>{const md_=UI.modal;if(!md_.upload)return;if(REC.urls[md_.mid])URL.revokeObjectURL(REC.urls[md_.mid]);REC.urls[md_.mid]=md_.upload.url;md_.upload.kept=true;UI.modal=null;render();toast(t('audioAttached'))};
A.uploadThenImport=()=>{const u=UI.modal.upload;u.kept=true;UI.modal={type:'import',form:{date:nowLocal(),platform:'meet',title:u.name.replace(/\.[^.]+$/,''),audioUrl:u.url,audioName:u.name,audioDur:u.dur}};render()};
function newMeetingObj(f,source){
  const id='m'+uid();
  return{id,title:(f.title||'').trim()||t('untitled')+' — '+fmtDate(f.date||todayISO()),date:f.date||nowLocal(),platform:f.platform||'other',url:'',projectId:f.projectId||null,
    tags:Array.isArray(f.tags)?f.tags:splitList(f.tags),participants:Array.isArray(f.participants)?f.participants:splitList(f.participants),status:'queued',source,transcript:[],report:null,created:new Date().toISOString()};
}
A.saveImport=()=>{
  const md_=UI.modal,text=$('#imText').value;if(!text.trim()){toast(t('pasteEmpty'));return}
  const m=newMeetingObj({title:$('#imTitle').value,date:$('#imDate').value,platform:$('#imPlat').value,projectId:$('#imProj').value,participants:$('#imPart').value,tags:$('#imTags').value},md_.form.audioUrl?'upload':'import');
  m.transcript=parseTranscript(text,m.id);m.seq=m.transcript.length;
  if(!m.participants.length)m.participants=[...new Set(m.transcript.map(s=>s.sp).filter(Boolean))];
  const last=m.transcript.filter(s=>s.t!=null).at(-1);m.duration=md_.form.audioDur?Math.round(md_.form.audioDur*1000):last?last.t:0;
  if(md_.form.audioUrl)REC.urls[m.id]=md_.form.audioUrl;
  S.meetings.push(m);UI.modal=null;commit();go('meeting',{id:m.id});processMeeting(m);
};

/* browser recording (microphone only) */
A.recStart=async()=>{
  REC.state='starting';REC.err='';REC.srErr='';REC.segs=[];REC.interim='';REC.acc=0;REC.url=null;REC.segStart=null;render();
  try{if(!navigator.mediaDevices?.getUserMedia)throw{name:'NotSupported'};REC.stream=await KEEKX.captureStream(REC.form)}
  catch(e){REC.state='idle';REC.err=e.name==='NotAllowedError'||e.name==='SecurityError'?t('micDenied'):e.name==='NotFoundError'?t('micMissing'):t('micBlocked');render();return}
  REC.stream.getAudioTracks().forEach(tr=>tr.onended=()=>{if(REC.active()){REC.err=t('micDisconnected');A.recStop()}});
  try{const ac=new (window.AudioContext||window.webkitAudioContext)();const src=ac.createMediaStreamSource(REC.stream);const an=ac.createAnalyser();an.fftSize=256;src.connect(an);REC.ac=ac;REC.an=an}catch(e){}
  try{REC.chunks=[];REC.mr=new MediaRecorder(REC.stream);REC.mr.ondataavailable=e=>e.data.size&&REC.chunks.push(e.data);REC.mr.start(1000)}catch(e){REC.mr=null}
  startSR();REC.state='recording';REC.startAt=Date.now();render();REC.tick=setInterval(recTick,120);
};
function startSR(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
  const r=new SR();r.lang=REC.form.lang||'ar-EG';r.continuous=true;r.interimResults=true;
  r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){const res=e.results[i];if(res.isFinal){const x=res[0].transcript.trim();if(x)REC.segs.push({t:REC.segStart??REC.elapsed(),text:x});REC.segStart=null;REC.interim=''}else{if(REC.segStart==null)REC.segStart=REC.elapsed();REC.interim=res[0].transcript}}const el=$('#liveText');if(el){el.innerHTML=liveHtml();el.scrollTop=el.scrollHeight}};
  r.onerror=e=>{if(['not-allowed','service-not-allowed','audio-capture'].includes(e.error)){REC.srFatal=true;REC.srErr=t('srBlocked');render()}else if(e.error==='network'){REC.srFatal=true;REC.srErr=t('srNetwork');render()}};
  r.onend=()=>{if(REC.state==='recording'&&!REC.srFatal){try{r.start()}catch(e){}}};
  REC.srFatal=false;REC.sr=r;try{r.start()}catch(e){}
}
function recTick(){
  const v=fmtTs(REC.elapsed());const tm=$('#recTimer');if(tm)tm.textContent=v;const st=$('#sideTimer');if(st)st.textContent=v;
  if(REC.an&&REC.state==='recording'){const d=new Uint8Array(REC.an.frequencyBinCount);REC.an.getByteFrequencyData(d);let sum=0;for(const x of d)sum+=x;const lvl=Math.min(1,sum/d.length/90);
    $$('#recMeter i').forEach((b,i,all)=>{const x=d[Math.floor(i*d.length/all.length/1.6)]/255;b.style.height=(4+x*32)+'px'});const g=$('#recGlow');if(g)g.style.transform=`scale(${0.8+lvl*0.6})`}
}
A.recPause=()=>{REC.acc=REC.elapsed();REC.state='paused';try{REC.mr&&REC.mr.state==='recording'&&REC.mr.pause()}catch(e){}try{REC.sr&&REC.sr.stop()}catch(e){}render()};
A.recResume=()=>{REC.state='recording';REC.startAt=Date.now();try{REC.mr&&REC.mr.state==='paused'&&REC.mr.resume()}catch(e){}if(REC.sr&&!REC.srFatal){try{REC.sr.start()}catch(e){}}render()};
A.recStop=()=>{
  REC.acc=REC.elapsed();REC.state='stopped';
  if(REC.interim){REC.segs.push({t:REC.segStart??REC.acc,text:REC.interim});REC.interim=''}
  REC.text=REC.segs.map(s=>'['+fmtTsLatin(s.t)+'] '+s.text).join('\n');
  const done=()=>{if(REC.chunks&&REC.chunks.length)REC.url=URL.createObjectURL(new Blob(REC.chunks,{type:REC.mr?.mimeType||'audio/webm'}));recCleanup();render()};
  if(REC.mr&&REC.mr.state!=='inactive'){REC.mr.onstop=done;try{REC.mr.stop()}catch(e){done()}}else done();
  try{REC.sr&&REC.sr.stop()}catch(e){}render();
};
function recCleanup(){clearInterval(REC.tick);try{REC.sr&&(REC.sr.onend=null,REC.sr.abort())}catch(e){}REC.sr=null;try{REC.stream&&REC.stream.getTracks().forEach(x=>{x.onended=null;x.stop()})}catch(e){}REC.stream=null;try{REC.ac&&REC.ac.close()}catch(e){}REC.ac=null;REC.an=null}
A.recDiscard=()=>ask(t('discardQ'),'discardRecording');
A.recSave=()=>{
  const m=newMeetingObj(REC.form,'browser');m.duration=REC.acc;
  m.transcript=parseTranscript(REC.text||'',m.id);m.seq=m.transcript.length;
  if(REC.url)REC.urls[m.id]=REC.url;
  Object.assign(REC,{state:'idle',segs:[],acc:0,url:null,text:'',form:null});
  S.meetings.push(m);commit();go('meeting',{id:m.id});
  if(m.transcript.length)processMeeting(m);else{m.status='failed';m.error=t('noTranscript');commit();render()}
};

/* meeting details */
A.reprocess=el=>{const m=M(el.dataset.id);m&&processMeeting(m)};
A.deleteMeeting=el=>ask(t('deleteMeetingQ'),'deleteMeeting',{id:el.dataset.id});
A.editMeeting=el=>{UI.modal={type:'editMeeting',mid:el.dataset.id};render()};
A.saveMeeting=()=>{const m=M(UI.modal.mid);const tl=$('#emTitle').value.trim();if(!tl){toast(t('titleRequired'));return}
  m.title=tl;m.date=$('#emDate').value||m.date;m.platform=$('#emPlat').value;m.projectId=$('#emProj').value||null;m.url=$('#emUrl').value.trim();m.participants=splitList($('#emPart').value);m.tags=splitList($('#emTags').value);
  S.tasks.forEach(x=>{if(x.meetingId===m.id)x.projectId=m.projectId});UI.modal=null;commit();render();toast(t('saved'))};
A.exportModal=el=>{UI.modal={type:'export',mid:el.dataset.id};render()};
A.shareModal=el=>{UI.modal={type:'share',mid:el.dataset.id};render()};
const tText=m=>(m.transcript||[]).map(s=>`[${fmtTsLatin(s.t)}] ${s.sp?s.sp+': ':''}${s.text}`).join('\n');
A.copyTranscript=el=>copyText(tText(M(el.dataset.id)));
A.exportTxt=el=>{const m=M(el.dataset.id);saveFile(safeName(m.title)+'.txt',m.title+'\n'+(m.date||'')+'\n\n'+tText(m))};
A.exportJson=el=>{const m=M(el.dataset.id);saveFile(safeName(m.title)+'.json',JSON.stringify({...m,actionItems:liveTasks().filter(x=>x.meetingId===m.id)},null,2))};
A.exportSummary=el=>{const m=M(el.dataset.id),r=m.report,tasks=liveTasks().filter(x=>x.meetingId===m.id);const ts=refs=>(refs||[]).map(id=>'['+fmtTsLatin(segOf(m,id)?.t)+']').join(' ');
  const L=[`# ${m.title}`,`${m.date||''} — ${t('pf_'+(m.platform||'other'))}`,'',`## ${t('sOverview')}`,r.overview,'',`## ${t('sTopics')}`,(r.topics||[]).map(x=>'- '+x).join('\n'),'',`## ${t('sPoints')}`,...(r.points||[]).map(p=>`- **${p.title}**: ${p.detail} ${ts(p.refs)}`),'',`## ${t('decisions')}`,...r.decisions.map(d=>`- ${d.title} (${t('ds_'+d.status)}) ${ts(d.refs)}`),'',`## ${t('actionItems')}`,...tasks.map(x=>`- ${x.title} — ${x.owner||t('unassigned')}${x.due?' — '+x.due:''} (${t('ts_'+x.status)}) ${ts(x.refs)}`),'',`## ${t('openQuestions')}`,...(r.questions||[]).map(x=>`- ${x.text} ${ts(x.refs)}`),'',`## ${t('risks')}`,...(r.risks||[]).map(x=>`- ${x.text} ${ts(x.refs)}`),'',`## ${t('sFollowup')}`,`**${r.followup?.subject||''}**`,'',r.followup?.body||''];
  saveFile(safeName(m.title)+'.md',L.join('\n'))};
A.exportCsv=el=>{const mid=el.dataset.m;const rows=liveTasks().filter(x=>!mid||x.meetingId===mid);const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  const csv=['title,owner,owner_state,due,status,project,meeting,meeting_date,source_timestamps',...rows.map(x=>{const m=M(x.meetingId);return[x.title,x.owner,x.ownerState||'',x.due||x.dueText||'',x.status,P(x.projectId)?.name||'',m?.title||'',(m?.date||'').slice(0,10),(x.refs||[]).map(r=>fmtTsLatin(segOf(m,r)?.t)).join(' ')].map(q).join(',')})].join('\n');
  saveFile((mid?safeName(M(mid).title)+'-':'')+'action-items.csv','\ufeff'+csv)};
A.copyFollowup=el=>{const r=M(el.dataset.id).report;copyText((r.followup?.subject?r.followup.subject+'\n\n':'')+(r.followup?.body||''))};
A.regenSection=async el=>{const m=M(el.dataset.id),k=el.dataset.k,key='rg'+m.id+k;UI.busy[key]=true;render();
  try{await regenSection(m,k);commit();toast(t('sectionRegenerated'))}catch(e){toast(AI.err(e))}UI.busy[key]=false;render()};
A.renameSpeaker=el=>{UI.modal={type:'speaker',mid:el.dataset.id,from:el.dataset.v};render();AFTER.push(()=>$('#fName')?.select());render()};
A.saveSpeaker=()=>{const md_=UI.modal,to=$('#fName').value.trim();if(!to)return;const m=M(md_.mid);m.transcript.forEach(s=>{if(s.sp===md_.from)s.sp=to});m.participants=[...new Set((m.participants||[]).map(p=>p===md_.from?to:p).concat([to]))];UI.modal=null;commit();render()};
A.searchPerson=el=>{UI.sf={person:el.dataset.v};UI.smode='kw';UI.sq=el.dataset.v;go('search')};

/* review: tasks & decisions */
const TK=id=>S.tasks.find(y=>y.id===id);
A.toggleTask=el=>{const x=TK(el.dataset.id);x.status=x.status==='completed'?'open':'completed';x.completedAt=x.status==='completed'?todayISO():null;x.review=false;commit();render()};
A.confirmOwner=el=>{const x=TK(el.dataset.id);x.ownerState='confirmed';commit();render()};
A.approveTask=el=>{const x=TK(el.dataset.id);x.review=false;commit();render()};
A.dismissTask=el=>{const x=TK(el.dataset.id);x.dismissed=true;x.review=false;commit();render();toast(t('dismissed'))};
A.editTask=el=>{UI.modal={type:'task',task:{...TK(el.dataset.id)}};render()};
A.addTask=el=>{const mid=el.dataset.m||null,m=mid?M(mid):null;UI.modal={type:'task',isNew:true,task:{id:'t-'+uid(),title:'',description:'',owner:null,ownerState:null,due:null,status:'open',meetingId:mid,projectId:m?m.projectId:null,refs:[],confidence:'high',review:false,manual:true}};render();AFTER.push(()=>$('#fTitle')?.focus());render()};
A.saveTask=()=>{const x=UI.modal.task;x.title=$('#fTitle').value.trim();if(!x.title){toast(t('titleRequired'));return}
  const owner=$('#fOwner').value.trim()||null;if(owner!==x.owner)x.ownerState=owner?'confirmed':null;x.owner=owner;
  x.description=$('#fDesc').value.trim();x.due=$('#fDue').value||null;const st=$('#fStat').value;if(st!==x.status){x.status=st;x.completedAt=st==='completed'?todayISO():null}x.projectId=$('#fProj').value||null;x.review=false;x.edited=true;
  const i=S.tasks.findIndex(y=>y.id===x.id);if(i>=0)S.tasks[i]=x;else S.tasks.push(x);UI.modal=null;commit();render()};
A.deleteTask=el=>{S.tasks=S.tasks.filter(y=>y.id!==el.dataset.id);UI.modal=null;commit();render()};
A.editDecision=el=>{const d=M(el.dataset.m).report.decisions.find(y=>y.id===el.dataset.id);UI.modal={type:'decision',mid:el.dataset.m,dec:{...d}};render()};
A.addDecision=el=>{UI.modal={type:'decision',mid:el.dataset.m,isNew:true,dec:{id:'d-'+uid(),title:'',description:'',refs:[],confidence:'high',status:'confirmed',manual:true}};render();AFTER.push(()=>$('#fTitle')?.focus());render()};
A.saveDecision=()=>{const md_=UI.modal,d=md_.dec;d.title=$('#fTitle').value.trim();if(!d.title){toast(t('titleRequired'));return}d.description=$('#fDesc').value.trim();
  const r=M(md_.mid).report;const i=r.decisions.findIndex(y=>y.id===d.id);if(i>=0)r.decisions[i]=d;else r.decisions.push(d);UI.modal=null;commit();render()};
A.deleteDecision=()=>{const md_=UI.modal,r=M(md_.mid).report;r.decisions=r.decisions.filter(y=>y.id!==md_.dec.id);UI.modal=null;commit();render()};
A.taskFilter=el=>{UI.filters.tf=el.dataset.v;render()};

/* projects */
A.newProject=()=>{UI.modal={type:'project'};render();AFTER.push(()=>$('#fName')?.focus());render()};
A.saveProject=()=>{const n=$('#fName').value.trim();if(!n){toast(t('titleRequired'));return}const p={id:'p'+uid(),name:n,desc:$('#fDesc').value.trim(),created:todayISO(),archived:false};S.projects.push(p);UI.modal=null;commit();go('project',{id:p.id})};
A.deleteProject=el=>ask(t('deleteProjectQ'),'deleteProject',{id:el.dataset.id});
A.archiveProject=el=>{const p=P(el.dataset.id);p.archived=!p.archived;commit();render();toast(p.archived?t('archivedToast'):t('unarchivedToast'))};
A.pArch=el=>{UI.filters.parch=el.dataset.v;render()};
A.askProject=el=>{UI.sf={project:el.dataset.id};UI.smode='ai';UI.sq='';go('search');AFTER.push(()=>$('#sInput')?.focus());render()};
A.projectOverview=async el=>{
  const p=P(el.dataset.id),key='po'+p.id;UI.busy[key]=true;render();
  const ctx=buildContext({type:'project',ids:[p.id]},p.name);
  try{const txt=await AI.text(`Write a short project status overview for "${p.name}" (${p.desc||''}) in ${S.settings.lang==='ar'?'Arabic':'English'} using ONLY the material below. Use markdown "## " headings: current status, key decisions, open work and blockers, open questions. Max 180 words. Do not invent anything; say when something is unknown.\n\nMaterial:\n${ctx.text}`);
    S.usage.ai=(S.usage.ai||0)+1;p.overview={text:txt,at:new Date().toISOString()};commit()}catch(e){toast(AI.err(e))}
  UI.busy[key]=false;render();
};

/* AI search */
A.dashAsk=()=>{const q=$('#dashAsk')?.value.trim();if(!q)return;UI.sq=q;UI.smode='ai';UI.sf={};go('search');A.runSearch()};
A.smode=el=>{UI.smode=el.dataset.v;UI.sq=$('#sInput')?.value||UI.sq;UI.params={};render()};
A.suggest=el=>{UI.sq=el.dataset.v;render();A.runSearch()};
A.openSearch=el=>{const x=S.searches.find(s=>s.id===el.dataset.id);UI.sq=x.q;UI.smode='ai';UI.sf=x.filters||{};UI.params={sid:x.id};render()};
A.newSearch=()=>{UI.sq='';UI.params={};render();AFTER.push(()=>$('#sInput')?.focus());render()};
A.runSearch=async()=>{
  const q=($('#sInput')?.value??UI.sq).trim();if(!q)return;UI.sq=q;
  if(UI.smode==='kw'){render();return}
  if(!AI.ok()){toast(t('aiUnavailable'));return}
  const f=UI.sf||{},ms=filterMeetings(f);
  const ctx=buildContext({type:'meetings',ids:ms.map(m=>m.id)},q);
  const x={id:'s'+uid(),q,filters:{...f},answer:'',srcs:ctx.srcs,lines:ctx.text.split('\n').map(l=>l.replace(/^\[\d+\]\s*\([^)]*\)\s*/,'')),pending:true,at:new Date().toISOString()};
  S.searches.unshift(x);UI.params={sid:x.id};UI.busy.search=true;render();
  if(!ctx.srcs.length){x.pending=false;x.answer=t('noSourcesInScope');x.confidence='low';UI.busy.search=false;commit();render();return}
  const prompt=`You are KEEK's meeting memory. Today is ${todayISO()}. Answer the user's question using ONLY the numbered sources from their meetings.
Rules:
- Retrieve before you answer: base every statement on the sources and cite them inline with their numbers in square brackets right after each claim, e.g. [3] or [3][7].
- Prefer transcript sources. Items marked "AI summary" or "AI-extracted" were produced by a model; when a transcript line supports the claim, cite the transcript line.
- Never invent decisions, commitments, owners or dates. If the sources do not contain enough information, say clearly that the available meeting records do not provide enough information.
- Start with a direct answer in one or two sentences, then supporting detail as short "- " bullets. No headings.
- If you add your own recommendation, put it at the end in a paragraph starting with "${S.settings.lang==='ar'?'اقتراح:':'Suggestion:'}".
- Reply in the language of the question.
- Last line exactly: CONFIDENCE: high | medium | low (how well the sources support the answer).

Sources:
${ctx.text}

Question: ${q}`;
  try{
    const out=await AI.text(prompt,txt=>{x.answer=txt;const b=$('#answerBox');if(b&&UI.params.sid===x.id)b.innerHTML=`<div class="sec-head" style="margin-bottom:10px"><b>${esc(x.q)}</b></div>`+answerHtml(x)});
    S.usage.ai=(S.usage.ai||0)+1;x.answer=out;const c=out.match(/CONFIDENCE:\s*(high|medium|low)/i);x.confidence=c?c[1].toLowerCase():'medium';
  }catch(e){x.error=AI.err(e)}
  x.pending=false;UI.busy.search=false;S.searches=S.searches.slice(0,20);commit();render();
};

/* settings: microphone test */
A.micTest=async()=>{
  try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const ac=new (window.AudioContext||window.webkitAudioContext)();const an=ac.createAnalyser();an.fftSize=256;ac.createMediaStreamSource(st).connect(an);
    UI.micTest={st,ac,an,peak:0};UI.micTestMsg=t('speakNow');render();
    UI.micTest.iv=setInterval(()=>{const d=new Uint8Array(an.frequencyBinCount);an.getByteFrequencyData(d);let s=0;for(const v of d)s+=v;const lvl=s/d.length;UI.micTest.peak=Math.max(UI.micTest.peak,lvl);
      $$('#testMeter i').forEach((b,i,all)=>{const v=d[Math.floor(i*d.length/all.length/1.6)]/255;b.style.height=(4+v*20)+'px'})},100);
    UI.micTest.to=setTimeout(()=>A.micTestStop(),8000);
  }catch(e){UI.micTestMsg=e.name==='NotAllowedError'?t('micDenied'):t('micBlocked');render()}
};
A.micTestStop=()=>{const m=UI.micTest;if(!m)return;clearInterval(m.iv);clearTimeout(m.to);m.st.getTracks().forEach(x=>x.stop());m.ac.close().catch(()=>{});UI.micTestMsg=m.peak>8?t('micOk'):t('micSilent');UI.micTest=null;render()};

/* ---------- event wiring ---------- */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.disabled)return;const f=A[el.dataset.act];if(f)f(el,e)});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&UI.modal){UI.modal=null;render()}
  if(e.key==='Enter'&&!e.isComposing){if(e.target.id==='dashAsk'){e.preventDefault();A.dashAsk()}else if(e.target.id==='sInput'){e.preventDefault();A.runSearch()}}
  if(e.target.matches('[data-edit]')&&e.key==='Enter'&&!e.shiftKey&&!['fuBody','overview'].includes(e.target.dataset.edit)){e.preventDefault();e.target.blur()}
});
const mlistRefresh=debounce(()=>{const a=$('#mlist');if(a)a.innerHTML=LISTS.mcol()},120);
const listRefresh=debounce(()=>{const a=$('#listArea');const f=LISTS[UI.route];if(a&&f){a.innerHTML=f();const hc=$('#hitCount');if(hc&&UI.route==='meeting')hc.textContent=UI.q?t('nHits',{n:fmtNum($$('.seg-row').length)}):''}},120);
document.addEventListener('input',e=>{
  const el=e.target,k=el.dataset.in;if(!k)return;
  if(k==='q'){UI.q=el.value;listRefresh()}
  else if(k==='mq'){UI.mq=el.value;mlistRefresh()}
  else if(k==='recForm')REC.form[el.dataset.k]=el.value;
  else if(k==='recText')REC.text=el.value;
  else if(k==='onbName')UI.onb.name=el.value;
});
document.addEventListener('change',e=>{
  const el=e.target,k=el.dataset.ch;if(!k)return;
  if(k==='filter'){UI.filters[el.dataset.k]=el.value;render()}
  else if(k==='recForm')REC.form[el.dataset.k]=el.value;
  else if(k==='consent'){REC.form.consent=el.checked;render()}
  else if(k==='sf'){UI.sf[el.dataset.k]=el.value;UI.params={};render()}
  else if(k==='taskStatus'){const x=TK(el.dataset.id);x.status=el.value;x.completedAt=el.value==='completed'?todayISO():null;x.review=false;commit();render()}
  else if(k==='decStatus'){const d=M(el.dataset.m).report.decisions.find(y=>y.id===el.dataset.id);d.status=el.value;commit();render()}
  else if(k==='assignMeeting'&&el.value){const m=M(el.value);m.projectId=el.dataset.id;S.tasks.forEach(x=>{if(x.meetingId===m.id)x.projectId=m.projectId});commit();render()}
  else if(k==='setting'){S.settings[el.dataset.k]=el.value.trim?el.value.trim():el.value;commit();render();toast(t('saved'))}
  else if(k==='audioFile'){const f=el.files[0];if(!f||!UI.modal)return;if(UI.modal.upload&&!UI.modal.upload.kept)URL.revokeObjectURL(UI.modal.upload.url);const url=URL.createObjectURL(f);UI.modal.upload={name:f.name,size:f.size,url};render();const a=new Audio();a.preload='metadata';a.src=url;a.onloadedmetadata=()=>{if(UI.modal&&UI.modal.upload&&UI.modal.upload.url===url){UI.modal.upload.dur=a.duration;render()}}}
});
document.addEventListener('focusout',e=>{
  const el=e.target,k=el.dataset?.edit;if(!k)return;
  const v=el.innerText.trim(),id=el.dataset.id;
  if(k==='meetingTitle'){const m=M(id);if(v&&m.title!==v){m.title=v;commit()}}
  else if(k==='segText'){const m=M(id),s=segOf(m,el.dataset.s);if(s&&v!==s.text){if(!s.orig)s.orig=s.text;s.text=v;s.editedAt=new Date().toISOString();commit();toast(t('saved'))}}
  else if(k==='overview'){const r=M(id).report;if(r.overview!==v){r.overview=v;r.edited=true;commit()}}
  else if(k==='pointTitle'||k==='pointDetail'){const p=M(id).report.points[+el.dataset.i];const f=k==='pointTitle'?'title':'detail';if(p[f]!==v){p[f]=v;M(id).report.edited=true;commit()}}
  else if(k==='listItem'){const it=M(id).report[el.dataset.k][+el.dataset.i];if(it.text!==v){it.text=v;M(id).report.edited=true;commit()}}
  else if(k==='fuSubject'||k==='fuBody'){const r=M(id).report;r.followup=r.followup||{};const f=k==='fuSubject'?'subject':'body';const val=k==='fuBody'?el.innerText:v;if(r.followup[f]!==val){r.followup[f]=val;commit()}}
  else if(k==='projectName'){if(v){P(id).name=v;commit()}}
  else if(k==='projectDesc'){if(v!==t('addDescription')){P(id).desc=v;commit()}}
});
window.addEventListener('beforeunload',e=>{Store.flush();if(REC.active()){e.preventDefault();e.returnValue=''}});

KEEKX.install();

/* ---------- boot ---------- */
(async()=>{
  render();
  await KEEKX.init();await Store.init();
  try{S=await Store.load()}catch(e){console.error(e);Store.mode=Store.mode==='db'?'local':Store.mode;try{S=await Store.load()}catch(_){S=null}toast(t('loadFailed'))}
  if(S){const b=blankState();S.settings=Object.assign(b.settings,S.settings);S.searches=S.searches||[];S.usage=S.usage||{ai:0};S.tasks=S.tasks||[];
    S.meetings.forEach(m=>{if(['queued','transcribing','analyzing','indexing'].includes(m.status)){m.status='failed';m.error=t('interrupted')}});}
  UI.ready=true;render();KEEKX.afterBoot();
})();


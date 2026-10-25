(() => {
  "use strict";

  const state = {
    lab: "lab1",
    operation: "addition",
    selected: new Set(),
    signals: [],
    resultText: "",
    lastResult: null,
    language: localStorage.getItem("dsp-language") || "en",
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const homeView = $("#homeView");
  const labView = $("#labView");
  const signalList = $("#signalList");
  const count = $("#selectionCount");
  const constantBox = $("#constantBox");
  const constantInput = $("#constantInput");
  const hint = $("#operationHint");
  const runButton = $("#runButton");
  const emptyState = $("#emptyState");
  const resultView = $("#resultView");
  const toast = $("#toast");
  const chartImage = $("#signalChart");
  const topbar = $("#topbar");
  const navToggle = $(".nav-toggle");
  const navLinks = $("#mainNav");
  const navIndicator = $(".nav-indicator");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let toastTimer;
  let signalsLoaded = false;
  let navCurrent = "home";
  let relayoutHero = () => {};
  let booted = false;

  const ICON_INFO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>';

  const translations = {
    en: {
      skip: "Skip to content", navHome: "Home", navTeam: "Team", exploreLabs: "Explore labs", meetTeam: "Meet the team",
      navLabs: "Labs", labsTitle: "Labs", mainNavLabel: "Main navigation", homeLabel: "DSP Studio home", openMenu: "Open navigation", heroSignalLabel: "Animated digital signal", waveTypeLabel: "Choose waveform", scopeLabel: "Interactive oscilloscope controlled by frequency and amplitude",
      activeLab: "Active lab", testCases: "Test cases", department: "Department", playgroundSection: "01 / SIGNAL PLAYGROUND", teamSection: "02 / THE TEAM", arithmeticOps: "Arithmetic Operations", ready: "READY", labAvailable: "LAB AVAILABLE", labDirectory: "LABORATORY DIRECTORY", inputSignals: "INPUT SIGNALS", operationLabel: "OPERATION", analysisOutput: "ANALYSIS OUTPUT", signalView: "SIGNAL VIEW",
      heroTitle: "See the signal.<br><span>Understand what is inside.</span>",
      heroCopy: "A hands-on <strong>Digital Signal Processing</strong> workspace for SC students at the Faculty of Computer and Information Sciences — Ain Shams University.",
      playgroundTitle: "Shape the signal<br><span>your way.</span>", playgroundCopy: "Adjust frequency and amplitude, explore different waveforms, and move the pointer across the screen to shape the signal in real time.",
      scopeTip: "Move the pointer inside the screen to influence the signal", teamTitle: "The minds <span>behind the signal.</span>",
      teamCopy: "A student project for the Digital Signal Processing course — Scientific Computing Department.",
      omarName: "Omar Ahmed Mohamed Aboulhassan", abdelrahmanName: "Abdelrahman Atef Sayed Abdellah", backHome: "Back home",
      omarInitial: "O", abdelrahmanInitial: "A", scStudent: "SC STUDENT", sine: "Sine", superposition: "Superposition", discrete: "Discrete", frequency: "Frequency", amplitude: "Amplitude",
      chooseLabTitle: "Choose a lab to get started", chooseLabCopy: "Every practical experiment will appear here. Select a lab from the left sidebar to open its workspace.", waitingChoice: "Waiting for your choice",
      labIntro: "Choose the signals and operation, then run the experiment to inspect and validate the result.", chooseSignals: "Choose signals", chooseOperation: "Choose operation",
      addSignals: "Add two signals", multiplyConstant: "Multiply by constant", constantValue: "Constant value", runCompare: "Run and compare result",
      resultHere: "Your result will appear here", resultHint: "Choose signals and an operation, then run the experiment.", downloadResult: "Download result", discreteRepresentation: "Discrete representation",
      selected: "selected", samples: "samples", addHint: "You can add any two signals. Official tests: <b>Signal1 + Signal2</b> and <b>Signal1 + Signal3</b>.",
      multiplyHint: "You can use any number. Official tests: <b>Signal1 × 5</b> and <b>Signal2 × 10</b>.", chooseFirstTwo: "Choose two signals first.", chooseFirstOne: "Choose one signal first.",
      running: "Running experiment...", loadError: "Could not load the signals.", runError: "Could not run the operation.", freeDone: "Experiment completed, but it is not part of the official tests.",
      testPassed: "The test passed and the result matches.", testFailed: "The test did not pass.", freeTitle: "Not included in the tests", passTitle: "PASS — correct result", failTitle: "FAIL — review the calculations",
      freeMessage: "This experiment is not included in the official tests, so its result cannot be confirmed as correct or incorrect.", passMessage: "The result matches the official test file.", failMessage: "The result does not match the expected file.",
      sampleCount: "Sample count", minimum: "Minimum", maximum: "Maximum", average: "Average", pause: "Pause", play: "Play",
      officialTest: "OFFICIAL TEST", freeExperiment: "FREE EXPERIMENT", noBenchmark: "NO OFFICIAL BENCHMARK", activeLabName: "LAB 1 / ARITHMETIC OPERATIONS",
    },
    ar: {
      skip: "انتقل إلى المحتوى", navHome: "الرئيسية", navTeam: "الفريق", exploreLabs: "استكشف اللابات", meetTeam: "تعرّف على الفريق",
      navLabs: "اللابات", labsTitle: "اللابات", mainNavLabel: "التنقل الرئيسي", homeLabel: "الصفحة الرئيسية لاستوديو DSP", openMenu: "فتح القائمة", heroSignalLabel: "رسم متحرك لموجة رقمية", waveTypeLabel: "اختر نوع الإشارة", scopeLabel: "راسم إشارة تفاعلي يتحكم فيه التردد والاتساع",
      activeLab: "لاب متاح", testCases: "حالات اختبار", department: "القسم", playgroundSection: "01 / تجربة الإشارات", teamSection: "02 / الفريق", arithmeticOps: "العمليات الحسابية", ready: "جاهز", labAvailable: "لاب متاح", labDirectory: "دليل اللابات", inputSignals: "الإشارات المدخلة", operationLabel: "العملية", analysisOutput: "نتيجة التحليل", signalView: "عرض الإشارة",
      heroTitle: "نرى الإشارة.<br><span>نفهم ما بداخلها.</span>",
      heroCopy: "منصة عملية لمقرر <strong>Digital Signal Processing</strong> لطلاب قسم SC بكلية الحاسبات والمعلومات — جامعة عين شمس.",
      playgroundTitle: "شكّل الإشارة<br><span>بإيدك.</span>", playgroundCopy: "غيّر التردد والـAmplitude، وجرّب أنواعًا مختلفة من الإشارات، وحرّك المؤشر فوق الشاشة لترى استجابة الموجة لحظيًا.",
      scopeTip: "حرّك المؤشر داخل الشاشة لتؤثر على الإشارة", teamTitle: "العقول <span>وراء الإشارة.</span>",
      teamCopy: "مشروع طلابي لمقرر Digital Signal Processing — قسم Scientific Computing.",
      omarName: "عمر أحمد محمد أبوالحسن", abdelrahmanName: "عبدالرحمن عاطف سيد عبداللاه", backHome: "العودة للرئيسية",
      omarInitial: "ع", abdelrahmanInitial: "ع", scStudent: "طالب SC", sine: "موجة جيبية", superposition: "تراكب الإشارات", discrete: "عينات منفصلة", frequency: "التردد", amplitude: "الاتساع",
      chooseLabTitle: "اختار اللاب اللي عايز تبدأه", chooseLabCopy: "كل التجارب العملية هتظهر هنا. اختار لاب من القائمة الموجودة ناحية الشمال لفتح مساحة العمل.", waitingChoice: "في انتظار اختيارك",
      labIntro: "اختر الإشارات والعملية، ثم شغّل التجربة لمشاهدة الناتج والتحقق منه.", chooseSignals: "اختر الإشارات", chooseOperation: "اختر العملية",
      addSignals: "جمع إشارتين", multiplyConstant: "ضرب في رقم", constantValue: "قيمة الثابت", runCompare: "تشغيل ومقارنة النتيجة",
      resultHere: "النتيجة ستظهر هنا", resultHint: "اختر الإشارات والعملية ثم شغّل التجربة.", downloadResult: "تنزيل النتيجة", discreteRepresentation: "التمثيل المنفصل",
      selected: "محدد", samples: "عينة", addHint: "تقدر تجمع أي إشارتين. الاختبارات الرسمية: <b>Signal1 + Signal2</b> و<b>Signal1 + Signal3</b>.",
      multiplyHint: "تقدر تستخدم أي رقم. الاختبارات الرسمية: <b>Signal1 × 5</b> و<b>Signal2 × 10</b>.", chooseFirstTwo: "اختر إشارتين أولًا.", chooseFirstOne: "اختر إشارة واحدة أولًا.",
      running: "جاري تشغيل التجربة...", loadError: "تعذر تحميل الإشارات.", runError: "تعذر تنفيذ العملية.", freeDone: "تم تنفيذ التجربة، لكنها غير موجودة ضمن الاختبارات الرسمية.",
      testPassed: "الاختبار نجح والنتيجة مطابقة.", testFailed: "الاختبار لم ينجح.", freeTitle: "غير موجودة في الاختبارات", passTitle: "PASS — النتيجة صحيحة", failTitle: "FAIL — راجع الحسابات",
      freeMessage: "هذه التجربة غير موجودة ضمن الاختبارات الرسمية، لذلك لا يمكن تأكيد أن النتيجة صحيحة أو خاطئة.", passMessage: "النتيجة مطابقة لملف الاختبار الرسمي.", failMessage: "النتيجة غير مطابقة للملف المتوقع.",
      sampleCount: "عدد العينات", minimum: "أقل قيمة", maximum: "أعلى قيمة", average: "المتوسط", pause: "إيقاف", play: "تشغيل",
      officialTest: "اختبار رسمي", freeExperiment: "تجربة حرة", noBenchmark: "لا يوجد اختبار رسمي", activeLabName: "لاب 1 / العمليات الحسابية",
    },
  };

  Object.assign(translations.en, {lab2Ops: "Arithmetic & Quantization", subtraction: "Subtract signals", squaring: "Square signal", normalization: "Normalize signal", accumulation: "Accumulate signal", quantization: "Quantize signal", normalizationRange: "Normalization range", quantizationMode: "Quantization input", quantizationNumber: "Bits / levels", bits: "Number of bits", levels: "Number of levels", interval: "Interval", encoded: "Encoded level", quantized: "Quantized", error: "Error", lab2Hint: "Use the supplied Lab 2 inputs. Subtraction uses the absolute difference expected by the official files. Quantization tests: Quan1 with 3 bits; Quan2 with 4 levels.", lab2Title: "Arithmetic & <em>Quantization</em>", lab2Name: "LAB 2 / ARITHMETIC & QUANTIZATION"});
  Object.assign(translations.ar, {lab2Ops: "العمليات الحسابية والتكميم", subtraction: "طرح الإشارات", squaring: "تربيع الإشارة", normalization: "تطبيع الإشارة", accumulation: "تجميع الإشارة", quantization: "تكميم الإشارة", normalizationRange: "نطاق التطبيع", quantizationMode: "مدخل التكميم", quantizationNumber: "عدد البتات / المستويات", bits: "عدد البتات", levels: "عدد المستويات", interval: "الفترة", encoded: "ترميز المستوى", quantized: "القيمة المكممة", error: "الخطأ", lab2Hint: "استخدم ملفات المدخلات الموجودة لتاسك 2. الطرح يستخدم الفرق المطلق طبقًا لملفات الناتج. اختبارات التكميم: Quan1 مع 3 بتات، وQuan2 مع 4 مستويات.", lab2Title: "العمليات الحسابية <em>والتكميم</em>", lab2Name: "لاب 2 / العمليات الحسابية والتكميم"});

  Object.assign(translations.en, {
    subtractionHint: "You can subtract any two signals. Official tests: <b>Signal1 − Signal2</b> and <b>Signal1 − Signal3</b> (absolute difference).",
    squaringHint: "You can square any signal. Official test: <b>Signal1 squared</b>.",
    normalizationHint: "You can normalize any signal. Official tests: <b>Signal1 from −1 to 1</b> and <b>Signal2 from 0 to 1</b>.",
    accumulationHint: "You can accumulate any signal. Official test: <b>Accumulation of Signal1</b>.",
    quantizationHint: "You can choose bits or levels. Official tests: <b>Quan1_input with 3 bits (8 levels)</b> and <b>Quan2_input with 4 levels (2 bits)</b>.",
  });
  Object.assign(translations.ar, {
    subtractionHint: "تقدر تطرح أي إشارتين. الاختبارات الرسمية: <b>Signal1 − Signal2</b> و<b>Signal1 − Signal3</b> (الفرق المطلق).",
    squaringHint: "تقدر تربّع أي إشارة. الاختبار الرسمي: <b>تربيع Signal1</b>.",
    normalizationHint: "تقدر تطبّع أي إشارة. الاختبارات الرسمية: <b>Signal1 من −1 إلى 1</b> و<b>Signal2 من 0 إلى 1</b>.",
    accumulationHint: "تقدر تجمع عينات أي إشارة تراكميًا. الاختبار الرسمي: <b>التجميع التراكمي لـ Signal1</b>.",
    quantizationHint: "تقدر تختار عدد البتات أو المستويات. الاختبارات الرسمية: <b>Quan1_input مع 3 بتات (8 مستويات)</b> و<b>Quan2_input مع 4 مستويات (2 بت)</b>.",
  });

  Object.assign(translations.en, {
    lab4Ops: "Frequency Domain", lab4Title: "Frequency <em>Domain</em>", lab4Name: "LAB 4 / FREQUENCY DOMAIN",
    dft: "Fourier transform (DFT)", idft: "Reconstruct signal (IDFT)", removeDc: "Remove DC component", modify: "Modify a component",
    samplingFrequency: "Sampling frequency (Hz)", componentIndex: "Component index k", newAmplitude: "New amplitude", newPhase: "New phase (rad)",
    normalizedAmplitude: "Normalized A", dominantFrequencies: "Dominant frequencies",
    dftHint: "You can apply DFT to any signal with any Fs. Official test: <b>input_Signal_DFT</b> with any Fs (e.g. <b>4 Hz</b>) → <b>Output_Signal_DFT_A,Phase</b>.",
    idftHint: "Official test: <b>Input_Signal_IDFT_A,Phase</b> → <b>Output_Signal_IDFT</b> = {1, 3, 5, 7, 9, 11, 13, 15}.",
    remove_dcHint: "You can remove DC from any signal. Official test: <b>DC_component_input</b> → <b>DC_component_output</b>.",
    modifyHint: "No official test file. Change A or φ of X(k) and leave the other empty: X(N−k) gets the same A and −φ. Try: <b>input_Signal_DFT, k = 1, A = 0</b> or <b>k = 2, φ = 1</b>.",
  });
  Object.assign(translations.ar, {
    lab4Ops: "المجال الترددي", lab4Title: "المجال <em>الترددي</em>", lab4Name: "لاب 4 / المجال الترددي",
    dft: "تحويل فورييه (DFT)", idft: "إعادة بناء الإشارة (IDFT)", removeDc: "حذف مركبة DC", modify: "تعديل مركبة",
    samplingFrequency: "تردد العينات (Hz)", componentIndex: "رقم المركبة k", newAmplitude: "الـAmplitude الجديد", newPhase: "الـPhase الجديد (rad)",
    normalizedAmplitude: "A بعد التطبيع", dominantFrequencies: "الترددات السائدة",
    dftHint: "تقدر تعمل DFT لأي إشارة بأي Fs. الاختبار الرسمي: <b>input_Signal_DFT</b> بأي Fs (مثلًا <b>4 Hz</b>) ← <b>Output_Signal_DFT_A,Phase</b>.",
    idftHint: "الاختبار الرسمي: <b>Input_Signal_IDFT_A,Phase</b> ← <b>Output_Signal_IDFT</b> = {1, 3, 5, 7, 9, 11, 13, 15}.",
    remove_dcHint: "تقدر تشيل الـDC من أي إشارة. الاختبار الرسمي: <b>DC_component_input</b> ← <b>DC_component_output</b>.",
    modifyHint: "مفيش ملف اختبار رسمي. غيّر A أو φ للمركبة X(k) وسيب التانية فاضية: X(N−k) بتاخد نفس A و −φ. جرّب: <b>input_Signal_DFT و k = 1 و A = 0</b> أو <b>k = 2 و φ = 1</b>.",
  });

  const t = (key) => translations[state.language][key] || translations.en[key] || key;
  const labTitle = () => state.lab === "lab4" ? t("lab4Title") : state.lab === "lab2" ? t("lab2Title") : "Arithmetic <em>Operations</em>";
  const currentLabName = () => t(state.lab === "lab4" ? "lab4Name" : state.lab === "lab2" ? "lab2Name" : "activeLabName");

  /* ---------- the shared colour ramp: indigo to blue to sky ---------- */
  const COLORMAP_STOPS = [
    [0, 0x0b1022], [0.35, 0x2b2f7a], [0.55, 0x5e5ce6], [0.75, 0x0a84ff], [0.9, 0x40c8ff], [1, 0xb4ecff],
  ];
  const LUT = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i += 1) {
    const v = i / 255;
    let s = 0;
    while (s < COLORMAP_STOPS.length - 2 && v > COLORMAP_STOPS[s + 1][0]) s += 1;
    const [p0, c0] = COLORMAP_STOPS[s];
    const [p1, c1] = COLORMAP_STOPS[s + 1];
    const f = (v - p0) / (p1 - p0);
    for (let ch = 0; ch < 3; ch += 1) {
      const shift = 16 - ch * 8;
      const a = (c0 >> shift) & 255;
      const b = (c1 >> shift) & 255;
      LUT[i * 3 + ch] = a + (b - a) * f;
    }
  }
  const mapColor = (v) => {
    const i = Math.max(0, Math.min(255, Math.round(v * 255))) * 3;
    return `rgb(${LUT[i]},${LUT[i + 1]},${LUT[i + 2]})`;
  };

  function applyLanguage(language) {
    state.language = language === "ar" ? "ar" : "en";
    localStorage.setItem("dsp-language", state.language);
    document.documentElement.lang = state.language;
    document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
    $$("[data-i18n-html]").forEach((element) => { element.innerHTML = t(element.dataset.i18nHtml); });
    $$("[data-i18n-aria]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAria)); });
    $$(".signal-select select").forEach((select) => select.dispatchEvent(new Event("change")));
    $("#languageToggle .lang-text").textContent = state.language === "en" ? "العربية" : "English";
    const pauseButton = $("#oscPause");
    if (pauseButton) {
      pauseButton.querySelector("span").textContent = t(pauseButton.classList.contains("paused") ? "play" : "pause");
    }
    if (!$("#lab1Workspace").hidden) $("#activeLabName").textContent = currentLabName();
    else if (!$("#lab3Workspace").hidden) $("#activeLabName").textContent = "LAB 3 / QUIZ";
    else $("#activeLabName").textContent = t("labsTitle").toUpperCase();
    $("#workspaceTitle").innerHTML = labTitle();
    if (state.signals.length) renderSignals();
    updateOperationHint();
    if (state.lastResult) renderResult(state.lastResult);
    requestAnimationFrame(() => {
      updateNavIndicator();
      relayoutHero();
      window.dispatchEvent(new Event("resize"));
    });
  }

  function showToast(message, error = false) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast-message show${error ? " error" : ""}`;
    toastTimer = setTimeout(() => (toast.className = "toast-message"), 3300);
  }

  /* ---------- navigation ---------- */
  function setMenu(open) {
    topbar.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  function closeMobileNav() {
    setMenu(false);
  }

  function updateNavIndicator() {
    if (!navIndicator || getComputedStyle(navIndicator).display === "none") return;
    const target = navCurrent === "labs" ? $(".nav-lab-btn") : $(`.nav-link[data-nav="${navCurrent}"]`);
    if (!target) return;
    navIndicator.style.width = `${target.offsetWidth}px`;
    navIndicator.style.height = `${target.offsetHeight}px`;
    navIndicator.style.top = `${target.offsetTop}px`;
    navIndicator.style.transform = `translateX(${target.offsetLeft}px)`;
    navIndicator.classList.add("ready");
  }

  function setNavCurrent(key) {
    if (navCurrent === key && navIndicator.classList.contains("ready")) return;
    navCurrent = key;
    $$(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.nav === key));
    $(".nav-lab-btn").classList.toggle("active", key === "labs");
    updateNavIndicator();
  }

  function showView(name, updateHash = true) {
    const labsActive = name === "labs";
    const changing = labsActive ? labView.hidden : homeView.hidden;
    const swap = () => {
      homeView.hidden = labsActive;
      labView.hidden = !labsActive;
      homeView.classList.toggle("is-active", !labsActive);
      labView.classList.toggle("is-active", labsActive);
      document.body.classList.toggle("labs-mode", labsActive);
      setNavCurrent(labsActive ? "labs" : "home");
      if (updateHash) history.pushState(null, "", labsActive ? "#labs" : "#home");
      window.scrollTo({ top: 0, behavior: changing || reduceMotion ? "auto" : "smooth" });
      closeMobileNav();
      if (labsActive) resetLabSelection();
      else relayoutHero();
      updateScrollState();
    };
    if (booted && changing && document.startViewTransition && !reduceMotion) {
      return document.startViewTransition(swap).updateCallbackDone.catch(() => {});
    }
    swap();
    return Promise.resolve();
  }

  function resetLabSelection() {
    $("#labsEmptyState").hidden = false;
    $("#lab1Workspace").hidden = true;
    $("#lab3Workspace").hidden = true;
    $("#activeLabName").textContent = t("labsTitle").toUpperCase();
    $$("[data-lab]").forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });
  }

  function selectLab(labName, updateHash = true) {
    if (!["lab1", "lab2", "lab3", "lab4"].includes(labName)) return;
    $("#lab3Workspace").hidden = labName !== "lab3";
    if (labName === "lab3") {
      $("#labsEmptyState").hidden = true;
      $("#lab1Workspace").hidden = true;
      $("#activeLabName").textContent = "LAB 3 / QUIZ";
      $$("[data-lab]").forEach((button) => {
        button.classList.toggle("active", button.dataset.lab === "lab3");
        button.setAttribute("aria-pressed", String(button.dataset.lab === "lab3"));
      });
      fetch("/api/lab3").then((response) => response.json()).then((data) => { $("#lab3Message").textContent = data.message; });
      if (updateHash) history.pushState(null, "", "#labs/lab3");
      return;
    }
    const changed = state.lab !== labName;
    state.lab = labName;
    $("#workspaceTitle").innerHTML = labTitle();
    $("#lab2Operations").hidden = labName !== "lab2";
    $("#lab4Operations").hidden = labName !== "lab4";
    $("[data-operation='addition']").parentElement.hidden = labName !== "lab1";
    if (changed) {
      state.lastResult = null;
      resultView.hidden = true;
      emptyState.hidden = false;
      setOperation({ lab1: "addition", lab2: "subtraction", lab4: "dft" }[labName]);
      signalsLoaded = true;
    }
    $("#labsEmptyState").hidden = true;
    $("#lab1Workspace").hidden = false;
    $("#activeLabName").textContent = currentLabName();
    $$("[data-lab]").forEach((button) => {
      const active = button.dataset.lab === labName;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (!signalsLoaded) loadSignals();
    if (updateHash) history.pushState(null, "", `#labs/${labName}`);
  }

  $$("[data-open-labs]").forEach((button) => button.addEventListener("click", () => showView("labs")));
  $$("[data-lab]").forEach((button) => button.addEventListener("click", () => selectLab(button.dataset.lab)));
  $$('[data-view-link="home"]').forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    showView("home");
  }));
  $$("[data-scroll-link]").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    const scroll = () => $(link.getAttribute("href"))?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    closeMobileNav();
    if (homeView.hidden) showView("home").then(() => requestAnimationFrame(scroll));
    else scroll();
  }));
  navToggle.addEventListener("click", () => setMenu(!topbar.classList.contains("menu-open")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && topbar.classList.contains("menu-open")) {
      closeMobileNav();
      navToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (topbar.classList.contains("menu-open") && !topbar.contains(event.target)) closeMobileNav();
  });

  function routeFromHash() {
    if (["#labs/lab1", "#lab1", "#labs/lab2", "#lab2", "#labs/lab3", "#lab3", "#labs/lab4", "#lab4"].includes(location.hash)) {
      showView("labs", false);
      selectLab(location.hash.slice(-4), false);
    } else if (location.hash === "#labs") {
      showView("labs", false);
    } else {
      showView("home", false);
    }
  }

  window.addEventListener("popstate", routeFromHash);

  /* scroll: bar state, the colorbar progress, and which home section is current */
  const progressBar = $("#scrollProgress");
  const teamSection = $("#team");
  let scrollFrame = 0;
  function updateScrollState() {
    scrollFrame = 0;
    topbar.classList.toggle("scrolled", scrollY > 24);
    const total = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.setProperty("--p", total > 0 ? Math.min(1, scrollY / total).toFixed(4) : "0");
    if (!homeView.hidden) {
      const inTeam = teamSection.getBoundingClientRect().top < innerHeight * 0.55;
      setNavCurrent(inTeam ? "team" : "home");
    }
  }
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
  }, { passive: true });
  window.addEventListener("resize", () => {
    updateNavIndicator();
    if (innerWidth > 900) closeMobileNav();
  });

  /* ---------- Lab 1 ---------- */
  const LAB4_FOLDERS = { "input_Signal_DFT.txt": "DFT", "DC_component_input.txt": "Remove DC component", "Input_Signal_IDFT_A,Phase.txt": "IDFT" };

  function shortName(name) {
    return name.replace(/\.txt$/i, "");
  }

  function formatNumber(value) {
    return Number(value).toLocaleString("en-US", { maximumFractionDigits: 3 });
  }

  function loadSignals() {
    state.signals = ["Signal1.txt", "Signal2.txt", "signal3.txt"];
    state.selected = new Set(["Signal1.txt", "Signal2.txt"]);
    signalsLoaded = true;
    renderSignals();
  }

  function renderSignals() {
    signalList.innerHTML = state.signals.map((signal, index) => {
      const selected = state.selected.has(signal);
      return `<button type="button" class="signal-card${selected ? " selected" : ""}" data-signal="${signal}" aria-pressed="${selected}">
        <span class="signal-index">S${index + 1}</span>
        <span><strong>${shortName(signal)}</strong><small>${state.lab === "lab1" ? "Lab 1/inputs" : state.lab === "lab4" ? "Lab 4/Test/" + LAB4_FOLDERS[signal] : "Lab 2/Inputs/" + (state.operation === "quantization" ? "Quantization" : "Arthimatic")}/${signal}</small></span>
        <span class="check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></span>
      </button>`;
    }).join("");
    $$(".signal-card").forEach((button) => button.addEventListener("click", () => toggleSignal(button.dataset.signal)));
    count.textContent = `${state.selected.size} ${t("selected")}`;
  }

  function toggleSignal(name) {
    const limit = ["addition", "subtraction"].includes(state.operation) ? 2 : 1;
    if (state.selected.has(name)) state.selected.delete(name);
    else {
      if (state.selected.size >= limit) state.selected.clear();
      state.selected.add(name);
    }
    renderSignals();
  }

  function setOperation(operation) {
    state.operation = operation;
    $$(".operation").forEach((button) => {
      const active = button.dataset.operation === operation;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    constantBox.hidden = operation !== "multiplication";
    $("#normalizationBox").hidden = operation !== "normalization";
    $("#quantizationBox").hidden = operation !== "quantization";
    $("#lab4Box").hidden = !["dft", "modify"].includes(operation);
    $("#modifyBox").hidden = operation !== "modify";
    state.signals = operation === "quantization" ? ["Quan1_input.txt", "Quan2_input.txt"]
      : operation === "idft" ? ["Input_Signal_IDFT_A,Phase.txt"]
      : ["dft", "remove_dc", "modify"].includes(operation) ? ["input_Signal_DFT.txt", "DC_component_input.txt"]
      : ["Signal1.txt", "Signal2.txt", "signal3.txt"];
    if (["addition", "subtraction"].includes(operation)) {
      state.selected = new Set(["Signal1.txt", "Signal2.txt"]);
    } else {
      state.selected = new Set([operation === "remove_dc" ? "DC_component_input.txt" : state.signals[0]]);
      constantInput.value = "5";
    }
    updateOperationHint();
    renderSignals();
  }

  function updateOperationHint() {
    if (!hint) return;
    const key = state.lab !== "lab1" ? `${state.operation}Hint` : state.operation === "addition" ? "addHint" : "multiplyHint";
    hint.innerHTML = `<span>${ICON_INFO}</span><p>${t(key)}</p>`;
  }

  async function runLab() {
    const required = ["addition", "subtraction"].includes(state.operation) ? 2 : 1;
    if (state.selected.size !== required) {
      showToast(t(required === 2 ? "chooseFirstTwo" : "chooseFirstOne"), true);
      return;
    }
    runButton.disabled = true;
    runButton.querySelector("span").textContent = t("running");
    try {
      const response = await fetch(`/api/${state.lab}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: state.operation, signals: [...state.selected], constant: constantInput.value, lower: $("#normalizationRange").value, mode: $("#quantizationMode").value, number: $("#quantizationNumber").value, fs: $("#samplingFrequency").value, component: $("#componentIndex").value, amplitude: $("#componentAmplitude").value, phase: $("#componentPhase").value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("runError"));
      renderResult(data);
      if (!data.test) {
        showToast(t("freeDone"));
      } else {
        const passed = data.test.includes("passed successfully");
        showToast(t(passed ? "testPassed" : "testFailed"), !passed);
      }
    } catch (error) {
      showToast(error.message, true);
    } finally {
      runButton.disabled = false;
      runButton.querySelector("span").textContent = t("runCompare");
    }
  }

  function renderResult(data) {
    state.lastResult = data;
    emptyState.hidden = true;
    resultView.hidden = false;
    const tested = data.test !== "";
    const passed = data.test.includes("passed successfully");
    $("#equation").textContent = data.equation;
    const verdict = $("#verdict");
    verdict.classList.toggle("fail", tested && !passed);
    verdict.classList.toggle("unverified", !tested);
    $("#verdictLabel").textContent = t(tested ? "officialTest" : "freeExperiment");
    $("#verdictTitle").textContent = !tested ? t("freeTitle") : t(passed ? "passTitle" : "failTitle");
    $("#verdictText").textContent = tested ? data.test : t("freeMessage");
    $("#expectedFile").textContent = data.expected || t("noBenchmark");
    chartImage.src = data.plot;
    $("#quantizationResults").hidden = !data.encoded;
    const squaredErrors = data.encoded ? data.errors.map((error) => error * error) : [];
    const averagePowerError = squaredErrors.length ? squaredErrors.reduce((total, error) => total + error, 0) / squaredErrors.length : 0;
    $("#quantizationRows").innerHTML = data.encoded ? data.indices.map((n, i) => `<tr><td>${n}</td><td>${data.input_values[i]}</td><td>${data.intervals[i]}</td><td><code>${data.encoded[i]}</code></td><td>${data.values[i]}</td><td>${data.errors[i]}</td><td>${squaredErrors[i].toFixed(6)}</td></tr>`).join("") : "";
    $("#powerError").hidden = !data.encoded;
    $("#powerErrorValue").textContent = averagePowerError.toFixed(6);
    $("#dftResults").hidden = !data.amplitudes;
    $("#dominantBox").hidden = !data.dominant;
    $("#dftRows").innerHTML = data.amplitudes ? data.frequencies.map((f, k) => `<tr><td>${k}</td><td>${formatNumber(f)}</td><td>${formatNumber(data.amplitudes[k])}</td>${data.normalized ? `<td>${formatNumber(data.normalized[k])}</td>` : ""}<td>${formatNumber(data.phases[k])}</td></tr>`).join("") : "";
    $("#normalizedHead").hidden = !data.normalized;
    $("#dominantValue").textContent = data.dominant ? data.dominant.map(formatNumber).join(", ") : "";
    $("#executionPath").textContent = state.lab === "lab1" ? "task1.py / Task1Test.py / expected output" : state.lab === "lab4" ? (!data.expected ? "Task4.py" : `Task4.py / ${data.expected === "DC_component_output.txt" ? "CompareSignals.py" : "signalcompare.py"} / expected output`) : `task2.py / ${data.expected === "Quan1_Out.txt" ? "QuanTest1.py" : data.expected === "Quan2_Out.txt" ? "QuanTest2.py" : "ArithmeticTest.py"} / expected output`;
    state.resultText = data.dominant ?["1", "0", data.amplitudes.length, ...data.amplitudes.map((a, k) => `${a} ${data.phases[k]}`)].join("\n") + "\n" : ["0", "0", data.values.length,...data.indices.map((n, i) => data.encoded ? (data.expected === "Quan1_Out.txt" ? `${data.encoded[i]} ${data.values[i]}` : `${data.intervals[i]} ${data.encoded[i]} ${data.values[i]} ${data.errors[i]}`) : `${n} ${data.values[i]}`)].join("\n") + "\n";
  }

  $$(".operation").forEach((button) => button.addEventListener("click", () => setOperation(button.dataset.operation)));
  $$("[data-preset]").forEach((button) => button.addEventListener("click", () => {
    const value = button.dataset.preset;
    constantInput.value = value;
    state.selected = new Set([value === "5" ? "Signal1.txt" : "Signal2.txt"]);
    renderSignals();
  }));
  $$("[data-modify-preset]").forEach((button) => button.addEventListener("click", () => {
    const [index, amplitude, phase] = button.dataset.modifyPreset.split(",");
    $("#componentIndex").value = index;
    $("#componentAmplitude").value = amplitude;
    $("#componentPhase").value = phase;
    state.selected = new Set(["input_Signal_DFT.txt"]);
    renderSignals();
  }));
  $$("[data-quant-preset]").forEach((button) => button.addEventListener("click", () => {
    const first = button.dataset.quantPreset === "1";
    $("#quantizationMode").value = first ? "bits" : "levels";
    $("#quantizationMode").dispatchEvent(new Event("change"));
    $("#quantizationNumber").value = first ? "3" : "4";
    state.selected = new Set([first ? "Quan1_input.txt" : "Quan2_input.txt"]);
    renderSignals();
  }));
  runButton.addEventListener("click", runLab);
  $("#downloadButton").addEventListener("click", () => {
    const blob = new Blob([state.resultText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = `${state.lab}-result.txt`; link.click();
    URL.revokeObjectURL(link.href);
  });

  function initSignalSelects() {
    $$(".constant-box select").forEach((select) => {
      const wrapper = document.createElement("div");
      wrapper.className = "signal-select";
      select.before(wrapper);
      wrapper.append(select);
      select.hidden = true;

      const label = $(`label[for="${select.id}"]`);
      label.id = `${select.id}Label`;

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.id = `${select.id}Trigger`;
      trigger.className = "form-select signal-select-trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-labelledby", `${label.id} ${trigger.id}`);
      label.htmlFor = trigger.id;

      const menu = document.createElement("div");
      menu.id = `${select.id}Options`;
      menu.className = "signal-select-menu";
      menu.setAttribute("role", "listbox");
      menu.setAttribute("aria-labelledby", label.id);
      menu.hidden = true;
      trigger.setAttribute("aria-controls", menu.id);
      wrapper.append(trigger, menu);

      function closeMenu() {
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      }

      function refresh() {
        trigger.textContent = select.selectedOptions[0].textContent;
        menu.replaceChildren();
        [...select.options].forEach((option) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "signal-select-option";
          item.textContent = option.textContent;
          item.setAttribute("role", "option");
          item.setAttribute("aria-selected", String(option.selected));
          item.tabIndex = -1;
          item.addEventListener("click", () => {
            select.value = option.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            closeMenu();
            trigger.focus();
          });
          menu.append(item);
        });
      }

      function openMenu(last = false) {
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        const items = [...menu.children];
        const selected = items.find((item) => item.getAttribute("aria-selected") === "true");
        (last ? items[items.length - 1] : selected || items[0]).focus();
      }

      trigger.addEventListener("click", () => menu.hidden ? openMenu() : closeMenu());
      wrapper.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
          trigger.focus();
          event.preventDefault();
        } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          if (menu.hidden) {
            openMenu(event.key === "End");
          } else {
            const items = [...menu.children];
            const current = items.indexOf(document.activeElement);
            const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 :
              (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
            items[next].focus();
          }
        } else if (event.key === "Tab") {
          closeMenu();
        }
      });
      document.addEventListener("pointerdown", (event) => {
        if (!wrapper.contains(event.target)) closeMenu();
      });
      wrapper.addEventListener("focusout", (event) => {
        if (!wrapper.contains(event.relatedTarget)) closeMenu();
      });
      select.addEventListener("change", refresh);
      refresh();
    });
  }

  /* ---------- hero: a 3D signal surface (Three.js) and the live time-domain trace ---------- */
  function initHeroTrace() {
    const canvas = $(".lane-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const TAU = Math.PI * 2;
    let width = 0;
    let height = 0;
    let time = 0;
    let running = false;
    let visible = true;
    let last = 0;

    function resize() {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width;
      height = box.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // x[n]: a gently modulated harmonic signal, 320 samples across the card
    const valueAt = (u) => {
      const p = u * TAU * 5.5;
      return (
        Math.sin(p - time * 2.2) * (0.62 + 0.18 * Math.sin(time * 0.5)) +
        0.28 * Math.sin(2 * p - time * 3.1 + 0.6) +
        0.14 * Math.sin(3 * p + time * 1.7)
      ) / 1.05;
    };

    function draw() {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const mid = height / 2;
      const amp = height * 0.38;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(width, mid);
      ctx.stroke();

      const points = [];
      const steps = Math.max(80, Math.floor(width / 3));
      for (let i = 0; i <= steps; i += 1) {
        const u = i / steps;
        points.push([u * width, mid - valueAt(u) * amp]);
      }
      // soft area under the curve, like a stocks chart
      const area = ctx.createLinearGradient(0, mid - amp, 0, mid + amp);
      area.addColorStop(0, "rgba(10,132,255,0.28)");
      area.addColorStop(1, "rgba(10,132,255,0)");
      ctx.beginPath();
      ctx.moveTo(0, mid);
      points.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(width, mid);
      ctx.closePath();
      ctx.fillStyle = area;
      ctx.fill();

      const line = ctx.createLinearGradient(0, 0, width, 0);
      line.addColorStop(0, "#a9a8ff");
      line.addColorStop(0.55, "#d6ecff");
      line.addColorStop(1, "#ffffff");
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = line;
      ctx.lineWidth = 2.4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      const [hx, hy] = points[points.length - 1];
      ctx.fillStyle = "rgba(100,210,255,0.25)";
      ctx.beginPath();
      ctx.arc(hx - 3, hy, 9, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(hx - 3, hy, 4, 0, TAU);
      ctx.fill();
    }

    function frame(now) {
      if (!running) return;
      time += Math.min(0.05, (now - last) / 1000);
      last = now;
      draw();
      requestAnimationFrame(frame);
    }
    function sync() {
      const should = visible && !document.hidden && !homeView.hidden && !reduceMotion;
      if (should === running) return;
      running = should;
      if (running) {
        last = performance.now();
        requestAnimationFrame(frame);
      }
    }
    relayoutHero = () => {
      resize();
      draw();
      sync();
      hero3dSync();
    };
    new ResizeObserver(() => { resize(); draw(); }).observe(canvas);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(canvas);
    document.addEventListener("visibilitychange", sync);
    resize();
    draw();
    sync();
  }

  let hero3dSync = () => {};
  async function initHero3D() {
    const canvas = $("#hero3d");
    const hero = $("#home");
    if (!canvas || !hero) return;
    let THREE;
    try {
      THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
    } catch (error) {
      return; // the ambient glass field still carries the hero without WebGL
    }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    } catch (error) {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 3.4, 11);
    camera.lookAt(0, -0.4, 0);

    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerAmp: { value: 0 },
    };
    const geometry = new THREE.PlaneGeometry(26, 9, 280, 110);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform float uPointerAmp;
        varying float vHeight;
        varying vec3 vNormal;
        varying vec3 vView;
        varying float vFade;
        varying float vLine;
        float wave(vec2 p) {
          float h = 0.0;
          h += 0.62 * sin(p.x * 0.42 - uTime * 0.7);
          h += 0.32 * sin(p.x * 0.95 + p.y * 0.38 - uTime * 1.1);
          h += 0.16 * sin(p.x * 1.9 - p.y * 0.55 + uTime * 0.9);
          h += 0.22 * sin(p.y * 0.75 + uTime * 0.45);
          float d = distance(p, uPointer);
          h += uPointerAmp * 0.55 * sin(d * 2.2 - uTime * 3.6) * exp(-d * 0.38);
          return h;
        }
        void main() {
          vec3 p = position;
          vec2 q = p.xz;
          float h = wave(q);
          float e = 0.04;
          float hx = wave(q + vec2(e, 0.0));
          float hz = wave(q + vec2(0.0, e));
          vec3 n = normalize(vec3(-(hx - h) / e, 1.0, -(hz - h) / e));
          p.y += h;
          vHeight = h;
          vNormal = normalize(normalMatrix * n);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vView = -mv.xyz;
          vFade = smoothstep(13.0, 6.0, abs(p.x)) * smoothstep(4.6, 1.2, abs(p.z));
          vLine = fract(p.z * 1.6);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying float vHeight;
        varying vec3 vNormal;
        varying vec3 vView;
        varying float vFade;
        varying float vLine;
        void main() {
          vec3 n = normalize(vNormal);
          vec3 v = normalize(vView);
          float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.6);
          vec3 light = normalize(vec3(-0.35, 0.85, 0.55));
          vec3 halfway = normalize(light + v);
          float spec = pow(max(dot(n, halfway), 0.0), 70.0);
          float t = clamp(vHeight * 0.48 + 0.5, 0.0, 1.0);
          vec3 deep = vec3(0.05, 0.08, 0.28);
          vec3 indigo = vec3(0.37, 0.36, 0.90);
          vec3 blue = vec3(0.04, 0.52, 1.0);
          vec3 sky = vec3(0.39, 0.82, 1.0);
          vec3 col = mix(deep, indigo, smoothstep(0.0, 0.45, t));
          col = mix(col, blue, smoothstep(0.35, 0.75, t));
          col = mix(col, sky, smoothstep(0.72, 1.0, t) * 0.8);
          float diffuse = max(dot(n, light), 0.0) * 0.45 + 0.55;
          col *= diffuse;
          col += fresnel * vec3(0.55, 0.75, 1.0) * 0.55 + spec * 0.9;
          float lines = smoothstep(0.04, 0.0, abs(vLine - 0.5) - 0.46) * 0.18;
          col += lines * vec3(0.6, 0.85, 1.0);
          gl_FragColor = vec4(col, vFade * (0.78 + fresnel * 0.22));
        }
      `,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -1.9, 0);
    mesh.rotation.y = -0.12;
    scene.add(mesh);

    let running = false;
    let visible = true;
    let last = 0;
    let targetAmp = 0;
    const pointerTarget = new THREE.Vector2(0, 0);

    function resize() {
      const box = hero.getBoundingClientRect();
      if (!box.width || !box.height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(box.width, box.height, false);
      camera.aspect = box.width / box.height;
      // keep the surface in the lower half on any aspect
      camera.position.z = box.width < 700 ? 15 : 11;
      camera.updateProjectionMatrix();
    }
    function render() {
      renderer.render(scene, camera);
    }
    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      uniforms.uTime.value += dt;
      uniforms.uPointer.value.lerp(pointerTarget, 0.08);
      uniforms.uPointerAmp.value += (targetAmp - uniforms.uPointerAmp.value) * 0.05;
      render();
      requestAnimationFrame(frame);
    }
    hero3dSync = () => {
      const should = visible && !document.hidden && !homeView.hidden && !reduceMotion;
      if (should === running) return;
      running = should;
      if (running) {
        last = performance.now();
        requestAnimationFrame(frame);
      }
    };
    hero.addEventListener("pointermove", (event) => {
      const box = hero.getBoundingClientRect();
      const nx = (event.clientX - box.left) / box.width;
      const ny = (event.clientY - box.top) / box.height;
      pointerTarget.set((nx - 0.5) * 22, (ny - 0.55) * 8);
      targetAmp = 1;
    });
    hero.addEventListener("pointerleave", () => { targetAmp = 0; });
    new ResizeObserver(() => { resize(); render(); }).observe(hero);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; hero3dSync(); }).observe(hero);
    document.addEventListener("visibilitychange", hero3dSync);
    resize();
    render();
    canvas.classList.add("is-ready");
    hero3dSync();
  }

  /* ---------- signal playground (structure and interaction unchanged) ---------- */
  function initSignalPlayground() {
    const oscCanvas = $("#heroOscilloscope");
    if (!oscCanvas) return;
    const context = oscCanvas.getContext("2d");
    const freqSlider = $("#oscFreqSlider");
    const ampSlider = $("#oscAmpSlider");
    const freqValue = $("#oscFreqVal");
    const ampValue = $("#oscAmpVal");
    const formula = $("#oscFormula");
    const modeLabel = $("#oscMode");
    const pauseButton = $("#oscPause");
    const crosshair = $(".scope-crosshair");
    const formulas = {
      sine: ["SINE WAVE", "y(t) = A·sin(2πft)"],
      superposition: ["SUPERPOSITION", "y(t) = A₁·sin(ω₁t) + A₂·cos(ω₂t)"],
      discrete: ["DISCRETE STEM", "x[n] = A·sin(2πfn / Fs)"],
      modulation: ["AM MODULATION", "y(t) = [1 + m·cos(ωₘt)]·sin(ωct)"],
    };
    const osc = {
      wave: "sine", frequency: 4, amplitude: 1, time: 0,
      paused: reduceMotion, visible: true, pointer: { x: -1000, y: -1000, active: false },
    };
    const BUCKETS = 12;
    const bucketColors = Array.from({ length: BUCKETS }, (_, i) => mapColor(0.5 + (0.5 * i) / (BUCKETS - 1)));

    function resizeOscilloscope() {
      const rect = oscCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      oscCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
      oscCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // a sliding glass thumb behind the waveform options, like the nav
    const selector = $(".wave-selector");
    const waveThumb = document.createElement("span");
    waveThumb.className = "wave-indicator";
    waveThumb.setAttribute("aria-hidden", "true");
    selector.prepend(waveThumb);
    selector.classList.add("has-indicator");
    function moveWaveThumb() {
      const active = $(".wave-selector button.active");
      if (!active || !active.offsetWidth) return;
      waveThumb.style.width = `${active.offsetWidth}px`;
      waveThumb.style.height = `${active.offsetHeight}px`;
      waveThumb.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
      waveThumb.classList.add("ready");
    }
    new ResizeObserver(moveWaveThumb).observe(selector);
    window.addEventListener("resize", moveWaveThumb);
    if (document.fonts?.ready) document.fonts.ready.then(moveWaveThumb);

    function setWave(wave) {
      osc.wave = wave;
      $$(".wave-selector button").forEach((button) => {
        const active = button.dataset.wave === wave;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      moveWaveThumb();
      modeLabel.textContent = formulas[wave][0];
      formula.textContent = formulas[wave][1];
    }

    function disturbance(x) {
      if (!osc.pointer.active) return 0;
      const distance = Math.abs(x - osc.pointer.x);
      return distance < 105 ? Math.sin(distance * 0.09) * 25 * (1 - distance / 105) : 0;
    }

    function strokeWave(width, color, lineWidth, valueAtX, alpha = 1) {
      context.save();
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.globalAlpha = alpha;
      context.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const y = valueAtX(x);
        if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
      context.restore();
    }

    // the trace takes the colormap: distance from the axis is energy
    function strokeMapped(width, lineWidth, valueAtX, centerY, amp) {
      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      let px = 0;
      let py = valueAtX(0);
      for (let x = 2; x <= width + 2; x += 2) {
        const y = valueAtX(x);
        const energy = Math.min(1, Math.abs((py + y) / 2 - centerY) / Math.max(1, amp));
        const bucket = Math.min(BUCKETS - 1, Math.floor(energy * BUCKETS));
        paths[bucket].moveTo(px, py);
        paths[bucket].lineTo(x, y);
        px = x; py = y;
      }
      context.save();
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      paths.forEach((path, index) => {
        context.strokeStyle = bucketColors[index];
        context.stroke(path);
      });
      context.restore();
    }

    function drawOscilloscope() {
      const rect = oscCanvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (!width || !height || !osc.visible || document.hidden) {
        requestAnimationFrame(drawOscilloscope);
        return;
      }
      if (oscCanvas.width !== Math.floor(width * (window.devicePixelRatio || 1)) || oscCanvas.height !== Math.floor(height * (window.devicePixelRatio || 1))) resizeOscilloscope();
      if (!osc.paused) osc.time += 0.018;
      const centerY = height / 2;
      const amp = osc.amplitude * Math.min(82, height * 0.25);
      const t = osc.time;
      const freq = osc.frequency;

      const gradient = context.createRadialGradient(width * 0.5, centerY, 0, width * 0.5, centerY, width * 0.65);
      gradient.addColorStop(0, "rgba(16,26,58,0.55)");
      gradient.addColorStop(1, "rgba(4,7,16,0.2)");
      context.clearRect(0, 0, width, height);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.lineWidth = 1;
      for (let x = 0; x <= width; x += 40) {
        context.strokeStyle = x % 200 === 0 ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.035)";
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
      }
      for (let y = centerY % 40; y <= height; y += 40) {
        context.strokeStyle = Math.abs(y - centerY) < 4 ? "rgba(10,132,255,.35)" : "rgba(255,255,255,.035)";
        context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
      }

      if (osc.wave === "discrete") {
        const stems = Math.max(24, Math.floor(width / 22));
        const step = width / stems;
        for (let index = 0; index <= stems; index += 1) {
          const x = index * step;
          const value = Math.sin(index * 0.15 * freq - t * 2.2) * amp;
          const y = centerY - value + disturbance(x);
          const energy = Math.min(1, Math.abs(y - centerY) / Math.max(1, amp));
          context.strokeStyle = "rgba(94, 92, 230, 0.75)";
          context.lineWidth = 1.4;
          context.beginPath(); context.moveTo(x, centerY); context.lineTo(x, y); context.stroke();
          context.fillStyle = bucketColors[Math.min(BUCKETS - 1, Math.floor(energy * BUCKETS))];
          context.beginPath(); context.arc(x, y, 3.4, 0, Math.PI * 2); context.fill();
        }
      } else if (osc.wave === "superposition") {
        const first = (x) => centerY - Math.sin((x / 62) * freq + t * 2) * amp * 0.5;
        const second = (x) => centerY - Math.cos((x / 62) * freq * 1.5 + t * 2.7) * amp * 0.5;
        strokeWave(width, "#5e5ce6", 1.5, first, 0.75);
        strokeWave(width, "#64d2ff", 1.5, second, 0.6);
        strokeMapped(width, 2.6, (x) => first(x) + second(x) - centerY + disturbance(x), centerY, amp);
      } else if (osc.wave === "modulation") {
        strokeMapped(width, 2.1, (x) => {
          const envelope = 1 + 0.48 * Math.sin((x / 125) * freq * 0.38 + t);
          return centerY - envelope * Math.sin((x / 24) * freq * 2.2 + t * 3.2) * amp * 0.42 + disturbance(x);
        }, centerY, amp * 0.62);
      } else {
        strokeMapped(width, 2.2, (x) => centerY - Math.sin((x / 68) * freq + t * 2.5) * amp + disturbance(x), centerY, amp);
      }
      requestAnimationFrame(drawOscilloscope);
    }

    const paintFill = (slider) => {
      const ratio = (slider.value - slider.min) / (slider.max - slider.min);
      slider.style.setProperty("--fill", `${(ratio * 100).toFixed(1)}%`);
    };
    [freqSlider, ampSlider].forEach((slider) => {
      paintFill(slider);
      slider.addEventListener("input", () => paintFill(slider));
    });
    $$(".wave-selector button").forEach((button) => button.addEventListener("click", () => setWave(button.dataset.wave)));
    freqSlider.addEventListener("input", () => {
      osc.frequency = Number(freqSlider.value);
      freqValue.value = `${osc.frequency} Hz`;
    });
    ampSlider.addEventListener("input", () => {
      osc.amplitude = Number(ampSlider.value);
      ampValue.value = osc.amplitude.toFixed(1);
    });
    pauseButton.addEventListener("click", () => {
      osc.paused = !osc.paused;
      pauseButton.classList.toggle("paused", osc.paused);
      pauseButton.setAttribute("aria-pressed", String(osc.paused));
      pauseButton.querySelector("span").textContent = t(osc.paused ? "play" : "pause");
    });
    oscCanvas.addEventListener("pointermove", (event) => {
      const rect = oscCanvas.getBoundingClientRect();
      osc.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
      crosshair.style.left = `${osc.pointer.x}px`;
      crosshair.style.top = `${osc.pointer.y}px`;
    });
    oscCanvas.addEventListener("pointerleave", () => {
      osc.pointer.active = false;
      crosshair.style.left = "50%";
      crosshair.style.top = "50%";
    });
    new IntersectionObserver(([entry]) => { osc.visible = entry.isIntersecting; }, { threshold: 0.05 }).observe(oscCanvas);
    window.addEventListener("resize", resizeOscilloscope);
    if (reduceMotion) {
      pauseButton.classList.add("paused");
      pauseButton.setAttribute("aria-pressed", "true");
      pauseButton.querySelector("span").textContent = t("play");
    }
    resizeOscilloscope();
    requestAnimationFrame(drawOscilloscope);
  }

  // the course chip sits beside the language key on desktop and inside the menu on mobile
  const courseChip = $(".course-chip");
  const mobileNav = matchMedia("(max-width: 991.98px)");
  const placeCourseChip = () => {
    if (mobileNav.matches) navLinks.append(courseChip);
    else $("#languageToggle").after(courseChip);
    updateNavIndicator();
  };
  mobileNav.addEventListener("change", placeCourseChip);
  placeCourseChip();

  $("#languageToggle").addEventListener("click", () => applyLanguage(state.language === "en" ? "ar" : "en"));
  initHeroTrace();
  initHero3D();
  initSignalPlayground();
  initSignalSelects();
  applyLanguage(state.language);
  routeFromHash();
  booted = true;
  updateScrollState();
  if (document.fonts?.ready) document.fonts.ready.then(updateNavIndicator);
})();

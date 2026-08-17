/**
 * GirlGangPlusTax // Interactive Engine & Monospace Features
 * Built for Smart India Hackathon (SIH) 2026
 */

(function () {
  'use strict';

  /* ==========================================================================
     01. Audio Feedback Synthesizer (Web Audio API)
     ========================================================================== */
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq = 600, type = 'sine', duration = 0.04, gainVal = 0.03) {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio policy restrictions
    }
  }

  function playKeyClick() {
    // Soft mechanical click
    playTone(700 + Math.random() * 200, 'triangle', 0.03, 0.02);
  }

  function playSuccessChime() {
    if (!sfxEnabled) return;
    setTimeout(() => playTone(523.25, 'sine', 0.08, 0.05), 0);
    setTimeout(() => playTone(659.25, 'sine', 0.08, 0.05), 70);
    setTimeout(() => playTone(783.99, 'sine', 0.12, 0.06), 140);
  }

  /* Sound Toggle Setup */
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundStatusText = document.getElementById('soundStatusText');
  const soundIcon = document.getElementById('soundIcon');

  // Load sound preference from localStorage
  const savedSfx = localStorage.getItem('gg_sfx_enabled');
  if (savedSfx !== null) {
    sfxEnabled = savedSfx === 'true';
    updateSoundUI();
  }

  function updateSoundUI() {
    if (soundStatusText) soundStatusText.textContent = sfxEnabled ? 'ON' : 'MUTED';
    if (soundIcon) soundIcon.textContent = sfxEnabled ? '🔊' : '🔇';
    if (soundToggleBtn) {
      soundToggleBtn.classList.toggle('muted', !sfxEnabled);
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      localStorage.setItem('gg_sfx_enabled', sfxEnabled.toString());
      updateSoundUI();
      if (sfxEnabled) playSuccessChime();
    });
  }

  // Play subtle clicks on all interactive buttons
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, .btn, .nav-link, .mobile-nav-link, .cmd-chip, input[type="range"]');
    if (target && target.id !== 'soundToggleBtn') {
      playKeyClick();
    }
  });

  /* ==========================================================================
     02. Typewriter Effect (Hero Subtitle)
     ========================================================================== */
  const typewriterPhrases = [
    "Turning 3 AM chai & chaos into national-level solutions.",
    "100% caffeine, 0% compromise. SIH 2026 Ready.",
    "Engineering resilient microservices & edge AI for public good.",
    "Building tech that survives aggressive jury edge cases.",
    "git commit -m 'Trust the process & push to main'."
  ];

  const dynamicTypewriter = document.getElementById('dynamicTypewriter');
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 50;

  function typeWriterLoop() {
    if (!dynamicTypewriter) return;

    const currentPhrase = typewriterPhrases[phraseIndex];

    if (isDeleting) {
      dynamicTypewriter.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 25;
    } else {
      dynamicTypewriter.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 55;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
      typeSpeed = 500; // Pause before new phrase
    }

    setTimeout(typeWriterLoop, typeSpeed);
  }

  /* ==========================================================================
     03. Mobile Drawer Navigation & Scroll Highlighting
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) closeDrawer();
      else openDrawer();
    });
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Back to top button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active Navigation link observer
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  /* ==========================================================================
     04. Team Role Filter System
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const memberCards = document.querySelectorAll('.member-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      memberCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  /* ==========================================================================
     05. Interactive "+ Tax" Calculator Widget
     ========================================================================== */
  const hoursInput = document.getElementById('hoursInput');
  const chaiInput = document.getElementById('chaiInput');
  const bugsInput = document.getElementById('bugsInput');
  const panicInput = document.getElementById('panicInput');

  const hoursVal = document.getElementById('hoursVal');
  const chaiVal = document.getElementById('chaiVal');
  const bugsVal = document.getElementById('bugsVal');
  const panicVal = document.getElementById('panicVal');

  const taxScoreNum = document.getElementById('taxScoreNum');
  const taxVerdict = document.getElementById('taxVerdict');
  const taxCaffeineResult = document.getElementById('taxCaffeineResult');
  const taxGitRisk = document.getElementById('taxGitRisk');
  const taxWinProb = document.getElementById('taxWinProb');
  const recalibrateTaxBtn = document.getElementById('recalibrateTaxBtn');

  function calculateTax() {
    if (!hoursInput || !chaiInput || !bugsInput || !panicInput) return;

    const hours = parseInt(hoursInput.value, 10);
    const chai = parseInt(chaiInput.value, 10);
    const bugs = parseInt(bugsInput.value, 10);
    const panic = parseInt(panicInput.value, 10);

    // Update labels
    if (hoursVal) hoursVal.textContent = `${hours} hrs`;
    if (chaiVal) chaiVal.textContent = `${chai} cups`;
    if (bugsVal) bugsVal.textContent = `${bugs} bugs`;
    
    let panicLabel = 'Calm (20%)';
    if (panic > 75) panicLabel = `Unhinged Chaos (${panic}%)`;
    else if (panic > 45) panicLabel = `Controlled Chaos (${panic}%)`;
    else if (panic > 25) panicLabel = `Mild Anxiety (${panic}%)`;
    if (panicVal) panicVal.textContent = panicLabel;

    // Mathematical Tax Formula
    const baseScore = (hours * 0.35) + (chai * 2.5) + (bugs * 0.4) + (panic * 0.25);
    const normalizedScore = Math.min(99.9, Math.max(45.0, baseScore)).toFixed(1);

    if (taxScoreNum) taxScoreNum.textContent = normalizedScore;

    // Caffeine level
    if (taxCaffeineResult) {
      if (chai > 15) taxCaffeineResult.textContent = 'Transcendental (Chai Overlord)';
      else if (chai > 7) taxCaffeineResult.textContent = 'High (Hyper-focused)';
      else taxCaffeineResult.textContent = 'Optimal (Steady Energy)';
    }

    // Git risk
    if (taxGitRisk) {
      if (panic > 70 || hours > 48) taxGitRisk.textContent = 'High (Conflict on Line 420)';
      else if (panic > 40) taxGitRisk.textContent = 'Moderate (Merge with Prayers)';
      else taxGitRisk.textContent = 'Low (Clean Rebasing)';
    }

    // Win probability
    if (taxWinProb) {
      const winChance = (94.0 + (parseFloat(normalizedScore) * 0.05)).toFixed(1);
      taxWinProb.textContent = `${Math.min(99.9, winChance)}% 🏆`;
    }

    // Verdict
    if (taxVerdict) {
      if (normalizedScore > 90) {
        taxVerdict.textContent = '"STATUS: Unstoppable Hackathon Mode. Code compiles instantly, jury mesmerized."';
      } else if (normalizedScore > 75) {
        taxVerdict.textContent = '"STATUS: Peak Hackathon Flow. Ready to present to the SIH Jury without blinking."';
      } else {
        taxVerdict.textContent = '"STATUS: Stable & Polished. Ready for demo round 1."';
      }
    }
  }

  [hoursInput, chaiInput, bugsInput, panicInput].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', calculateTax);
    }
  });

  if (recalibrateTaxBtn) {
    recalibrateTaxBtn.addEventListener('click', () => {
      if (hoursInput) hoursInput.value = Math.floor(Math.random() * (48 - 24 + 1)) + 24;
      if (chaiInput) chaiInput.value = Math.floor(Math.random() * (18 - 6 + 1)) + 6;
      if (bugsInput) bugsInput.value = Math.floor(Math.random() * (60 - 15 + 1)) + 15;
      if (panicInput) panicInput.value = Math.floor(Math.random() * (85 - 35 + 1)) + 35;
      calculateTax();
      playSuccessChime();
    });
  }

  /* ==========================================================================
     06. Hackathon Terminal (CLI Sandbox)
     ========================================================================== */
  const terminalScreen = document.getElementById('terminalScreen');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSubmitBtn = document.getElementById('terminalSubmitBtn');
  const cmdChips = document.querySelectorAll('.cmd-chip');

  const cliCommands = {
    help: () => `AVAILABLE COMMANDS:
  • help          : Print this cheat sheet
  • team / squad  : Inspect squad architecture & roles
  • tax           : View why "+ Tax" is the game changer
  • sih           : Reveal the SIH 2026 problem blueprint
  • coffee / chai : Fuel the team terminal with virtual caffeine
  • git-status    : Inspect live repository status & commit notes
  • sudo win      : Execute championship victory routine
  • whoami        : Check your current identity
  • clear         : Wipe terminal buffer`,

    team: () => `[GIRLGANG+TAX] ROSTER ARCHITECTURE:
  ├─ Sayantica      [@sayantica.exe]  : Team Lead & Systems Architect
  ├─ Model Whisperer[@tensors.ai]     : Edge AI & Deep Learning Wizard
  ├─ Async Warrior  [@async.await]    : Fullstack & Low-Latency APIs
  ├─ Infra Commander[@k8s.root]       : DevOps, Security & Cloud Clusters
  ├─ Design Alchemy [@figma.ninja]    : UI/UX & Micro-Interactions
  └─ Data Strategist[@data.insights]  : Analytics & Domain Research
  ==> Total Synergy Factor: 10x Velocity`,

    tax: () => `TAX EQUATION AUDIT:
  Base Unit = 5 Coders + 1 Vision
  + Tax     = 140+ Cups of Chai + 3:42 AM Eureka Moments + Zero Panic
  Result    = 100% Hackathon Ready Solution!`,

    sih: () => `SIH 2026 MISSION DOSSIER:
  Problem : Intelligent Automation & Real-time Public Decision Engine
  Stack   : Next.js, FastAPI, ONNX, Qdrant, Docker, Kubernetes
  Target  : 36-Hour National Grand Finale Champion`,

    coffee: () => `☕ [CAFFEINE SYNTHESIZER ACTIVATED]
      ( (
       ) )
    .______.
    |  CHAI|]  <-- Fresh Masala Chai Brewed!
    \\______/      +100 Focus | +50 Debug Speed | -0 Bugs`,

    chai: () => `☕ [MASALA CHAI INJECTED]
      ~ Chai pe charcha with jury guaranteed to pass with flying colors! ~`,

    'git status': () => `On branch main
Your branch is ahead of 'origin/main' by 348 commits.
(use "git push" to publish your local commits to jury)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
    sih_first_prize_trophy.glb
    3am_secret_sauce.py

nothing added to commit but untracked files present (working tree clean)`,

    'git-status': () => cliCommands['git status'](),

    'sudo win': () => {
      playSuccessChime();
      return `🎉 [SUDO GRANTED] INITIATING VICTORY SEQUENCE...
  ███████╗██╗██╗  ██╗    ██████╗  ██████╗ ██████╗  ██████╗ 
  ██╔════╝██║██║  ██║    ╚════██╗██╔═████╗╚════██╗██╔════╝ 
  ███████╗██║███████║     █████╔╝██║██╔██║ █████╔╝███████╗ 
  ╚════██║██║██╔══██║    ██╔═══╝ ████╔╝██║██╔═══╝ ██╔═══██╗
  ███████║██║██║  ██║    ███████╗╚██████╔╝███████╗╚██████╔╝
  🏆 GIRL GANG PLUS TAX - SMART INDIA HACKATHON 2026 CHAMPIONS! 🏆`;
    },

    whoami: () => `user: distinguished_sih_evaluator_or_fellow_hacker
permissions: [read, admire, cheer, star_repo, grant_1st_prize]`,

    clear: () => {
      if (terminalScreen) {
        terminalScreen.innerHTML = '';
      }
      return null;
    }
  };

  function executeCommand(rawCmd) {
    if (!rawCmd || !terminalScreen) return;
    const cmd = rawCmd.trim().toLowerCase();

    // Echo user input
    const userLine = document.createElement('div');
    userLine.className = 't-line t-user-prompt';
    userLine.textContent = `girlgang@sih-2026:~$ ${rawCmd}`;
    terminalScreen.appendChild(userLine);

    if (cmd === 'clear') {
      cliCommands.clear();
      return;
    }

    const outputLine = document.createElement('div');
    outputLine.className = 't-line t-output';

    if (cliCommands[cmd]) {
      const res = cliCommands[cmd]();
      if (res) outputLine.textContent = res;
      playKeyClick();
    } else {
      outputLine.innerHTML = `<span style="color: #ff5e7e">Command not found: '${rawCmd}'.</span> Type <span class="t-cmd">'help'</span> to see available commands.`;
    }

    terminalScreen.appendChild(outputLine);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  }

  function handleTerminalSubmit() {
    if (!terminalInput) return;
    const val = terminalInput.value;
    if (val.trim()) {
      executeCommand(val);
      terminalInput.value = '';
    }
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleTerminalSubmit();
      }
    });
  }

  if (terminalSubmitBtn) {
    terminalSubmitBtn.addEventListener('click', handleTerminalSubmit);
  }

  cmdChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  /* ==========================================================================
     07. Community Cheer Wall (LocalStorage)
     ========================================================================== */
  const cheerForm = document.getElementById('cheerForm');
  const cheerAuthor = document.getElementById('cheerAuthor');
  const cheerMessage = document.getElementById('cheerMessage');
  const stickyBoard = document.getElementById('stickyBoard');

  const defaultCheers = [
    {
      id: 'note_1',
      author: 'Senior Architect',
      message: 'Keep your state management clean and make the pitch count! You got this GirlGang! 🚀',
      color: 'yellow',
      likes: 12,
      rotation: -2
    },
    {
      id: 'note_2',
      author: 'College Mentor',
      message: 'Remember: When the jury asks tough questions, smile and show the test coverage. 💯',
      color: 'pink',
      likes: 19,
      rotation: 3
    },
    {
      id: 'note_3',
      author: 'Fellow Hacker',
      message: 'May your APIs return 200 OK and your CSS never break at 100% zoom! LFG! 🔥',
      color: 'cyan',
      likes: 8,
      rotation: -1.5
    },
    {
      id: 'note_4',
      author: 'Chai Vendor',
      message: 'Extra ginger chai reserved for the 3 AM debugging sprint. Best of luck team! ☕',
      color: 'lime',
      likes: 27,
      rotation: 2.5
    }
  ];

  function getStoredCheers() {
    try {
      const stored = localStorage.getItem('gg_cheer_wall');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return defaultCheers;
  }

  function saveCheers(cheers) {
    try {
      localStorage.setItem('gg_cheer_wall', JSON.stringify(cheers));
    } catch (e) {}
  }

  function renderCheerWall() {
    if (!stickyBoard) return;
    const cheers = getStoredCheers();
    stickyBoard.innerHTML = '';

    cheers.forEach(cheer => {
      const card = document.createElement('div');
      card.className = `sticky-note-card note-${cheer.color || 'yellow'}`;
      card.style.transform = `rotate(${cheer.rotation || 0}deg)`;

      card.innerHTML = `
        <span class="note-pin">📌</span>
        <div class="note-text">"${escapeHtml(cheer.message)}"</div>
        <div class="note-footer">
          <span class="note-author">— ${escapeHtml(cheer.author)}</span>
          <button class="note-like-btn" data-id="${cheer.id}" title="Cheer for this note">
            ❤️ <span>${cheer.likes || 0}</span>
          </button>
        </div>
      `;

      stickyBoard.appendChild(card);
    });

    // Attach like listeners
    const likeBtns = stickyBoard.querySelectorAll('.note-like-btn');
    likeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        likeCheer(id);
      });
    });
  }

  function likeCheer(id) {
    const cheers = getStoredCheers();
    const target = cheers.find(c => c.id === id);
    if (target) {
      target.likes = (target.likes || 0) + 1;
      saveCheers(cheers);
      renderCheerWall();
      playTone(880, 'sine', 0.06, 0.04);
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (cheerForm) {
    cheerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = cheerAuthor.value.trim();
      const message = cheerMessage.value.trim();
      const selectedColor = document.querySelector('input[name="noteColor"]:checked');
      const color = selectedColor ? selectedColor.value : 'yellow';

      if (!author || !message) return;

      const randomRot = (Math.random() * 6 - 3).toFixed(1);
      const newCheer = {
        id: 'note_' + Date.now(),
        author,
        message,
        color,
        likes: 1,
        rotation: parseFloat(randomRot)
      };

      const current = getStoredCheers();
      current.unshift(newCheer);
      saveCheers(current);
      renderCheerWall();
      playSuccessChime();

      // Reset form
      cheerAuthor.value = '';
      cheerMessage.value = '';
    });
  }

  /* ==========================================================================
     08. Initial Boot
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    typeWriterLoop();
    calculateTax();
    renderCheerWall();
  });

})();

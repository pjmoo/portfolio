// ── Document Loaded Listener ──
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAmbientCanvas();
  initTabNavigation();
  initCSSPlayground();
  initJSSandbox();
  initStudyTimeline();
  initGuestbook();
});

// ── 1. Mobile Navigation Menu ──
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleBtn.classList.toggle('open');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('open');
      });
    });
  }
}

// ── 2. Ambient Particles Background Canvas ──
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 45;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height + canvas.height; // Start off screen bottom
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = Math.random() * 0.4 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.glowColor = Math.random() > 0.5 ? 'rgba(123, 154, 204, ' : 'rgba(160, 139, 202, '; // Soft Blue or Lavender
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      
      // If particle drifts off top or sides, reset
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.glowColor + this.opacity + ')';
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // Distribute initially across screen height
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ── 3. Tab Navigation ──
function initTabNavigation() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// ── 4. CSS Layout & Box-Sizing Playground ──
function initCSSPlayground() {
  const flexStage = document.getElementById('flex-stage');
  const justifySelect = document.getElementById('justify-content-select');
  const gapRange = document.getElementById('gap-range');
  const gapDisplay = document.getElementById('gap-val-display');
  const boxSizingToggle = document.getElementById('box-sizing-toggle');
  const boxSizingDesc = document.getElementById('box-sizing-desc');

  // Flex Direction & Align Items Buttons
  const btnGroups = document.querySelectorAll('.btn-group');

  // Handle Flex-direction and Align-items button groups
  btnGroups.forEach(group => {
    const prop = group.dataset.prop;
    const buttons = group.querySelectorAll('button');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        group.querySelector('.btn.active').classList.remove('active');
        btn.classList.add('active');

        // Apply styles to flex stage
        const val = btn.dataset.val;
        if (prop === 'flex-direction') {
          flexStage.style.flexDirection = val;
        } else if (prop === 'align-items') {
          flexStage.style.alignItems = val;
        }
      });
    });
  });

  // Handle Justify Content Select dropdown
  if (justifySelect) {
    justifySelect.addEventListener('change', (e) => {
      flexStage.style.justifyContent = e.target.value;
    });
  }

  // Handle Gap slider
  if (gapRange && gapDisplay) {
    gapRange.addEventListener('input', (e) => {
      const val = e.target.value;
      gapDisplay.textContent = `${val}px`;
      flexStage.style.gap = `${val}px`;
    });
  }

  // Handle Box Sizing toggle
  if (boxSizingToggle && boxSizingDesc) {
    // Initial State setting
    flexStage.classList.add('content-box-active');
    
    boxSizingToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        flexStage.classList.remove('content-box-active');
        flexStage.classList.add('border-box-active');
        boxSizingDesc.innerHTML = `현재 <code>border-box</code> 상태: 패딩(20px)과 보더(4px)가 가로 너비(100px) 내부로 포함됩니다. 따라서 추가 패딩이나 테두리가 더해져도 <strong>실제 상자의 크기는 100px로 완벽히 고정</strong>됩니다.`;
        
        // Update box size tags
        document.querySelectorAll('.flex-box-item .box-size-label').forEach(label => {
          label.textContent = "100px (고정)";
        });
      } else {
        flexStage.classList.remove('border-box-active');
        flexStage.classList.add('content-box-active');
        boxSizingDesc.innerHTML = `현재 <code>content-box</code> 상태: 설정한 가로 너비(100px)에 패딩(좌우 40px)과 테두리(좌우 8px)가 바깥쪽으로 더해집니다. 따라서 <strong>상자의 최종 실면적은 가로 148px</strong>로 늘어나 레이아웃이 깨질 수 있습니다.`;
        
        // Update box size tags
        document.querySelectorAll('.flex-box-item .box-size-label').forEach(label => {
          label.textContent = "148px (실면적)";
        });
      }
    });
  }
}

// ── 5. JavaScript Sandbox Code Runner ──
function initJSSandbox() {
  const select = document.getElementById('code-snippet-select');
  const textarea = document.getElementById('code-textarea');
  const gutter = document.getElementById('editor-gutter');
  const btnRun = document.getElementById('btn-run-code');
  const btnClear = document.getElementById('btn-clear-console');
  const consoleLogs = document.getElementById('console-logs');

  // Pre-loaded Code Snippets Map
  const snippets = {
    closure: `// 🔒 Closure - 상태를 안전하게 은닉하는 기법
function createCounter() {
  let count = 0; // 외부에서 직접 수정할 수 없는 은닉된 상태
  return {
    increment: function() { count++; return count; },
    decrement: function() { count--; return count; },
    getCount: function() { return count; }
  };
}

const counter = createCounter();
console.log("초기값:", counter.getCount());
console.log("1 증가:", counter.increment());
console.log("2 증가:", counter.increment());
console.log("현재값 기억:", counter.getCount());

// 내부 변수인 count는 직접 접근이 불가능합니다.
console.log("count 변수 직접 접근:", typeof count);
console.log("1 감소:", counter.decrement());`,

    'map-vs-obj': `// 🗺️ Map vs Object - ES6 컬렉션 비교
const obj = { a: 'a', b: 'b', 'c d': 'c d' };
const map = new Map();

map.set('aa', 1234);
map.set('bb', 12345);

console.log("--- Object 확인 ---");
console.log("Object 프로퍼티:", JSON.stringify(obj));
console.log("'aa' 프로퍼티 존재 여부:", "aa" in obj);

console.log("\\n--- Map 확인 ---");
console.log("Map 크기(size):", map.size);
console.log("Map key 'aa'의 값:", map.get('aa'));
console.log("Map key 'cc' 존재 여부:", map.has('cc'));
console.log("Map 전체 출력:");
map.forEach((value, key) => {
  console.log(\`  \${key} => \${value}\`);
});`,

    hoisting: `// ⬆️ Hoisting - 실행 컨텍스트의 평가 단계와 실행 단계
console.log("--- var 호이스팅 ---");
console.log("var 변수 선언 전 접근:", myVar); // undefined
var myVar = "Hello Var";
console.log("var 변수 선언 후 접근:", myVar);

console.log("\\n--- 함수 선언문 호이스팅 ---");
console.log("함수 선언 전 호출:", helloFunc()); // 호출 성공!
function helloFunc() {
  return "안녕하세요! 저는 선언 전에도 호출 가능합니다.";
}

console.log("\\n--- let/const TDZ ---");
try {
  console.log(myLet); // ReferenceError (Temporal Dead Zone)
} catch(e) {
  console.log("let 변수 선언 전 접근 시 에러 발생:", e.message);
}
let myLet = "Hello Let";
console.log("let 변수 선언 후 접근:", myLet);`,

    'scope-chain': `// 🔭 Scope Chain - 식별자를 결정하기 위한 스코프 체인 추적
const globalVar = "전역 변수";

function outerFunction() {
  const outerVar = "외측 함수 변수";
  
  function innerFunction() {
    const innerVar = "내측 함수 변수";
    
    console.log("1. 내측 변수 접근:", innerVar);
    console.log("2. 외측 변수 접근 (스코프 체인):", outerVar);
    console.log("3. 전역 변수 접근 (스코프 체인):", globalVar);
  }
  
  innerFunction();
}

outerFunction();`
  };

  // Sync Gutter Line Numbers
  function updateGutter() {
    const text = textarea.value;
    const lines = text.split('\n');
    let gutterHTML = '';
    for (let i = 1; i <= lines.length; i++) {
      gutterHTML += `<div>${i}</div>`;
    }
    gutter.innerHTML = gutterHTML;
  }

  // Handle snippet selection
  if (select && textarea) {
    select.addEventListener('change', (e) => {
      const key = e.target.value;
      if (snippets[key]) {
        textarea.value = snippets[key];
        updateGutter();
      }
    });

    // Initial load
    textarea.value = snippets[select.value];
    updateGutter();

    // Editor textarea listeners
    textarea.addEventListener('input', updateGutter);
    textarea.addEventListener('scroll', () => {
      gutter.scrollTop = textarea.scrollTop;
    });
  }

  // Handle execution
  if (btnRun && consoleLogs) {
    btnRun.addEventListener('click', () => {
      const code = textarea.value;
      
      // Print run header
      const headerDiv = document.createElement('div');
      headerDiv.className = 'console-line system-line';
      headerDiv.textContent = `\n> [${new Date().toLocaleTimeString()}] Running script...`;
      consoleLogs.appendChild(headerDiv);

      // Captured output array
      const capturedLogs = [];
      
      // Save original console
      const originalLog = console.log;
      
      // Overwrite console.log temporarily
      console.log = function(...args) {
        const logMsg = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            return JSON.stringify(arg);
          }
          return String(arg);
        }).join(' ');
        capturedLogs.push({ type: 'log', message: logMsg });
      };

      try {
        // Execute Code in a sandbox wrapper
        const runWrapper = new Function(code);
        runWrapper();
        
        // Print logs
        if (capturedLogs.length === 0) {
          const emptyLine = document.createElement('div');
          emptyLine.className = 'console-line system-line';
          emptyLine.textContent = '  (반환값이나 console.log 출력이 없습니다)';
          consoleLogs.appendChild(emptyLine);
        } else {
          capturedLogs.forEach(log => {
            const line = document.createElement('div');
            line.className = 'console-line log-line';
            line.textContent = `  ${log.message}`;
            consoleLogs.appendChild(line);
          });
        }

        // Print completion
        const successLine = document.createElement('div');
        successLine.className = 'console-line success-line';
        successLine.textContent = `> Script finished successfully.`;
        consoleLogs.appendChild(successLine);
        
      } catch (err) {
        // Log caught logs first
        capturedLogs.forEach(log => {
          const line = document.createElement('div');
          line.className = 'console-line log-line';
          line.textContent = `  ${log.message}`;
          consoleLogs.appendChild(line);
        });

        // Print error message
        const errLine = document.createElement('div');
        errLine.className = 'console-line error-line';
        errLine.textContent = `  Runtime Error: ${err.message}`;
        consoleLogs.appendChild(errLine);
      } finally {
        // Restore original console.log
        console.log = originalLog;
        
        // Auto Scroll to bottom
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
      }
    });
  }

  // Clear Console
  if (btnClear && consoleLogs) {
    btnClear.addEventListener('click', () => {
      consoleLogs.innerHTML = `<div class="console-line system-line">&gt; JavaScript Sandbox 초기화 완료. 실행할 코드를 선택하고 [RUN CODE]를 눌러보세요.</div>`;
    });
  }
}

// ── 6. Daily Study Timeline Data & Rendering ──
function initStudyTimeline() {
  const container = document.getElementById('timeline-list');
  if (!container) return;

  const timelineData = [
    {
      date: "2026.05.26",
      folder: "260526_ex",
      title: "JavaScript Map과 Object 비교 실습",
      desc: "키-값 쌍을 저장하는 ES6 Map 컬렉션의 메서드(set, get, has, size)와 일반 Object의 프로퍼티 키 탐색(in 연산자 등)을 수행하며, 메모리 구조와 반복문 순회 편의성의 차이를 다루었습니다.",
      tags: ["JavaScript", "ES6 Map", "Object", "Collections"]
    },
    {
      date: "2026.05.22",
      folder: "260522_self-pra",
      title: "Javascript Core 동작 원리 대시보드 제작",
      desc: "반복문부터 함수, 매개변수, 구조분해할당, 호이스팅, 스코프, 클로저, 객체, 배열, DOM 조작, 이벤트 핸들링, 그리고 비동기 Promise 체이닝까지 JavaScript 전체 15개 핵심 개념을 한 페이지짜리 대형 인터랙티브 파일로 요약 및 실습 구축을 완료했습니다.",
      tags: ["JavaScript Complete", "Visual Dashboards", "Interaction Design"]
    },
    {
      date: "2026.05.22",
      folder: "260522_ex",
      title: "JS 함수 스코프, 호이스팅, 클로저 학습",
      desc: "함수 선언문과 화살표 함수의 선언 차이, 렉시컬 스코프의 개념, 호이스팅 시 var(undefined)와 let/const(TDZ 오류)의 원인, 그리고 소멸한 외부 함수의 내부 변수를 참조하는 클로저를 활용해 '상태 은닉 캡슐화' 패턴을 학습하고 TIL을 정리했습니다.",
      tags: ["Scope Chain", "Hoisting", "Closures", "TIL Writing"]
    },
    {
      date: "2026.05.21",
      folder: "260521_ex",
      title: "JavaScript 변수 선언과 제어 구조 실습",
      desc: "기본 자료형(원시형 vs 참조형)을 파악하고 변수 선언 방식(var, let, const)의 차이점을 실습했습니다. while문, for문, switch 조건문과 증감 연산자, 비교 연산자의 다양한 연산 흐름을 학습했습니다.",
      tags: ["JS Basic Types", "Control Flows", "Loops", "Operators"]
    },
    {
      date: "2026.05.20",
      folder: "260520_ex",
      title: "Git Workflow 및 Markdown 실습",
      desc: "프로젝트 진행 과정과 구조를 문서화하는 마크다운 파일(.md) 기법을 정리하고, Git 저장소 초기화, 텍스트 파일 추가 및 버전 커밋 흐름을 연습했습니다.",
      tags: ["Git Init", "Commits", "Markdown Docs", "Readme"]
    },
    {
      date: "2026.05.19",
      folder: "260519_ex",
      title: "CSS Layout - Box-sizing 및 Flexbox",
      desc: "box-sizing 속성의 content-box와 border-box 차이를 계산식을 통해 비교했습니다. display: flex, flex-direction, justify-content, align-items 등 플렉스 박스 레이아웃의 유연성을 이해하고 Tailwind CSS, Bootstrap 라이브러리의 그리드 유틸 클래스 기본을 학습했습니다.",
      tags: ["box-sizing", "Flexbox Grid", "Tailwind basics", "Responsive CSS"]
    },
    {
      date: "2026.05.18",
      folder: "260518_self-pra",
      title: "Backend Engineer 1페이지 이력서 마크업",
      desc: "시맨틱 마크업(header, section, footer)을 사용하여 백엔드 가상 인물(Tadashi)의 1페이지 깔끔하고 모던한 모노톤의 반응형 이력서를 기획/제작했습니다. favicon 팩을 직접 연결했습니다.",
      tags: ["Semantic HTML", "Flexbox Resume", "Favicon linking"]
    },
    {
      date: "2026.05.18",
      folder: "260518_ex",
      title: "HTML5 태그 & SEO 기본 속성 학습",
      desc: "HTML 뼈대를 구성하는 폼 태그(input 유형, select, checkbox, radio, textarea)를 활용한 가입 양식을 제작했습니다. meta open-graph (og:image, og:description)를 구성해 SNS 공유 미리보기를 연결하고 호스팅 배포 기초를 이해했습니다.",
      tags: ["Form markup", "SEO Meta Tags", "OpenGraph", "Web Deploy"]
    },
    {
      date: "2026.05.15",
      folder: "260515_ex01/02",
      title: "Git Remote 연동 및 원격 동기화",
      desc: "원격 저장소(GitHub)와 로컬 Git 브랜치를 연결하고 push, pull 명령어를 적용해 원격 코드 관리의 기초를 완성했습니다.",
      tags: ["Git Remote", "Git Push", "Git Pull", "GitHub Sync"]
    }
  ];

  let timelineHTML = '';
  timelineData.forEach(item => {
    const tagsHTML = item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('');
    
    timelineHTML += `
      <div class="timeline-card-item">
        <span class="timeline-date-tag">${item.date}</span>
        <div class="timeline-body">
          <span class="timeline-folder">${item.folder}</span>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <div class="timeline-tags">
            ${tagsHTML}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = timelineHTML;
}

// ── 7. LocalStorage Guestbook Controller ──
function initGuestbook() {
  const form = document.getElementById('comment-form');
  const feedList = document.getElementById('feed-list');
  const countSpan = document.getElementById('comment-count');
  const emptyState = document.getElementById('feed-empty');

  // Input elements
  const authorInput = document.getElementById('input-author');
  const roleSelect = document.getElementById('input-role');
  const messageInput = document.getElementById('input-message');

  const STORAGE_KEY = 'pjm_portfolio_guestbook';

  // Helper: Escape input for security (preventing XSS)
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Load comments
  function getComments() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Save comments
  function saveComments(comments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }

  // Render comments list
  function renderComments() {
    const comments = getComments();
    countSpan.textContent = comments.length;

    if (comments.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      // Remove any existing comments in feed
      const items = feedList.querySelectorAll('.feed-item');
      items.forEach(item => item.remove());
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Clear feed (but keep empty state hidden)
    const items = feedList.querySelectorAll('.feed-item');
    items.forEach(item => item.remove());

    comments.forEach(comment => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'feed-item';
      
      const roleText = {
        developer: 'Developer',
        designer: 'Designer',
        pm: 'PM',
        visitor: 'Visitor'
      }[comment.role] || 'Visitor';

      // Get first character for avatar icon
      const initial = comment.author.charAt(0).toUpperCase();

      itemDiv.innerHTML = `
        <div class="feed-item-header">
          <div class="feed-item-author-info">
            <div class="feed-avatar">${initial}</div>
            <span class="feed-name">${comment.author}</span>
            <span class="feed-role-badge ${comment.role}">${roleText}</span>
          </div>
          <span class="feed-date">${comment.date}</span>
        </div>
        <p class="feed-message">${comment.message}</p>
      `;

      // Prepend to show latest first
      feedList.insertBefore(itemDiv, feedList.firstChild);
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const author = escapeHTML(authorInput.value.trim());
      const role = roleSelect.value;
      const message = escapeHTML(messageInput.value.trim());
      const date = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      if (!author || !message) return;

      const newComment = {
        id: 'comment-' + Date.now() + Math.random().toString(36).substr(2, 5),
        author,
        role,
        message,
        date
      };

      const comments = getComments();
      comments.push(newComment);
      saveComments(comments);

      // Reset form
      form.reset();

      // Render updated list
      renderComments();

      // Smooth scroll the latest comment into view (feed top)
      feedList.scrollTop = 0;
    });
  }

  // Initialize display
  renderComments();
}

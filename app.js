(() => {
  /* 
     Задания 1–5
  */
  const mainInput = document.getElementById('mainInput');
  const fillBtn = document.getElementById('fillBtn');
  const alertBtn = document.getElementById('alertBtn');
  const lockBtn = document.getElementById('lockBtn');
  const maskBtn = document.getElementById('maskBtn');
  const hideFieldBtn = document.getElementById('hideFieldBtn');

  // Задание 1
  fillBtn.addEventListener('click', () => {
    mainInput.value = 'Пример текста из JavaScript';
  });

  // Задание 2
  alertBtn.addEventListener('click', () => {
    const value = mainInput.value.trim();

    if (value) {
      alert(`Вы ввели «${mainInput.value}»`);
    } else {
      alert('Вы ничего не ввели');
    }
  });

  // Задание 3
  lockBtn.addEventListener('click', () => {
    mainInput.disabled = !mainInput.disabled;
    lockBtn.textContent = mainInput.disabled
      ? 'Заблокировано'
      : 'Разблокировано';
  });

  // Задание 4
  maskBtn.addEventListener('click', () => {
    const isPassword = mainInput.type === 'password';
    mainInput.type = isPassword ? 'text' : 'password';
    maskBtn.textContent = isPassword ? 'Доступно' : 'Скрыто';
  });

  // Задание 5
  hideFieldBtn.addEventListener('click', () => {
    const isHidden = mainInput.style.display === 'none';
    mainInput.style.display = isHidden ? '' : 'none';
    hideFieldBtn.textContent = isHidden ? 'Скрыть поле' : 'Показать поле';
  });

  /* 
     Задание 6
      */
  const hoverShape = document.getElementById('hoverShape');

  hoverShape.addEventListener('mouseenter', () => {
    hoverShape.classList.add('green');
  });

  hoverShape.addEventListener('mouseleave', () => {
    hoverShape.classList.remove('green');
  });

  /* 
     Задание 7
      */
  const shapeCountInput = document.getElementById('shapeCount');
  const createShapesBtn = document.getElementById('createShapesBtn');
  const shapesBox = document.getElementById('shapesBox');

  function createShapes() {
    const count = Math.max(1, Math.min(50, Number(shapeCountInput.value) || 1));
    shapesBox.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const shape = document.createElement('div');
      shape.className = 'shape';

      if (i % 2 === 0) {
        shape.classList.add('circle');
      }

      shape.addEventListener('click', () => {
        const willBeGreen = !shape.classList.contains('green');

        shapesBox.querySelectorAll('.shape').forEach((item) => {
          item.classList.remove('green');
        });

        if (willBeGreen) {
          shape.classList.add('green');
        }
      });

      shapesBox.appendChild(shape);
    }
  }

  createShapesBtn.addEventListener('click', createShapes);
  createShapes();

  /* 
     Задание 8
      */
  const autocompleteInput = document.getElementById('autocompleteInput');
  const suggestions = document.getElementById('suggestions');

  const dictionary = [
    'Привет',
    'Привет, как дела?',
    'Как дела?',
    'Как ты?',
    'Как настроение?',
    'Что нового?',
    'Что делаешь?',
    'Где ты?',
    'Давай встретимся',
    'Давай созвонимся',
    'Спасибо',
    'Пожалуйста',
    'Извини',
    'Доброе утро',
    'Добрый день',
    'Добрый вечер',
    'Спокойной ночи',
    'До встречи',
    'Пока',
    'Удачи!',
    'Молодец!',
    'Я тебя понимаю'
  ];

  function renderSuggestions() {
    const query = autocompleteInput.value.trim().toLowerCase();
    suggestions.innerHTML = '';

    if (!query) return;

    const matches = dictionary.filter((item) =>
      item.toLowerCase().includes(query)
    );

    matches.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;

      li.addEventListener('click', () => {
        autocompleteInput.value = item;
        suggestions.innerHTML = '';
      });

      suggestions.appendChild(li);
    });
  }

  autocompleteInput.addEventListener('input', renderSuggestions);

  /* 
     Задание 9.1 — след мыши и скорость
      */
  const trailCanvas = document.getElementById('trailCanvas');
  const trailCtx = trailCanvas.getContext('2d');
  const speedInfo = document.getElementById('speedInfo');

  const trailPoints = [];
  const SPEED_WINDOW_MS = 2000;

  trailCanvas.addEventListener('pointermove', (event) => {
    const rect = trailCanvas.getBoundingClientRect();

    const x = (event.clientX - rect.left) * (trailCanvas.width / rect.width);
    const y = (event.clientY - rect.top) * (trailCanvas.height / rect.height);

    trailPoints.push({
      x,
      y,
      time: performance.now()
    });
  });

  function drawTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    const now = performance.now();

    while (trailPoints.length && now - trailPoints[0].time > SPEED_WINDOW_MS) {
      trailPoints.shift();
    }

    for (let i = 1; i < trailPoints.length; i++) {
      const prev = trailPoints[i - 1];
      const current = trailPoints[i];
      const age = now - current.time;
      const alpha = Math.max(0, 1 - age / SPEED_WINDOW_MS);

      trailCtx.beginPath();
      trailCtx.moveTo(prev.x, prev.y);
      trailCtx.lineTo(current.x, current.y);
      trailCtx.strokeStyle = `rgba(76, 201, 240, ${alpha})`;
      trailCtx.lineWidth = 3;
      trailCtx.stroke();
    }

    let speed = 0;

    if (trailPoints.length > 1) {
      let distance = 0;

      for (let i = 1; i < trailPoints.length; i++) {
        const dx = trailPoints[i].x - trailPoints[i - 1].x;
        const dy = trailPoints[i].y - trailPoints[i - 1].y;
        distance += Math.hypot(dx, dy);
      }

      const elapsed =
        (trailPoints[trailPoints.length - 1].time - trailPoints[0].time) / 1000;

      if (elapsed > 0) {
        speed = distance / elapsed;
      }
    }

    speedInfo.textContent = `${Math.round(speed)} px/s`;
    requestAnimationFrame(drawTrail);
  }

  drawTrail();

  /* 
     Задание 9.2 — Drag & Drop
      */
  const dragWorkspace = document.getElementById('dragWorkspace');
  const dragBlock = document.getElementById('dragBlock');
  const dropZone = document.getElementById('dropZone');

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  dragBlock.addEventListener('pointerdown', (e) => {
    isDragging = true;
    dragBlock.setPointerCapture(e.pointerId);

    const rect = dragBlock.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    dragBlock.style.cursor = 'grabbing';
  });

  dragBlock.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const workspaceRect = dragWorkspace.getBoundingClientRect();

    let left = e.clientX - workspaceRect.left - offsetX;
    let top = e.clientY - workspaceRect.top - offsetY;

    // Ограничиваем внутри рабочей области
    left = Math.max(0, Math.min(dragWorkspace.clientWidth - dragBlock.offsetWidth, left));
    top = Math.max(0, Math.min(dragWorkspace.clientHeight - dragBlock.offsetHeight, top));

    dragBlock.style.left = left + 'px';
    dragBlock.style.top = top + 'px';
  });

  dragBlock.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    dragBlock.style.cursor = 'grab';

    // Проверяем, попали ли в зону
    const blockRect = dragBlock.getBoundingClientRect();
    const zoneRect = dropZone.getBoundingClientRect();

    const centerX = blockRect.left + blockRect.width / 2;
    const centerY = blockRect.top + blockRect.height / 2;

    const inZone =
      centerX >= zoneRect.left &&
      centerX <= zoneRect.right &&
      centerY >= zoneRect.top &&
      centerY <= zoneRect.bottom;

    if (inZone) {
      dragBlock.classList.add('in-zone');
    } else {
      dragBlock.classList.remove('in-zone');
    }
  });

  /* 
     Задание 10 — Космический шутер
      */
  const gameCanvas = document.getElementById('gameCanvas');
  const gameCtx = gameCanvas.getContext('2d');

  const gameLevelEl = document.getElementById('gameLevel');
  const gameMedalsEl = document.getElementById('gameMedals');
  const gameSpeedEl = document.getElementById('gameSpeed');

  const gameOverlay = document.getElementById('gameOverlay');
  const gameOverlayTitle = document.getElementById('gameOverlayTitle');
  const gameOverlayText = document.getElementById('gameOverlayText');
  const gameStartBtn = document.getElementById('gameStartBtn');

  const GW = gameCanvas.width;
  const GH = gameCanvas.height;

  const PLAYER_SPEED = 320;
  const MEDAL_RADIUS = 11;

  let gameState = 'menu';
  let gamePlayer = null;
  let gameEnemies = [];
  let gameMedal = null;

  let gameCollected = 0;
  let gameLevel = 1;
  let gameSpeedMultiplier = 1;

  let gameKeys = {};
  let gameMouse = { x: GW / 2, y: GH / 2, active: false };

  let gameLastTime = 0;
  let gameRafId = null;

  function gameDist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function updateGameHud() {
    gameLevelEl.textContent = gameLevel;
    gameMedalsEl.textContent = gameCollected;
    gameSpeedEl.textContent = `${gameSpeedMultiplier.toFixed(2)}x`;
  }

  function resetGame() {
    gamePlayer = {
      x: GW / 2,
      y: GH / 2,
      r: 14,
      speed: PLAYER_SPEED
    };

    gameEnemies = [];
    gameMedal = null;
    gameCollected = 0;
    gameLevel = 1;
    gameSpeedMultiplier = 1;
    gameKeys = {};
    gameMouse.active = false;

    updateGameHud();
    spawnMedal();
    spawnEnemies(3);
  }

  function startGame() {
    resetGame();
    gameState = 'playing';
    gameOverlay.classList.add('hidden');
    gameLastTime = performance.now();

    if (!gameRafId) {
      gameRafId = requestAnimationFrame(gameLoop);
    }
  }

  function gameOver() {
    gameState = 'over';

    gameOverlayTitle.textContent = 'Игра окончена';
    gameOverlayText.innerHTML =
      `Вы собрали медалей: <b>${gameCollected}</b><br>` +
      `Достигнутый уровень: <b>${gameLevel}</b>`;

    gameStartBtn.textContent = 'Играть снова';
    gameOverlay.classList.remove('hidden');
  }

  function spawnMedal() {
    const margin = 35;

    gameMedal = {
      x: margin + Math.random() * (GW - margin * 2),
      y: margin + Math.random() * (GH - margin * 2),
      r: MEDAL_RADIUS,
      vx: (Math.random() - 0.5) * 140,
      vy: (Math.random() - 0.5) * 140
    };

    if (gamePlayer && gameDist(gameMedal, gamePlayer) < 90) {
      gameMedal.x = margin + Math.random() * (GW - margin * 2);
      gameMedal.y = margin + Math.random() * (GH - margin * 2);
    }
  }

  function spawnEnemy() {
    const r = 12 + Math.random() * 8;
    let x, y;

    const edge = Math.floor(Math.random() * 4);

    if (edge === 0) {
      x = -r;
      y = Math.random() * GH;
    } else if (edge === 1) {
      x = GW + r;
      y = Math.random() * GH;
    } else if (edge === 2) {
      x = Math.random() * GW;
      y = -r;
    } else {
      x = Math.random() * GW;
      y = GH + r;
    }

    const angle = Math.atan2(GH / 2 - y, GW / 2 - x) + (Math.random() - 0.5) * 1.6;
    const speed = 70 + Math.random() * 90;

    gameEnemies.push({
      x,
      y,
      r,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    });
  }

  function getMaxEnemies() {
    return Math.min(3 + Math.floor(gameCollected / 2), 20);
  }

  function spawnEnemies(count) {
    while (gameEnemies.length < count) {
      spawnEnemy();
    }
  }

  function updateGame(dt) {
    let dx = 0;
    let dy = 0;

    if (gameKeys['ArrowLeft'] || gameKeys['a'] || gameKeys['A']) dx -= 1;
    if (gameKeys['ArrowRight'] || gameKeys['d'] || gameKeys['D']) dx += 1;
    if (gameKeys['ArrowUp'] || gameKeys['w'] || gameKeys['W']) dy -= 1;
    if (gameKeys['ArrowDown'] || gameKeys['s'] || gameKeys['S']) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;

      gamePlayer.x += dx * gamePlayer.speed * dt;
      gamePlayer.y += dy * gamePlayer.speed * dt;
    } else if (gameMouse.active) {
      const mdx = gameMouse.x - gamePlayer.x;
      const mdy = gameMouse.y - gamePlayer.y;
      const mlen = Math.hypot(mdx, mdy);

      if (mlen > 4) {
        gamePlayer.x += (mdx / mlen) * gamePlayer.speed * dt;
        gamePlayer.y += (mdy / mlen) * gamePlayer.speed * dt;
      }
    }

    gamePlayer.x = Math.max(gamePlayer.r, Math.min(GW - gamePlayer.r, gamePlayer.x));
    gamePlayer.y = Math.max(gamePlayer.r, Math.min(GH - gamePlayer.r, gamePlayer.y));

    for (const enemy of gameEnemies) {
      enemy.x += enemy.vx * gameSpeedMultiplier * dt;
      enemy.y += enemy.vy * gameSpeedMultiplier * dt;

      if (enemy.x - enemy.r < 0) {
        enemy.x = enemy.r;
        enemy.vx = Math.abs(enemy.vx);
      }
      if (enemy.x + enemy.r > GW) {
        enemy.x = GW - enemy.r;
        enemy.vx = -Math.abs(enemy.vx);
      }
      if (enemy.y - enemy.r < 0) {
        enemy.y = enemy.r;
        enemy.vy = Math.abs(enemy.vy);
      }
      if (enemy.y + enemy.r > GH) {
        enemy.y = GH - enemy.r;
        enemy.vy = -Math.abs(enemy.vy);
      }

      if (gameDist(enemy, gamePlayer) < enemy.r + gamePlayer.r) {
        gameOver();
        return;
      }
    }

    if (gameMedal) {
      gameMedal.x += gameMedal.vx * dt;
      gameMedal.y += gameMedal.vy * dt;

      if (gameMedal.x - gameMedal.r < 0) {
        gameMedal.x = gameMedal.r;
        gameMedal.vx = Math.abs(gameMedal.vx);
      }
      if (gameMedal.x + gameMedal.r > GW) {
        gameMedal.x = GW - gameMedal.r;
        gameMedal.vx = -Math.abs(gameMedal.vx);
      }
      if (gameMedal.y - gameMedal.r < 0) {
        gameMedal.y = gameMedal.r;
        gameMedal.vy = Math.abs(gameMedal.vy);
      }
      if (gameMedal.y + gameMedal.r > GH) {
        gameMedal.y = GH - gameMedal.r;
        gameMedal.vy = -Math.abs(gameMedal.vy);
      }

      if (gameDist(gameMedal, gamePlayer) < gameMedal.r + gamePlayer.r) {
        gameCollected++;
        gameLevel = gameCollected + 1;
        gameSpeedMultiplier = 1 + gameCollected * 0.18;

        updateGameHud();
        spawnMedal();
        spawnEnemies(getMaxEnemies());
      }
    }

    // Поддерживаем нужное количество врагов
    spawnEnemies(getMaxEnemies());
  }

  function drawGameBackground() {
    gameCtx.fillStyle = '#050814';
    gameCtx.fillRect(0, 0, GW, GH);

    gameCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 90; i++) {
      const x = (i * 97) % GW;
      const y = (i * 53) % GH;
      gameCtx.fillRect(x, y, 1.5, 1.5);
    }
  }

  function drawMedal() {
    if (!gameMedal) return;

    gameCtx.beginPath();
    gameCtx.arc(gameMedal.x, gameMedal.y, gameMedal.r, 0, Math.PI * 2);
    gameCtx.fillStyle = '#ffd166';
    gameCtx.fill();

    gameCtx.strokeStyle = '#fff3b0';
    gameCtx.lineWidth = 3;
    gameCtx.stroke();

    gameCtx.fillStyle = '#8a5a00';
    gameCtx.font = 'bold 14px Arial';
    gameCtx.textAlign = 'center';
    gameCtx.textBaseline = 'middle';
    gameCtx.fillText('★', gameMedal.x, gameMedal.y + 1);
  }

  function drawEnemies() {
    for (const enemy of gameEnemies) {
      gameCtx.beginPath();
      gameCtx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI * 2);
      gameCtx.fillStyle = '#ff4d6d';
      gameCtx.fill();

      gameCtx.strokeStyle = '#ffb3c1';
      gameCtx.lineWidth = 2;
      gameCtx.stroke();
    }
  }

  function drawPlayer() {
    if (!gamePlayer) return;

    gameCtx.beginPath();
    gameCtx.arc(gamePlayer.x, gamePlayer.y, gamePlayer.r, 0, Math.PI * 2);
    gameCtx.fillStyle = '#4cc9f0';
    gameCtx.fill();

    gameCtx.strokeStyle = '#caf0f8';
    gameCtx.lineWidth = 3;
    gameCtx.stroke();

    gameCtx.beginPath();
    gameCtx.arc(gamePlayer.x, gamePlayer.y, gamePlayer.r * 0.45, 0, Math.PI * 2);
    gameCtx.fillStyle = '#023047';
    gameCtx.fill();
  }

  function drawGame() {
    drawGameBackground();
    drawMedal();
    drawEnemies();
    drawPlayer();
  }

  function gameLoop(time) {
    if (!gameLastTime) gameLastTime = time;

    const dt = Math.min((time - gameLastTime) / 1000, 0.05);
    gameLastTime = time;

    if (gameState === 'playing') {
      updateGame(dt);
    }

    drawGame();
    gameRafId = requestAnimationFrame(gameLoop);
  }

  window.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTypingField =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable;

    if (gameState === 'playing' && !isTypingField) {
      gameKeys[event.key] = true;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
      }
    }

    if (event.key === 'Enter' && gameState !== 'playing' && !isTypingField) {
      startGame();
    }
  });

  window.addEventListener('keyup', (event) => {
    gameKeys[event.key] = false;
  });

  gameCanvas.addEventListener('mousemove', (event) => {
    const rect = gameCanvas.getBoundingClientRect();

    gameMouse.x = (event.clientX - rect.left) * (GW / rect.width);
    gameMouse.y = (event.clientY - rect.top) * (GH / rect.height);
    gameMouse.active = true;
  });

  gameCanvas.addEventListener('mouseleave', () => {
    gameMouse.active = false;
  });

  gameStartBtn.addEventListener('click', startGame);

  resetGame();
  drawGame();
  gameRafId = requestAnimationFrame(gameLoop);
})();
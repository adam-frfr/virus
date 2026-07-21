(function() {
        // enable instant :active states on mobile
        document.body.addEventListener('touchstart', () => { }, { passive: true });

        // ---------- parallax ----------
        // Dynamic gyroscope and mouse parallax features have been removed.

        // ---------- kinetic typography parser ----------
        function wrapWords(el) {
            const childNodes = Array.from(el.childNodes);
            let html = '';
            childNodes.forEach(node => {
                if (node.nodeType === 3) {
                    const words = node.textContent.split(/(\s+)/);
                    words.forEach(w => {
                        if (w.trim() === '') {
                            html += w;
                        } else {
                            html += '<span class="k-word">' + w + '</span>';
                        }
                    });
                } else if (node.nodeType === 1) {
                    if (node.tagName.toLowerCase() === 'br') {
                        html += '<br>';
                    } else if (node.classList.contains('hl')) {
                        const hlWords = node.textContent.split(/(\s+)/);
                        let hlHtml = '';
                        hlWords.forEach(w => {
                            if (w.trim() === '') hlHtml += w;
                            else hlHtml += '<span class="k-word">' + w + '</span>';
                        });
                        html += '<span class="hl">' + hlHtml + '</span>';
                    } else if (node.tagName.toLowerCase() === 'p') {
                        const pWords = node.textContent.split(/(\s+)/);
                        let pHtml = '';
                        pWords.forEach(w => {
                            if (w.trim() === '') pHtml += w;
                            else pHtml += '<span class="k-word">' + w + '</span>';
                        });
                        html += '<p>' + pHtml + '</p>';
                    } else {
                        html += node.outerHTML;
                    }
                }
            });
            el.innerHTML = html;
        }

        document.querySelectorAll('.poem, .letter').forEach(wrapWords);

        // ---------- kinetic physics & scroll bloom ----------
        let kineticScrollVel = 0;
        let lastScrollY = 0;
        let physicsLag = 0;
        let physicsShift = 0;
        let targetPhysicsLag = 0;
        let targetPhysicsShift = 0;

        document.querySelectorAll('.page').forEach(page => {
            page.addEventListener('scroll', () => {
                const sy = page.scrollTop;
                kineticScrollVel = sy - lastScrollY;
                lastScrollY = sy;

                targetPhysicsLag = Math.max(-8, Math.min(8, kineticScrollVel * 0.15));
                targetPhysicsShift = Math.max(-20, Math.min(20, kineticScrollVel * 0.4));

                const words = page.querySelectorAll('.k-word');
                if (words.length > 0) {
                    const maxScroll = page.scrollHeight - page.clientHeight;
                    const scrollPct = maxScroll > 0 ? sy / maxScroll : 1;

                    const baseReveal = Math.floor(words.length * 0.3);
                    const dynamicReveal = Math.floor(scrollPct * (words.length * 0.7));
                    const totalReveal = baseReveal + dynamicReveal;

                    words.forEach((w, i) => {
                        if (i < totalReveal) {
                            w.classList.add('revealed');
                        } else {
                            w.classList.remove('revealed');
                        }
                    });
                }
            });
        });



        function physicsLoop() {
            targetPhysicsLag *= 0.9;
            targetPhysicsShift *= 0.9;

            const combinedLag = targetPhysicsLag;

            physicsLag += (combinedLag - physicsLag) * 0.15;
            physicsShift += (targetPhysicsShift - physicsShift) * 0.15;

            document.querySelectorAll('.poem, .letter').forEach(el => {
                el.style.setProperty('--physics-lag', physicsLag + 'deg');
                el.style.setProperty('--physics-shift', physicsShift + 'px');
            });

            requestAnimationFrame(physicsLoop);
        }
        physicsLoop();

        // ---------- build stars ----------
        const starsBox = document.getElementById('stars');
        for (let i = 0; i < 70; i++) {
            const s = document.createElement('div');
            s.className = 'star-dot';
            s.style.left = Math.random() * 100 + '%';
            s.style.top = Math.random() * 55 + '%';
            s.style.animationDelay = (Math.random() * 3.6) + 's';
            starsBox.appendChild(s);
        }
        // ---------- fireflies removed ----------

        // ---------- petal builder ----------
        function buildPetals(g) {
            const count = parseInt(g.dataset.count, 10);
            const rx = parseFloat(g.dataset.rx);
            const ry = parseFloat(g.dataset.ry);
            const dist = parseFloat(g.dataset.dist);
            const color = g.dataset.color;
            let html = '';
            for (let i = 0; i < count; i++) {
                const angle = (360 / count) * i;
                html += '<ellipse cx="0" cy="-' + dist + '" rx="' + rx + '" ry="' + ry + '" fill="' + color + '" opacity="0.94" transform="rotate(' + angle + ')"></ellipse>';
            }
            g.innerHTML = html;
        }
        document.querySelectorAll('.petals').forEach(buildPetals);

        // ---------- flower canvas sequences ----------
        const flowerSpritesheet = new Image();
        let flowerSpritesheetLoaded = false;
        const totalFlowerFrames = 51;
        
        flowerSpritesheet.onload = () => {
            flowerSpritesheetLoaded = true;
        };
        flowerSpritesheet.src = 'flower_spritesheet.webp';

        // ---------- loader canvas sequences & logic ----------
        const loaderSpritesheet = new Image();
        let loaderSpritesheetLoaded = false;
        const totalLoaderFrames = 51;
        
        loaderSpritesheet.onload = () => {
            loaderSpritesheetLoaded = true;
        };
        loaderSpritesheet.src = 'loader_spritesheet.webp';

        // ---------- bowww canvas sequences & logic ----------
        const bowwwSpritesheet = new Image();
        let bowwwSpritesheetLoaded = false;
        const totalBowwwFrames = 61;
        
        bowwwSpritesheet.onload = () => {
            bowwwSpritesheetLoaded = true;
        };
        bowwwSpritesheet.src = 'bowww_spritesheet.webp';

        const loadingScreen = document.getElementById('loadingScreen');
        const loaderCanvas = document.getElementById('loaderCanvas');
        const loaderCtx = loaderCanvas ? loaderCanvas.getContext('2d') : null;
        let loaderFrameIndex = 0;
        let loadingStartTime = Date.now();
        let lastLoaderDrawTime = 0;

        // Track static assets
        const staticAssets = ['violet_background.webp', 'butterfly.webp', 'falling_flower.webp', 'falling_flower_3.webp'];
        let staticAssetsLoaded = 0;
        staticAssets.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => staticAssetsLoaded++;
            img.onerror = () => staticAssetsLoaded++; // Prevent hanging if missing
        });

        function drawLoaderLoop(time) {
            // throttle drawing to around 30fps for natural flutter
            if (time - lastLoaderDrawTime > 30) {
                if (loaderCtx && loaderSpritesheetLoaded) {
                    loaderCtx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
                    const sx = (loaderFrameIndex % 10) * 160;
                    const sy = Math.floor(loaderFrameIndex / 10) * 160;
                    loaderCtx.drawImage(loaderSpritesheet, sx, sy, 160, 160, 0, 0, loaderCanvas.width, loaderCanvas.height);
                }
                loaderFrameIndex = (loaderFrameIndex + 1) % totalLoaderFrames;
                lastLoaderDrawTime = time;
            }

            // Check if all assets loaded
            const allFlowersLoaded = flowerSpritesheetLoaded;
            const allLoaderFramesLoaded = loaderSpritesheetLoaded;
            const allBowwwLoaded = bowwwSpritesheetLoaded;
            const allStaticAssetsLoaded = staticAssetsLoaded === staticAssets.length;
            const minTimeElapsed = Date.now() - loadingStartTime >= 1200;

            if (allFlowersLoaded && allLoaderFramesLoaded && allBowwwLoaded && allStaticAssetsLoaded && minTimeElapsed) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.getElementById('passwordOverlay').classList.add('interactive');
                }, 1000);
                return; // Stop loop
            }

            requestAnimationFrame(drawLoaderLoop);
        }

        requestAnimationFrame(drawLoaderLoop);

        function drawFlowerFrame(canvas, frameIndex) {
            const ctx = canvas.getContext('2d', { alpha: true });
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!flowerSpritesheetLoaded) return;
            
            const sx = (frameIndex % 10) * 400;
            const sy = Math.floor(frameIndex / 10) * 400;
            ctx.drawImage(flowerSpritesheet, sx, sy, 400, 400, 0, 0, canvas.width, canvas.height);
        }

        // initial draw
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelectorAll('.flower').forEach(flower => {
                    const canvas = flower.querySelector('.flower-canvas');
                    const pageId = flower.dataset.page;
                    const initialFrame = openedPages.has(pageId) ? totalFlowerFrames - 1 : 0;
                    drawFlowerFrame(canvas, initialFrame);
                });
            }, 300);
        });

        // ---------- flower scrub -> open page ----------
        let currentPage = null;
        const pageBackdrop = document.getElementById('pageBackdrop');
        const openedPages = new Set();
        try {
            const saved = sessionStorage.getItem('openedPages');
            if (saved) JSON.parse(saved).forEach(p => openedPages.add(p));
        } catch (e) { }

        const portalEl = document.getElementById('portal');
        if (openedPages.size >= 5 && portalEl) {
            portalEl.classList.add('visible');
        }

        if (portalEl) {
            portalEl.addEventListener('click', (e) => {
                portalEl.classList.add('portal-press');
                const giftScene = document.getElementById('giftScene');
                
                giftScene.style.setProperty('--click-x', `${e.clientX}px`);
                giftScene.style.setProperty('--click-y', `${e.clientY}px`);
                
                setTimeout(() => {
                    giftScene.classList.add('active');
                }, 150);
            });
        }

        const giftBackBtn = document.getElementById('giftBackBtn');
        if (giftBackBtn) {
            giftBackBtn.addEventListener('click', () => {
                document.getElementById('giftScene').classList.remove('active');
                portalEl.classList.remove('portal-press');
            });
        }

        const giftBox = document.getElementById('giftBox');
        if (giftBox) {
            // Initial draw for static bow frame 0
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const giftCanvas = document.getElementById('giftBoxCanvas');
                    const ctx = giftCanvas ? giftCanvas.getContext('2d') : null;
                    if (ctx && bowwwSpritesheetLoaded) {
                        ctx.drawImage(bowwwSpritesheet, 0, 0, 640, 360, 0, 0, giftCanvas.width, giftCanvas.height);
                    }
                }, 500);
            });

            giftBox.addEventListener('click', () => {
                if (giftBox.classList.contains('opened')) return;
                
                const giftCanvas = document.getElementById('giftBoxCanvas');
                const ctx = giftCanvas ? giftCanvas.getContext('2d') : null;
                
                if (ctx && bowwwSpritesheetLoaded) {
                    let bowFrame = 0;
                    let lastTime = 0;
                    
                    function animateBow(time) {
                        if (time - lastTime > 40) { // ~25 fps
                            ctx.clearRect(0, 0, giftCanvas.width, giftCanvas.height);
                            const sx = (bowFrame % 10) * 640;
                            const sy = Math.floor(bowFrame / 10) * 360;
                            ctx.drawImage(bowwwSpritesheet, sx, sy, 640, 360, 0, 0, giftCanvas.width, giftCanvas.height);
                            
                            if (bowFrame === totalBowwwFrames - 1) {
                                giftBox.classList.add('opened');
                                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                                setTimeout(createPetalBurst, 100);
                                return; // Stop animation loop
                            }
                            bowFrame++;
                            lastTime = time;
                        }
                        requestAnimationFrame(animateBow);
                    }
                    requestAnimationFrame(animateBow);
                }
            });
        }

        function createPetalBurst() {
            const container = document.getElementById('giftScene');
            const numConfetti = 120;
            const colors = ['#C81E4B', '#F3C4D2', '#FFF3EC', '#A981C6'];
            
            for (let i = 0; i < numConfetti; i++) {
                const petal = document.createElement('div');
                petal.className = 'burst-petal';
                
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 300 + 150;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance - 50; // Bias slightly upwards
                
                petal.style.setProperty('--tx', `${tx}px`);
                petal.style.setProperty('--ty', `${ty}px`);
                petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                const size = Math.random() * 8 + 6;
                petal.style.width = `${size}px`;
                petal.style.height = `${size * 1.2}px`;
                petal.style.animationDelay = `${Math.random() * 0.1}s`;
                
                container.appendChild(petal);
                setTimeout(() => petal.remove(), 2000);
            }
        }


        document.querySelectorAll('.flower').forEach(flower => {
            const canvas = flower.querySelector('.flower-canvas');
            const pageId = flower.dataset.page;
            const page = document.getElementById(pageId);
            let currentFrame = openedPages.has(pageId) ? totalFlowerFrames - 1 : 0;
            let touchStartY = 0;
            let isScrubbing = false;

            const openPage = () => {
                if (navigator.vibrate) navigator.vibrate(15);
                flower.classList.add('blooming');
                setTimeout(() => flower.classList.remove('blooming'), 500);

                currentPage = page;
                lastScrollY = 0;
                document.body.classList.add('page-open');
                pageBackdrop.classList.add('show');

                openedPages.add(pageId);
                try {
                    sessionStorage.setItem('openedPages', JSON.stringify(Array.from(openedPages)));
                } catch (e) { }
                if (openedPages.size >= 5) {
                    portalEl.classList.add('visible');
                }

                const rect = flower.getBoundingClientRect();
                const startX = rect.left + rect.width / 2;
                const startY = rect.top + rect.height / 2;
                const w = window.innerWidth;
                const h = window.innerHeight;
                let startTime = performance.now();
                const duration = 600;

                function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }

                page.style.clipPath = `path('M ${startX},${startY} Q ${startX},${startY} ${startX},${startY} L ${startX},${startY} Q ${startX},${startY} ${startX},${startY} Z')`;
                page.classList.add('active');

                function morphLoop(time) {
                    let progress = (time - startTime) / duration;
                    if (progress > 1) progress = 1;
                    let t = easeOutQuart(progress);

                    let pageTop = h * 0.15;
                    let localY = startY - pageTop;

                    let tlX = startX + (0 - startX) * t;
                    let tlY = localY + (0 - localY) * t;
                    let trX = startX + (w - startX) * t;
                    let trY = localY + (0 - localY) * t;
                    let brX = startX + (w - startX) * t;
                    let brY = localY + (h - localY) * t;
                    let blX = startX + (0 - startX) * t;
                    let blY = localY + (h - localY) * t;

                    let tcX = startX + (w / 2 - startX) * t;
                    let tcY = localY + (0 - localY) * t - (Math.sin(progress * Math.PI) * 150);
                    let bcX = tcX;
                    let bcY = localY + (h - localY) * t + (Math.sin(progress * Math.PI) * 150);
                    let lcX = startX + (0 - startX) * t - (Math.sin(progress * Math.PI) * 100);
                    let lcY = localY + (h / 2 - localY) * t;
                    let rcX = startX + (w - startX) * t + (Math.sin(progress * Math.PI) * 100);
                    let rcY = lcY;

                    page.style.clipPath = `path('M ${tlX},${tlY} Q ${tcX},${tcY} ${trX},${trY} Q ${rcX},${rcY} ${brX},${brY} Q ${bcX},${bcY} ${blX},${blY} Q ${lcX},${lcY} ${tlX},${tlY} Z')`;

                    if (progress < 1) {
                        requestAnimationFrame(morphLoop);
                    } else {
                        page.style.clipPath = `path('M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z')`;
                        page.dispatchEvent(new Event('scroll'));
                    }
                }
                requestAnimationFrame(morphLoop);

            };

            // Touch scrubbing
            flower.addEventListener('touchstart', e => {
                touchStartY = e.touches[0].clientY;
                isScrubbing = true;
            }, { passive: true });

            flower.addEventListener('touchmove', e => {
                if (!isScrubbing) return;
                const currentY = e.touches[0].clientY;
                const deltaY = touchStartY - currentY; // dragging UP advances frame

                let frameDelta = Math.floor(deltaY * 0.3);
                if (frameDelta !== 0) {
                    let nextFrame = currentFrame + frameDelta;
                    nextFrame = Math.max(0, Math.min(totalFlowerFrames - 1, nextFrame));

                    if (nextFrame !== currentFrame) {
                        drawFlowerFrame(canvas, nextFrame);
                        currentFrame = nextFrame;
                        touchStartY = currentY;
                    }

                    if (currentFrame === totalFlowerFrames - 1) {
                        isScrubbing = false;
                        openPage();
                    }
                }
            }, { passive: true });

            flower.addEventListener('touchend', () => {
                isScrubbing = false;
            });

            // Fallback click for desktop
            flower.addEventListener('click', () => {
                let frame = currentFrame;
                const loop = () => {
                    frame += 2;
                    if (frame >= totalFlowerFrames - 1) {
                        drawFlowerFrame(canvas, totalFlowerFrames - 1);
                        openPage();
                    } else {
                        drawFlowerFrame(canvas, frame);
                        requestAnimationFrame(loop);
                    }
                };
                requestAnimationFrame(loop);
            });
        });

        // ---------- Elastic Drag-to-Dismiss ----------
        let pageDragStartY = 0;
        let isPageDragging = false;

        document.querySelectorAll('.page').forEach(page => {
            page.addEventListener('touchstart', e => {
                if (page.scrollTop <= 0) {
                    pageDragStartY = e.touches[0].clientY;
                    isPageDragging = true;
                } else {
                    isPageDragging = false;
                }
            }, { passive: true });

            page.addEventListener('touchmove', e => {
                if (!isPageDragging) return;
                let currentY = e.touches[0].clientY;
                let dy = currentY - pageDragStartY;

                if (dy > 0) {
                    let w = window.innerWidth;
                    let h = window.innerHeight;
                    let dragAmount = Math.min(dy, 350);
                    let tcX = e.touches[0].clientX;
                    let tcY = dragAmount * 1.5;

                    page.style.clipPath = `path('M 0,0 Q ${tcX},${tcY} ${w},0 L ${w},${h} L 0,${h} Z')`;
                    let inner = page.querySelector('.page-inner');
                    if (inner) inner.style.transform = `translateY(${dragAmount * 0.4}px)`;
                }
            }, { passive: true });

            page.addEventListener('touchend', e => {
                if (!isPageDragging) return;
                isPageDragging = false;
                let dy = e.changedTouches[0].clientY - pageDragStartY;

                if (dy > 120) {
                    closeCurrentPageWithPhysics(page, dy);
                } else if (dy > 0) {
                    snapBackPhysics(page, dy);
                }
            });
        });

        document.getElementById('globalBackBtn').addEventListener('click', () => {
            if (currentPage) closeCurrentPageWithPhysics(currentPage, 0);
        });
        pageBackdrop.addEventListener('click', () => {
            if (currentPage) closeCurrentPageWithPhysics(currentPage, 0);
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && currentPage) closeCurrentPageWithPhysics(currentPage, 0);
        });

        function closeCurrentPageWithPhysics(page, startY) {
            let w = window.innerWidth;
            let h = window.innerHeight;
            let startTime = performance.now();
            let inner = page.querySelector('.page-inner');

            document.body.classList.remove('page-open');
            pageBackdrop.classList.remove('show');
            if (currentPage === page) currentPage = null;

            function dropLoop(time) {
                let progress = (time - startTime) / 350;
                if (progress > 1) progress = 1;
                let t = progress * progress * progress; // cubic ease-in

                let y = startY + (h + 300 - startY) * t;
                page.style.clipPath = `path('M 0,${y} Q ${w / 2},${y} ${w},${y} L ${w},${h + 300} L 0,${h + 300} Z')`;
                if (inner) inner.style.transform = `translateY(${y * 0.4}px)`;

                if (progress < 1) {
                    requestAnimationFrame(dropLoop);
                } else {
                    page.classList.remove('active');
                    if (inner) inner.style.transform = '';
                    page.style.clipPath = `path('M 0,3000 L 3000,3000 L 3000,3000 L 0,3000 Z')`;
                }
            }
            requestAnimationFrame(dropLoop);
        }

        function snapBackPhysics(page, currentDy) {
            let w = window.innerWidth;
            let h = window.innerHeight;
            let inner = page.querySelector('.page-inner');

            const stiffness = 0.15;
            const damping = 0.65;
            let y = currentDy;
            let vy = 0;

            function springLoop() {
                let force = -stiffness * y;
                vy = (vy + force) * damping;
                y += vy;

                page.style.clipPath = `path('M 0,0 Q ${w / 2},${y * 1.5} ${w},0 L ${w},${h} L 0,${h} Z')`;
                if (inner) inner.style.transform = `translateY(${Math.max(0, y * 0.4)}px)`;

                if (Math.abs(y) > 0.5 || Math.abs(vy) > 0.5) {
                    requestAnimationFrame(springLoop);
                } else {
                    page.style.clipPath = `path('M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z')`;
                    if (inner) inner.style.transform = '';
                }
            }
            requestAnimationFrame(springLoop);
        }

        // ---------- candles ----------
        const candleRow = document.getElementById('candleRow');
        const cakeMsg = document.getElementById('cakeMsg');
        const petalsFall = document.getElementById('petalsFall');
        const totalCandles = 5;
        let litCount = 0;
        for (let i = 0; i < totalCandles; i++) {
            const c = document.createElement('div');
            c.className = 'lightcandle';
            c.innerHTML = '<div class="lflame"></div>';
            c.addEventListener('click', () => {
                if (c.classList.contains('lit')) return;
                c.classList.add('lit');
                if (navigator.vibrate) navigator.vibrate(10);
                litCount++;
                if (litCount === totalCandles) {
                    cakeMsg.classList.add('show');
                    dropPetalsFall(40);
                }
            });
            candleRow.appendChild(c);
        }
        const petalCanvas = document.getElementById('petalCanvas');
        const ctx = petalCanvas.getContext('2d');
        let petals = [];
        let petalAnimFrame = null;

        function resizeCanvas() {
            petalCanvas.width = window.innerWidth;
            petalCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function dropPetalsFall(n) {
            const colors = ['var(--rose)', 'var(--blush)', 'var(--wine)'];
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;

            for (let i = 0; i < n; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 8;
                petals.push({
                    x: cx,
                    y: cy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 5, // initial upward burst
                    rot: Math.random() * Math.PI * 2,
                    rotV: (Math.random() - 0.5) * 0.2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: 1.0,
                    decay: 0.003 + Math.random() * 0.005,
                    size: 4 + Math.random() * 5
                });
            }

            if (!petalAnimFrame) {
                animatePetals();
            }
        }

        function animatePetals() {
            ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
            let active = false;

            for (let i = petals.length - 1; i >= 0; i--) {
                let p = petals[i];

                if (typeof globalPointerX !== 'undefined' && globalPointerX !== -1000) {
                    let dx = p.x - globalPointerX;
                    let dy = p.y - globalPointerY;
                    let dist = Math.hypot(dx, dy);
                    if (dist < 150) {
                        let force = (150 - dist) / 150;
                        p.vx += (dx / dist) * force * 1.5;
                        p.vy += (dy / dist) * force * 1.5;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15; // gravity
                p.vx *= 0.98; // horizontal friction
                p.rot += p.rotV;
                p.life -= p.decay;

                if (p.life > 0 && p.y < petalCanvas.height + 20) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot);
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;

                    // Draw teardrop/petal shape
                    ctx.beginPath();
                    ctx.moveTo(0, -p.size);
                    ctx.bezierCurveTo(p.size, -p.size, p.size, p.size, 0, p.size);
                    ctx.bezierCurveTo(-p.size, p.size, -p.size, -p.size, 0, -p.size);
                    ctx.fill();

                    ctx.restore();
                } else {
                    petals.splice(i, 1);
                }
            }

            if (active) {
                petalAnimFrame = requestAnimationFrame(animatePetals);
            } else {
                petalAnimFrame = null;
            }
        }

        // ---------- constellation ----------
        const starsPts = document.querySelectorAll('.star-pt');
        const wishMsg = document.getElementById('wishMsg');
        const skyHint = document.getElementById('skyHint');
        let litStars = new Set();
        let lastLitStar = null;
        let firstLitStar = null;

        function lightStar(star) {
            if (star.classList.contains('lit')) return;
            star.classList.add('lit');
            if (navigator.vibrate) navigator.vibrate(10);
            litStars.add(star.getAttribute('data-i'));

            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            glow.setAttribute('cx', star.getAttribute('cx'));
            glow.setAttribute('cy', star.getAttribute('cy'));
            glow.setAttribute('r', '15');
            glow.setAttribute('fill', 'var(--rose)');
            glow.setAttribute('mask', 'url(#bloomMask)');
            glow.classList.add('star-bloom');
            star.parentNode.insertBefore(glow, star);

            if (!firstLitStar) firstLitStar = star;

            if (lastLitStar) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', lastLitStar.getAttribute('cx'));
                line.setAttribute('y1', lastLitStar.getAttribute('cy'));
                line.setAttribute('x2', star.getAttribute('cx'));
                line.setAttribute('y2', star.getAttribute('cy'));
                line.classList.add('const-line');
                star.parentNode.insertBefore(line, starsPts[0]);
                // trigger animation
                setTimeout(() => line.classList.add('on'), 10);
            }
            lastLitStar = star;

            if (litStars.size === starsPts.length) {
                // close the constellation loop
                if (firstLitStar && firstLitStar !== star) {
                    const closeLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    closeLine.setAttribute('x1', star.getAttribute('cx'));
                    closeLine.setAttribute('y1', star.getAttribute('cy'));
                    closeLine.setAttribute('x2', firstLitStar.getAttribute('cx'));
                    closeLine.setAttribute('y2', firstLitStar.getAttribute('cy'));
                    closeLine.classList.add('const-line');
                    star.parentNode.insertBefore(closeLine, starsPts[0]);
                    setTimeout(() => closeLine.classList.add('on'), 300);
                }
                setTimeout(() => { wishMsg.classList.add('show'); skyHint.style.opacity = '0'; }, 800);
            }
        }

        starsPts.forEach(star => {
            star.addEventListener('click', () => lightStar(star));
        });

        // drag to draw logic
        const skySvg = document.querySelector('.sky svg');
        let isDrawingSky = false;

        function handleSkyMove(clientX, clientY) {
            starsPts.forEach(star => {
                if (star.classList.contains('lit')) return;
                const rect = star.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                if (Math.hypot(clientX - cx, clientY - cy) < 35) {
                    lightStar(star);
                }
            });
        }

        skySvg.addEventListener('pointerdown', e => {
            isDrawingSky = true;
            handleSkyMove(e.clientX, e.clientY);
            e.preventDefault();
        });

        
let pointerMoveTicking = false;
let globalPointerX = -1000;
let globalPointerY = -1000;
window.addEventListener('pointermove', e => {
    globalPointerX = e.clientX;
    globalPointerY = e.clientY;
    if (!pointerMoveTicking) {
        window.requestAnimationFrame(() => {

            if (!isDrawingSky) return;
            handleSkyMove(e.clientX, e.clientY);
        
            pointerMoveTicking = false;
        });
        pointerMoveTicking = true;
    }
});

        window.addEventListener('pointerup', () => {
            isDrawingSky = false;
        });

        // ---------- password overlay ----------
        const pwdOverlay = document.getElementById('passwordOverlay');
        if (sessionStorage.getItem('gardenUnlocked') === 'true') {
            pwdOverlay.classList.add('unlocked');
            // also simulate portal unlocked if all flowers were clicked
            // Though maybe we just let them click flowers again, or they can just enjoy the garden.
        }
        const fingerprintSpritesheet = new Image();
        let fingerprintSpritesheetLoaded = false;
        const totalFingerprintFrames = 101;
        
        fingerprintSpritesheet.onload = () => {
            fingerprintSpritesheetLoaded = true;
        };
        fingerprintSpritesheet.src = 'fingerprint_spritesheet.webp';

        const fpCanvas = document.getElementById('fingerprintCanvas');
        let fpCurrentFrame = 0;
        let fpAnimationId = null;
        let isTouchingFp = false;

        function drawFingerprint(frameIndex) {
            if (!fpCanvas) return;
            const ctx = fpCanvas.getContext('2d', { alpha: true });
            ctx.clearRect(0, 0, fpCanvas.width, fpCanvas.height);
            if (!fingerprintSpritesheetLoaded) return;

            // Spritesheet is 7680x12240 -> 6 cols of 1280x720 frames
            const frameWidth = 1280;
            const frameHeight = 720;
            const sx = (frameIndex % 6) * frameWidth;
            const sy = Math.floor(frameIndex / 6) * frameHeight;

            // Draw image maintaining aspect ratio or filling the canvas
            const scale = Math.min(fpCanvas.width / frameWidth, fpCanvas.height / frameHeight);
            const w = frameWidth * scale;
            const h = frameHeight * scale;
            const dx = (fpCanvas.width - w) / 2;
            const dy = (fpCanvas.height - h) / 2;
            
            ctx.drawImage(fingerprintSpritesheet, sx, sy, frameWidth, frameHeight, dx, dy, w, h);
        }

        // Try to draw frame 0 after a short delay so images have time to load
        window.addEventListener('load', () => {
            setTimeout(() => drawFingerprint(0), 500);
        });

        function animateFingerprint() {
            if (isTouchingFp) {
                if (fpCurrentFrame % 10 === 0 && navigator.vibrate) navigator.vibrate(5);
                fpCurrentFrame += 1;
                if (fpCurrentFrame >= totalFingerprintFrames - 1) {
                    fpCurrentFrame = totalFingerprintFrames - 1;
                    drawFingerprint(fpCurrentFrame);

                    // Unlock sequence
                    if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
                    pwdOverlay.classList.add('unlocked');
                    sessionStorage.setItem('gardenUnlocked', 'true');
                    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                        DeviceOrientationEvent.requestPermission().catch(console.error);
                    }
                    return; // Stop animation
                }
            } else {
                fpCurrentFrame -= 2;
                if (fpCurrentFrame < 0) fpCurrentFrame = 0;
            }

            drawFingerprint(fpCurrentFrame);

            if (fpCurrentFrame > 0 && !isTouchingFp) {
                fpAnimationId = requestAnimationFrame(animateFingerprint);
            } else if (isTouchingFp && fpCurrentFrame < totalFingerprintFrames - 1) {
                fpAnimationId = requestAnimationFrame(animateFingerprint);
            }
        }

        if (fpCanvas) {
            function startFp() {
                if (sessionStorage.getItem('gardenUnlocked') === 'true') return;
                isTouchingFp = true;
                if (fpAnimationId) cancelAnimationFrame(fpAnimationId);
                animateFingerprint();
            }

            function stopFp() {
                if (sessionStorage.getItem('gardenUnlocked') === 'true') return;
                isTouchingFp = false;
                if (fpAnimationId) cancelAnimationFrame(fpAnimationId);
                animateFingerprint();
            }

            fpCanvas.addEventListener('mousedown', startFp);
            fpCanvas.addEventListener('touchstart', startFp, { passive: true });
            window.addEventListener('mouseup', stopFp);
            window.addEventListener('touchend', stopFp);
        }

        // Add scattered falling flowers tied to corner positions
        (function () {
            const numFlowers = 3;
            const positions = [8, 88, 15]; // Matches left/right corners where corner flowers sit
            for (let i = 0; i < numFlowers; i++) {
                let container = document.createElement('div');
                container.className = 'falling-flower-container';
                container.style.left = positions[i] + 'vw';
                container.style.animationDuration = (Math.random() * 12 + 10) + 's';
                container.style.animationDelay = (Math.random() * 10) + 's';
                container.style.width = (Math.random() * 40 + 40) + 'px';

                let img = document.createElement('img');
                img.src = Math.random() > 0.5 ? 'falling_flower.webp' : 'falling_flower_3.webp';
                img.className = 'falling-flower';
                img.style.animationDuration = (Math.random() * 2 + 2) + 's'; // 2s to 4s sway
                img.style.animationDelay = (Math.random() * 2) + 's';

                container.appendChild(img);
                document.body.appendChild(container);
            }
        })();

    // Accessibility additions
    document.querySelectorAll('[role="button"]').forEach(el => {
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });

})();
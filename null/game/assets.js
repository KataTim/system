// ============================================================
// assets.js - 像素角色圖像與地圖素材
// 本檔案生成所有視覺素材 (Assets 物件)
// ============================================================

(function(global) {
    // 內部工具：創建一個32x32的離屏Canvas，並透過繪製函數填充
    function createTileCanvas(drawFn) {
        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // 保持銳利像素
        drawFn(ctx, size);
        return canvas;
    }

    // 將canvas轉為Image物件 (非同步備用，此處直接使用canvas)
    function canvasToImage(canvas) {
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        return img;
    }

    // ----- 定義所有瓦片素材 (索引0~8) -----
    const tileDefs = [
        // 0: 草地
        (ctx, s) => {
            ctx.fillStyle = '#7ec850';
            ctx.fillRect(0, 0, s, s);
            ctx.fillStyle = '#6ab340';
            for (let i = 0; i < 12; i++) {
                const x = Math.floor(Math.random() * s);
                const y = Math.floor(Math.random() * s);
                ctx.fillRect(x, y, 2, 2);
            }
        },
        // 1: 道路 (土路)
        (ctx, s) => {
            ctx.fillStyle = '#c8b878';
            ctx.fillRect(0, 0, s, s);
            ctx.fillStyle = '#b0985c';
            for (let i = 0; i < 6; i++) {
                ctx.fillRect(Math.floor(Math.random() * s), Math.floor(Math.random() * s), 3, 2);
            }
        },
        // 2: 樹 (障礙物)
        (ctx, s) => {
            ctx.fillStyle = '#3d7a2f';
            ctx.fillRect(0, 0, s, s);
            ctx.fillStyle = '#5a4a20';
            ctx.fillRect(12, 16, 8, 16);
            ctx.fillStyle = '#2d5a1f';
            ctx.beginPath();
            ctx.arc(16, 12, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#4a8a30';
            ctx.beginPath();
            ctx.arc(12, 8, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#5a9a3a';
            ctx.beginPath();
            ctx.arc(20, 8, 8, 0, Math.PI * 2);
            ctx.fill();
        },
        // 3: 水 (障礙物)
        (ctx, s) => {
            ctx.fillStyle = '#4a90d9';
            ctx.fillRect(0, 0, s, s);
            ctx.fillStyle = '#60a0e8';
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * s, Math.random() * s, 3 + Math.random() * 4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#80c0ff';
            ctx.fillRect(4, 8, 6, 2);
            ctx.fillRect(20, 20, 8, 2);
        },
        // 4: 房屋牆 (障礙物)
        (ctx, s) => {
            ctx.fillStyle = '#d8c8a0';
            ctx.fillRect(0, 0, s, s);
            ctx.fillStyle = '#b09870';
            ctx.fillRect(2, 2, s-4, s-4);
            ctx.fillStyle = '#e0d0b0';
            ctx.fillRect(4, 4, 10, 10); // 窗
            ctx.fillRect(18, 4, 10, 10);
            ctx.fillStyle = '#604020';
            ctx.fillRect(6, 6, 6, 6);
            ctx.fillRect(20, 6, 6, 6);
        },
        // 5: 房屋地板 (可行走)
        (ctx, s) => {
            ctx.fillStyle = '#c89860';
            ctx.fillRect(0, 0, s, s);
            ctx.fillStyle = '#b07848';
            for (let y = 0; y < s; y += 8) {
                for (let x = (y % 16 === 0 ? 0 : 8); x < s; x += 16) {
                    ctx.fillRect(x, y, 8, 4);
                }
            }
        },
        // 6: 裝飾草 (可行走)
        (ctx, s) => {
            ctx.fillStyle = '#8ec860';
            ctx.fillRect(0, 0, s, s);
            ctx.fillStyle = '#6aa830';
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * s;
                ctx.fillRect(x, Math.random() * 6 + 20, 1, 8);
            }
            ctx.fillStyle = '#7ec040';
            ctx.fillRect(5, 24, 4, 8);
            ctx.fillRect(22, 22, 3, 10);
        },
        // 7: 石頭 (障礙物)
        (ctx, s) => {
            ctx.fillStyle = '#a0a0a0';
            ctx.fillRect(0, 0, s, s);
            ctx.fillStyle = '#808080';
            ctx.beginPath();
            ctx.ellipse(16, 18, 13, 10, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#909090';
            ctx.beginPath();
            ctx.ellipse(12, 14, 7, 5, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#707070';
            ctx.fillRect(8, 20, 16, 6);
        },
        // 8: 寶箱 (裝飾/收集品)
        (ctx, s) => {
            ctx.fillStyle = '#8b5a2b';
            ctx.fillRect(6, 12, 20, 14);
            ctx.fillStyle = '#a06830';
            ctx.fillRect(4, 10, 24, 6);
            ctx.fillStyle = '#f0c040';
            ctx.fillRect(12, 14, 8, 6);
            ctx.fillStyle = '#d4a020';
            ctx.fillRect(14, 8, 4, 4);
            ctx.fillStyle = '#000';
            ctx.fillRect(15, 16, 2, 2);
        }
    ];

    // 生成瓦片Canvas陣列
    const tiles = tileDefs.map(def => createTileCanvas(def));

    // ----- 角色幀生成 (32x32) -----
    function createCharacterFrame(drawFn) {
        return createTileCanvas((ctx, s) => {
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.clearRect(0, 0, s, s);
            drawFn(ctx, s);
        });
    }

    // 玩家方向圖像：down, up, left, right；每個方向4幀 (行走動畫)
    const playerFrames = {
        down: [],
        up: [],
        left: [],
        right: []
    };

    // 繪製玩家基礎圖案 (根據方向與幀偏移)
    function drawPlayerBase(ctx, dir, frame) {
        const s = 32;
        // 身體
        ctx.fillStyle = '#4488ff';
        ctx.fillRect(10, 14, 12, 14);
        // 頭
        ctx.fillStyle = '#ffcc88';
        ctx.fillRect(10, 4, 12, 12);
        // 眼睛
        ctx.fillStyle = '#000';
        if (dir === 'down') {
            ctx.fillRect(13, 8, 2, 3);
            ctx.fillRect(18, 8, 2, 3);
        } else if (dir === 'up') {
            ctx.fillRect(13, 7, 2, 2);
            ctx.fillRect(18, 7, 2, 2);
        } else if (dir === 'left') {
            ctx.fillRect(11, 8, 2, 3);
            ctx.fillRect(16, 8, 2, 3);
        } else if (dir === 'right') {
            ctx.fillRect(15, 8, 2, 3);
            ctx.fillRect(20, 8, 2, 3);
        }
        // 腿部 (根據幀變化)
        const legShift = frame % 4;
        if (dir === 'down' || dir === 'up') {
            const baseY = 28;
            ctx.fillStyle = '#3366aa';
            ctx.fillRect(11, baseY, 4, 4 + (legShift % 2) * 2);
            ctx.fillRect(17, baseY, 4, 4 + ((legShift+1) % 2) * 2);
        } else {
            const baseY = 28;
            ctx.fillStyle = '#3366aa';
            ctx.fillRect(11 + legShift, baseY, 4, 4);
            ctx.fillRect(17 - legShift, baseY, 4, 4);
        }
        // 帽子或頭髮
        ctx.fillStyle = '#333';
        if (dir === 'down') ctx.fillRect(9, 2, 14, 4);
        else if (dir === 'up') ctx.fillRect(9, 2, 14, 4);
        else if (dir === 'left') ctx.fillRect(8, 2, 14, 4);
        else ctx.fillRect(10, 2, 14, 4);
    }

    // 生成四個方向各4幀
    ['down', 'up', 'left', 'right'].forEach(dir => {
        for (let f = 0; f < 4; f++) {
            playerFrames[dir].push(createCharacterFrame((ctx, s) => drawPlayerBase(ctx, dir, f)));
        }
    });

    // NPC 幀 (靜態)
    const npcFrame = createCharacterFrame((ctx, s) => {
        ctx.fillStyle = '#e09060';
        ctx.fillRect(10, 14, 12, 14); // 身體
        ctx.fillStyle = '#ffcc88';
        ctx.fillRect(10, 4, 12, 12); // 頭
        ctx.fillStyle = '#000';
        ctx.fillRect(13, 8, 2, 3);
        ctx.fillRect(18, 8, 2, 3);
        ctx.fillStyle = '#6b4226';
        ctx.fillRect(9, 2, 14, 5); // 帽子
        ctx.fillStyle = '#aaa';
        ctx.fillRect(6, 7, 4, 10); // 鬍子
        ctx.fillRect(22, 7, 4, 10);
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(8, 26, 16, 4); // 鞋子
    });

    // 玩家幀獲取函數
    function getPlayerFrame(dir, frame, moving) {
        if (!moving) frame = 0;
        const frames = playerFrames[dir] || playerFrames['down'];
        return frames[frame % frames.length];
    }

    // 匯出全域 Assets 物件
    const Assets = {
        tiles: tiles,                // 瓦片Canvas陣列 (0~8)
        playerFrames: playerFrames,  // 完整幀資料 (可選)
        getPlayerFrame: getPlayerFrame,
        npcFrame: npcFrame
    };

    global.Assets = Assets;

})(window);

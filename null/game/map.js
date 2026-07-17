// ============================================================
// map.js - 地圖數據定義
// 包含地圖瓦片陣列、寶箱位置、NPC與玩家起始點
// ============================================================

(function(global) {
    // 地圖尺寸：40列 x 30行 (每個瓦片32px)
    const COLS = 40;
    const ROWS = 30;

    // 瓦片類型：
    // 0: 草地, 1: 道路, 2: 樹(障礙), 3: 水(障礙),
    // 4: 房屋牆(障礙), 5: 房屋地板, 6: 裝飾草, 7: 石頭(障礙)
    const tileMap = [
        // 使用陣列快速生成邊界樹木，內部手動設計村莊與道路
    ];

    // 初始化全部為草地 (0)
    for (let r = 0; r < ROWS; r++) {
        tileMap[r] = new Array(COLS).fill(0);
    }

    // 設置邊界為樹木 (障礙)
    for (let r = 0; r < ROWS; r++) {
        tileMap[r][0] = 2;
        tileMap[r][COLS-1] = 2;
    }
    for (let c = 0; c < COLS; c++) {
        tileMap[0][c] = 2;
        tileMap[ROWS-1][c] = 2;
    }

    // 添加水域 (障礙)
    function setArea(startRow, startCol, rows, cols, tileType) {
        for (let r = startRow; r < startRow + rows && r < ROWS; r++) {
            for (let c = startCol; c < startCol + cols && c < COLS; c++) {
                if (r >= 0 && c >= 0) tileMap[r][c] = tileType;
            }
        }
    }

    // 中央偏左的小湖
    setArea(8, 4, 5, 6, 3);
    setArea(10, 6, 3, 4, 3);
    // 右下河流
    setArea(22, 28, 6, 3, 3);
    setArea(24, 25, 2, 5, 3);

    // 村莊區域 (道路+房屋)
    // 主幹道路 (橫向)
    for (let c = 5; c < 35; c++) {
        if (tileMap[15][c] === 0) tileMap[15][c] = 1;
        if (tileMap[16][c] === 0) tileMap[16][c] = 1;
    }
    // 縱向道路
    for (let r = 5; r < 25; r++) {
        if (tileMap[r][20] === 0) tileMap[r][20] = 1;
        if (tileMap[r][21] === 0) tileMap[r][21] = 1;
    }

    // 房屋1 (左上區域)
    setArea(5, 8, 6, 7, 4); // 牆
    setArea(6, 9, 4, 5, 5); // 地板
    tileMap[8][11] = 5; // 入口處地板
    tileMap[9][11] = 5;
    tileMap[8][12] = 5;
    tileMap[9][12] = 5;
    // 房屋2 (右下區域)
    setArea(20, 27, 6, 7, 4);
    setArea(21, 28, 4, 5, 5);
    tileMap[23][30] = 5;
    tileMap[24][30] = 5;

    // 添加裝飾草 (隨機點綴)
    for (let r = 2; r < ROWS-2; r++) {
        for (let c = 2; c < COLS-2; c++) {
            if (tileMap[r][c] === 0 && Math.random() < 0.12) {
                tileMap[r][c] = 6;
            }
        }
    }

    // 添加一些石頭障礙
    const stonePos = [[7,18], [12,6], [18,25], [25,10], [10,28]];
    stonePos.forEach(([r,c]) => { if (tileMap[r][c] === 0) tileMap[r][c] = 7; });

    // 寶箱位置 (像素座標，基於32px瓦片，放在中心)
    const treasures = [
        { x: 10 * 32 + 16, y: 22 * 32 + 16 }, // 左下森林邊緣
        { x: 24 * 32 + 16, y: 8 * 32 + 16 },  // 右上石頭附近
        { x: 32 * 32 + 16, y: 19 * 32 + 16 }  // 右下房屋後方
    ];

    // NPC 定義
    const npcs = [
        {
            x: 14 * 32 + 16,  // 站在道路交叉口
            y: 17 * 32 + 16,
            dialog: "歡迎冒險者！聽說北方湖邊和右下屋後藏有寶箱。"
        },
        {
            x: 8 * 32 + 16,   // 左上房屋附近
            y: 10 * 32 + 16,
            dialog: "這片森林很危險，小心樹叢裡的石頭。"
        }
    ];

    // 玩家起始位置 (道路入口)
    const playerStart = {
        x: 5 * 32 + 16,
        y: 16 * 32 + 16
    };

    // 匯出 GameMap 物件
    const GameMap = {
        tileMap: tileMap,
        treasures: treasures,
        npcs: npcs,
        playerStart: playerStart
    };

    global.GameMap = GameMap;

})(window);

function LoadMi(t) {
    /*
        t value: đối tượng game OJ có:
            asset là danh sách các tài nguyên
            fitCon() trả về container toàn màn hình
        nowload(...) từ bên ngoài để tải asset
            listid: mảng Id thứ tự asset cần tải. vd: [6,5,7]
            finevent: function chạy khi kết thúc
            style: Phong cách tải.
                0: thanh hình vuông đen
        getAsset(id) từ bên ngoài để lấy tài nguyên
    */
	//Biến trỏ đối tượng
	var se = this;
	//Kiểu tải
	this.loadstyle = 0;
	//Trò chơi được nạp vào
	this.gameIn = t;
	//Asset
	this.asset = t.asset;
	//Biến preload
	this.loadQ = new createjs.LoadQueue(true);
	//khung đồ họa
	this.canv = t.Fitcon();
	//Các method
	this.stepload = function (e) {
		if (se.loadstyle == 0) {
			se.canv.getChildAt(0).y = se.gameIn.gameH / 4;
			se.canv.getChildAt(0).x = se.loadQ.progress * se.gameIn.gameW - se.gameIn.gameW;
			console.log(se.loadQ.progress * se.gameIn.gameW - se.gameIn.gameW);
		}
    }
    // Tạo list từ danh sách listid
	this.makelist = function (listid) {
		var listload = [];
		for (var i = 0; i < listid.length; i++)
			listload.push(se.asset[i]);
		return listload;
    }
    // (Bên ngoài) gọi để bắt đầu tải
	this.nowload = function (listid, finevent, style) {
		this.loadstyle = style;
		var listload = this.makelist(listid);
		this.canv.removeAllChildren;
		this.gameIn.stage.addChild(se.canv);
		if (style == 0) {
			var ThanhTai=new createjs.Shape(new createjs.Graphics().beginFill("#000000").drawRect(0, 0, se.gameIn.gameW, se.gameIn.gameH / 8));
			ThanhTai.cache(0,0,se.gameIn.gameW, se.gameIn.gameH / 8);
			this.canv.addChild(
				ThanhTai
			);
		}
		this.loadQ.on("complete", finevent);
		this.loadQ.loadManifest(listload);
	}
	this.getAsset = function (id) {
		return this.loadQ.getResult(id);
	}
	//Cài đặt loadQ
	createjs.Sound.alternateExtensions = ["aac"];
	this.loadQ.installPlugin(createjs.Sound);
	this.loadQ.on("progress", se.stepload);
}
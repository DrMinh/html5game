/* GameOJ quản lý trò chơi */
//Khai báo
var gameOJ={
	stage: null, // Màn chính
	stage1: null, // Màn menu
	stage2: null, // Màn chơi
	loadMC: null,
	asset: null,
	Socket: null,
	gameW: 0,
	gameH: 0,
	gameSW: 0,
	gameSH: 0,
	gameTT: 0, //Trạng thái game: 0-loading 1-Menu 2-Chọn bảng đồ 3-Đang chơi
	gameNN: 0, //Số đếm trò chơi
	Sound: [],
	SoundMark: [],
	bulletList: [],
	playerList: [],
	enemyList: [],
	effectList: [],
	scoreList: {
		value: [],
		updated: false,
		redraw: false,
		enemyPoint: 0,
		teamPoint: 0
	},
	schema: [],
	slotInfor: null,
	currentMap: null,
	currentTheme: null,
	player: null,
	SpriteSheetList: [],
	AniL1NameList: [],
	playerControl: null,
	pingtime: 0,
	userNameInput: null,
	pickedTank: 1,
	playerID: null,
	playerTeam: null,
	dataTeam: null,
	dataDead: null,
	userNameUpdateList: null,
	tankStyleUpdateList: null,
	moveTankData: {
		Y: null,
		B: null,
		E: null,
		H: null,
		HE: null
	},
	gameTime: 0,
	gameEnd: {
		endCode: 0,
		point: 0,
		lastEnemy: ''
	},
	canvasOfLayer: {
		mapL1Layer: null,
		mapL1_5Layer: null,
		mapL2Layer: null
	},
	staticValues: {
		// Number stage 2
		mapL1LayerNumber: 0,
		aniL1LayerNumber: 1,
		mapL1_5LayerNumber: 2,
		mapItemLayerNumber: 3,
		tankLayerNumber: 4,
		enemyLayerNumber: 5,
		bulletLayerNumber: 6,
		mapL2LayerNumber: 7,
		effectLayerNumber: 8,
		scoreLayerNumber: 9,
		controlLayerNumber: 10,
		alertLayerNumer: 11,
	},
	socketName: {
		// Build in buildSchema() method
	},
	gameSetting: {
		allowSound: 1,
		fullScreen: 0
	},
	bulletInfor: {
		tank1: {
			speed: 6,
			dame: 50,
			effect: [1],
			sound: 'shoot1'
		},
		tank2: {
			speed: 5,
			dame: 50,
			effect: [11],
			sound: 'shoot1'
		},
		tank3: {
			speed: 5,
			dame: 80,
			effect: [9,10],
			sound: 'shoot3'
		},
		// Skill
		tank1_1: {
			speed: 5,
			dame: 150,
			effect: [15],
			sound: 'skill1_1'
		},
		tank3_1: {
			speed: 5,
			dame: 50,
			effect: [16],
			sound: 'shoot3'
		},
		// enemy bullet
		enemy1: {
			size: 10,
			speed: 3,
			dame: 180,
			effect: [18],
			sound: 'shoote1'
		}
	},
	skillData: {
		tank1_1: {
			countdown_default : 5000,
			type: 1,
			sprite: 'skill1_1'
		},
		tank2_1: {
			countdown_default : 10000,
			type: 3,
			sprite: 'skill2_1'
		},
		tank3_1: {
			countdown_default : 5000,
			type: 1,
			sprite: 'skill3_1'
		},
	},
	skillValue: {
		k1: {
			countdown: 0
		}
	},
	effectSound: {
		effect2: 'effect2',
		effect13: 'effect3',
		effect14: 'effect3',
		effect7: 'effect4',
		effectitem: 'effectitem'
	},
	unknownData: {
		scoreListValue: []
	},
	// effectSound: {
	// 	effect2: 'effect2',
	// 	effect13: 'effect2',
	// 	effect14: 'effect2',
	// },
	addCon: function(ten, lop){
		var se=this;
		se[ten]=lop;
	},
	KetThua: function(lopcha,lopcon){
		lopcon.prototype = Object.create(lopcha.prototype);
		lopcon.prototype.constructor=lopcon;
	},
	setval: function(){
		// Socket
		gameOJ.Socket = io("//tanknode.herokuapp.com", {
			parser: customParser
		}); ////tanknode.herokuapp.com
		//// Build schema for decode
		gameOJ.buildSchema();
		/// Build event
		gameOJ.Socket.on(gameOJ.socketName.tank, function(data){
			gameOJ.saveTankData(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.bullet, function(data){
			gameOJ.saveBulletData(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.enemy, function(data){
			gameOJ.saveEnemyData(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.hideTank, function(data){
			gameOJ.saveHideTankData(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.hideEnemy, function(data){
			gameOJ.saveHideEnemyData(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.updateEffect, function(data){
			gameOJ.applyEffect(data);
		});
		gameOJ.Socket.on("map_infor", function(data){
			gameOJ.getAndBuildMap(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.rebuildEffect, function(data){
			if(data.length === '') return;
			gameOJ.applyEffect(data, false);
		});
		gameOJ.Socket.on(gameOJ.socketName.updateUserName, function(data){
			gameOJ.saveUpdateUserName(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.updateTankStyle, function(data){
			gameOJ.saveUpdateTankStyle(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.updatePlayer, function(data){
			gameOJ.savePlayerID(data.playerID);
			gameOJ.gameTime = data.currentTime;
			gameOJ.playerTeam = data.playerTeam;
		});
		gameOJ.Socket.on(gameOJ.socketName.updateScore, function(data){
			gameOJ.saveScore(data);
		});
		gameOJ.Socket.on("update_status", function(data){
			gameOJ.updateStatus(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.updateSkill, function(data){
			gameOJ.updateSkill(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.updateSlot, function(data){
			gameOJ.updateSlot(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.updateTeam, function(data){
			gameOJ.saveDataTeam(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.updateDead, function(data){
			gameOJ.saveDeadData(data);
		});
		gameOJ.Socket.on(gameOJ.socketName.deadBullet, function(data){
			gameOJ.saveDetroyedBullet(data);
		});
		gameOJ.Socket.on("rp", function(data){
			gameOJ.saveLogoutPlayer(data);
		});
		// Input
		gameOJ.userNameInput = document.getElementById('inputArea');
		gameOJ.userNameInput.addEventListener("submit",(e)=>{
			var name = document.getElementById('userJoinGameName').value;
			if(!gameOJ.checkUserName(name)){
				document.getElementById('namerule').style.display = "block";
				e.preventDefault();
				return;
			}
			//Born player
			gameOJ.userNameInput.style.display = "none";
			document.getElementById('namerule').style.display = "none";
			if(gameOJ.stage1.numChildren !== 0){
				let nickName = gameOJ.stage1.getChildAt(gameOJ.stage1.numChildren - 2);
				nickName.getChildAt(nickName.numChildren - 1).text = name;
				nickName.cache(0,0,200,30);
			}
			e.preventDefault();
		});
		//Màn hình
		gameOJ.gameH=300;
		gameOJ.gameW=500;
		gameOJ.gameSH=1;
		gameOJ.gameSW=1;
		//
		//stage
		gameOJ.stage=new  createjs.StageGL("demoCanvas"); //,{preserveBuffer: true}
		gameOJ.stage1=new createjs.Container();
		gameOJ.stage2=new createjs.Container();
		gameOJ.stage3=new createjs.Container();
		gameOJ.stage3.visible = false;
		
		gameOJ.stage.addChild(gameOJ.stage1,gameOJ.stage2, gameOJ.stage3);
		//List tải
		gameOJ.asset=[
			// Image
			{src:"./asset/boxy_bold_fat.png", id:"boxy_font"},
			{src:"./asset/resize.jpg", id:"resize"},
			{src:"./asset/bullet_1.png", id:"bullet"},
			{src:"./asset/tankBase.png", id:"tankBase"},
			{src:"./asset/tankBigSize.png", id:"tankBigSize"},
			{src:"./asset/tankTurret.png", id:"tankTurret"},
			{src:"./asset/enemy.png", id:"enemy"},
			{src:"./asset/enemy_turret.png", id:"enemyTurret"},
			{src:"./asset/effect.png", id:"effect"},
			{src:"./asset/map_1.png", id:"map_1"},
			{src:"./asset/hpbar.png", id:"hpbar"},
			{src:"./asset/menuimage_r.png", id:"menuImage"},
			{src:"./asset/UIList.png", id:"uiList"},
			{src:"./asset/effect_p.png", id:"effect_p"},
			{src:"./asset/dropItem.png", id:"dropItem"},
			{src:"./asset/icon.png", id:"icon"},
			{src:"./asset/skill.png", id:"skill"},
			{src:"./asset/logo.png", id:"logo"},
			// Static Data
			{src:"./static/itemmap.json", id:"itemmap"},
			// Map file
			// {src:"./map/map2.json", id:"map2"},
			// {src:"./map/map1.json", id:"map1"},
			{src:"./map/map3.json", id:"map3"},
			// theme
			{src:"./sound/theme1.ogg", id:"theme1"},
			// Sound
			{src:"./sound/shoot1.ogg", id:"shoot1"},
			{src:"./sound/shoot1.ogg", id:"shoot3"},

			{src:"./sound/skill1_1.ogg", id:"skill1_1"},

			{src:"./sound/shoote1.ogg", id:"shoote1"},
			
			{src:"./sound/item.ogg", id:"effectitem"},
			{src:"./sound/effect2.ogg", id:"effect2"},
			{src:"./sound/effect3.ogg", id:"effect3"},
			{src:"./sound/effect4.ogg", id:"effect4"},

			{src:"./sound/win1.ogg", id:"win1"},
			{src:"./sound/tickingL.ogg", id:"ticking"},
			{src:"./sound/bell.ogg", id:"bell"},
			{src:"./sound/s1.ogg", id:"s1"},
			{src:"./sound/kill.ogg", id:"kill"},

			
			{src:"./sound/peffect1.ogg", id:"peffect1"},
			{src:"./sound/peffect7.ogg", id:"peffect7"},
		];
		//biến tải
		gameOJ.loadMC=new LoadMi(gameOJ);
		//Tick eventdw
		createjs.Ticker.addEventListener("tick", gameOJ.tick);
		//createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.timingMode=createjs.Ticker.RAF;
		//createjs.Ticker.timingMode=createjs.Ticker.TIMEOUT
		createjs.Ticker.framerate = 60;
		gameOJ.stage.enableMouseOver(20);
		gameOJ.stage.mouseEnabled = true;
		createjs.Touch.enable(gameOJ.stage);
		gameOJ.stage.snapToPixelEnabled=true;
		//Tải nhạc
		this.AddSound();
		//
		//Ngăn ảnh bị nhòe
		// var canvas = document.getElementById('demoCanvas');
		// var ctx = canvas.getContext('2d');
		// ctx.imageSmoothingEnabled = false;
		gameOJ.FixCanvas();
		window.addEventListener('resize', gameOJ.FixCanvas);
	},
	AddSound: function(){
		this.Sound['shoot1'] = new Howl({
			src: ['sound/shoot1.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['shoot1'] = -1;

		this.Sound['shoot3'] = new Howl({
			src: ['sound/shoot3.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['shoot3'] = -1;

		this.Sound['skill1_1'] = new Howl({
			src: ['sound/skill1_1.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['shoot3'] = -1;

		this.Sound['shoote1'] = new Howl({
			src: ['sound/shoote1.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['shoote1'] = -1;

		this.Sound['effect2'] = new Howl({
			src: ['sound/effect2.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['effect2'] = -1;

		this.Sound['effect3'] = new Howl({
			src: ['sound/effect3.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['effect3'] = -1;

		this.Sound['effect4'] = new Howl({
			src: ['sound/effect4.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['effect4'] = -1;

		this.Sound['effectitem'] = new Howl({
			src: ['sound/item.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['effectitem'] = -1;

		this.Sound['peffect1'] = new Howl({
			src: ['sound/peffect1.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['peffect1'] = -1;

		this.Sound['peffect7'] = new Howl({
			src: ['sound/peffect7.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['peffect7'] = -1;

		this.Sound['win1'] = new Howl({
			src: ['sound/win1.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['win1'] = -1;

		this.Sound['bell'] = new Howl({
			src: ['sound/bell.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['bell'] = -1;

		this.Sound['s1'] = new Howl({
			src: ['sound/s1.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['s1'] = -1;
		this.Sound['kill'] = new Howl({
			src: ['sound/kill.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['kill'] = -1;
		this.Sound['ticking'] = new Howl({
			src: ['sound/tickingL.ogg'],
			autoplay: false,
			loop: false,
			volume: 0.2,
		});
		this.SoundMark['ticking'] = -1;

		this.Sound['theme1'] = new Howl({
			src: ['sound/theme1.ogg'],
			autoplay: false,
			loop: true,
			volume: 0.2,
		});
		this.SoundMark['theme1'] = -1;
	},
	playSound: function(id,lengthX, lengthY, avoidMulti = 0){
		if(avoidMulti){
			if(gameOJ.SoundMark[id] === avoidMulti) return;
			else {
				gameOJ.SoundMark[id] = avoidMulti;
			}
		}

		let volume = 1;
		let sub = Math.max(lengthY, lengthX);
		volume = 1 - (~~(sub/50)) * 0.1;
		if(volume <= 0) {
			return;
		}
		gameOJ.Sound[id].volume(volume);
		gameOJ.Sound[id].play();
	},

	openFullscreen: function() {
		if(document.fullscreenElement) return;
		gameOJ.gameSetting.fullScreen = 1;
		var element = gameOJ.stage.canvas;
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	},
	exitFullscreen: function() {
		if(!document.fullscreenElement) return;
		gameOJ.gameSetting.fullScreen = 0;
		if(document.exitFullscreen) {
		  document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
		  document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
		  document.webkitExitFullscreen();
		}
	},
	changeSoundGame: function(volume){
		gameOJ.gameSetting.allowSound= volume;
		Howler.volume(volume);
	},
	buildSchema: function(customBuilder = customParser.PacketBuilder){
		var eventID = 0;
		///// CLIENT Send
		gameOJ.socketName['moveTank'] = ++ eventID;
		customBuilder.build(eventID,
			'int8'
		);

		gameOJ.socketName['shootBullet'] = ++ eventID;
		customBuilder.build(eventID,
			'float32'
		);

		gameOJ.socketName['shootSkill'] = ++ eventID;
		customBuilder.build(eventID,
			{
				t: 'uint8',
				r: 'float32',
				p: 'string'
			}
		);

		gameOJ.socketName['buildItem'] = ++ eventID;
		customBuilder.build(eventID,
			[
				'uint8'
			]
		);
		
		//// SERVER send
		gameOJ.socketName['tank'] = ++ eventID;
		customBuilder.build(eventID,
			[
				{
					p: 'string',
					x: 'int16',
					y: 'int16',
					g: 'float32',
					m: 'int16',
					t: 'int16',
					e: ['uint8'],
					s: 'float32',
					reload: 'uint16',
					moveAngle: 'float32'
				}
			]
		);

		gameOJ.socketName['bullet'] = ++ eventID;
		customBuilder.build(eventID,
			[
				{
					i: 'string', 
					p: 'string',
					x: 'int16',
					y: 'int16',
					r: 'float32',
					n: 'int8',
					s: 'string'
				}
			]
		);
		
		gameOJ.socketName['updateEffect'] = ++ eventID;
		customBuilder.build(eventID,
			'string'
		);

		gameOJ.socketName['rebuildEffect'] = ++ eventID;
		customBuilder.build(eventID,
			'string'
		);

		gameOJ.socketName['deadBullet'] = ++ eventID;
		customBuilder.build(eventID,
			['string']
		);

		gameOJ.socketName['updateDead'] = ++ eventID;
		customBuilder.build(eventID,
			[{
				playerId: 'string',
				time: 'uint32'
			}]
		);

		gameOJ.socketName['updateScore'] = ++ eventID;
		customBuilder.build(eventID,
			[{
				playerID: 'string',
				d: 'int8',
				point: 'int8'
			}]
		);

		gameOJ.socketName['hideTank'] = ++ eventID;
		customBuilder.build(eventID,
			['string']
		);

		gameOJ.socketName['enemy'] = ++ eventID;
		customBuilder.build(eventID,
			[
				{
					p: 'string',
					x: 'int16',
					y: 'int16',
					g: 'float32',
					m: 'int16',
					t: 'int16',
					e: ['uint8'],
					s: 'float32',
					reload: 'uint16',
					team: 'string',
					style: 'string',
					moveAngle: 'float32'
				}
			]
		);

		gameOJ.socketName['hideEnemy'] = ++ eventID;
		customBuilder.build(eventID,
			['string']
		);

		gameOJ.socketName['deadEnemy'] = ++ eventID;
		customBuilder.build(eventID,
			[{
				playerId: 'string',
				time: 'uint32'
			}]
		);

		gameOJ.socketName['updatePlayer'] = ++ eventID;
		customBuilder.build(eventID,
			{
				playerID: 'string',
				currentTime: 'uint32',
				playerTeam: 'string'
			}
		);

		gameOJ.socketName['updateUserName'] = ++ eventID;
		customBuilder.build(eventID,
			[{
				playerName: 'string',
				playerID: 'string'
			}]
		);

		gameOJ.socketName['updateTankStyle'] = ++ eventID;
		customBuilder.build(eventID,
			[{
				p: 'string',
				s: 'string'
			}]
		);

		gameOJ.socketName['updateSkill'] = ++ eventID;
		customBuilder.build(eventID,
			[{
				index: 'int8',
				countDown: 'uint32'
			}]
		);

		gameOJ.socketName['updateTeam'] = ++ eventID;
		customBuilder.build(eventID,
			[{
				playerID: 'string',
				teamID: 'string'
			}]
		);

		gameOJ.socketName['updateSlot'] = ++ eventID;
		customBuilder.build(eventID,
			[{
				playerID: 'string',
				slotList: ['int8'],
				unlimitSlot: ['int8'],
				updateItem: ['int8'],
			}]
		);
	},
	checkUserName: function(userName){
		var userNameCheck = /^[0-9a-zA-Z_]{4,15}$/;
		if(userName.match(userNameCheck))
		{
			return true;
		}
		else{
			return false;
		}
	},
	buildAfterLoad: function() {
		this.saveItemInfor();
		this.CreateAnimation();
	},
	saveItemInfor: function() {
		gameOJ.slotInfor = gameOJ.loadMC.getAsset("itemmap");
	},
	getSlotInfor: function(slotIndex) {
		if(slotIndex >= gameOJ.slotInfor.length) return null;
		return gameOJ.slotInfor[slotIndex];
	},
	CreateAnimation: function(){
		// resize dude
		var dataResize = {
			images: [gameOJ.loadMC.getAsset("resize")],
			frames: {width:170, height:180},
			animations: {
				main: [0, 38, true, 0.5]
			}
		};
		this.SpriteSheetList["resize"]=new createjs.SpriteSheet(dataResize);
		var resizeVideo = new createjs.Sprite(this.SpriteSheetList["resize"]);
		resizeVideo.gotoAndPlay('main');
		resizeVideo.scaleX = gameOJ.gameW / 170;
		resizeVideo.scaleY = gameOJ.gameH / 180;
		gameOJ.stage3.addChild(resizeVideo);
		// Base
		var dataTankBase = {
			images: [gameOJ.loadMC.getAsset("tankBase")],
			frames: {width:32, height:32},
			animations: {
				tank1: 0,
				tank2: 1,
				tank3: 2
			}
		};
		this.SpriteSheetList["TankBase"]=new createjs.SpriteSheet(dataTankBase);
		//Turret
		var dataTankTurret = {
			images: [gameOJ.loadMC.getAsset("tankTurret")],
			frames: {width:32, height:32},
			animations: {
				tank1: 0,
				tank1s: [1,3, 'tank1', 0.5],
				tank2: 4,
				tank2s: [5,7, 'tank2', 0.5],
				tank3: 8,
				tank3s: [9,10, 'tank3', 0.5],
			}
		};
		this.SpriteSheetList["TankTurret"]=new createjs.SpriteSheet(dataTankTurret);
		// Enemy
		var dataEnemy = {
			images: [gameOJ.loadMC.getAsset("enemy")],
			frames: {width:50, height:50},
			animations: {
				enemy1: 0
			}
		};
		this.SpriteSheetList["Enemy"]=new createjs.SpriteSheet(dataEnemy);
		//Turret
		var dataEnemyTurret = {
			images: [gameOJ.loadMC.getAsset("enemyTurret")],
			frames: {width:50, height:50},
			animations: {
				enemy1: 0,
				enemy1s: [1,3, 'enemy1', 0.5],
			}
		};
		this.SpriteSheetList["EnemyTurret"]=new createjs.SpriteSheet(dataEnemyTurret);
		// Tank big size
		var dataTankBigSize = {
			images: [gameOJ.loadMC.getAsset("tankBigSize")],
			frames: {width:50, height:50},
			animations: {
				tank1: [0,3,true,0.1],
				tank2: [4,7,true,0.1],
				tank3: [8,11,true,0.1],
			}
		};
		this.SpriteSheetList["TankBigSize"]=new createjs.SpriteSheet(dataTankBigSize);
		//Bullet
		var dataBullet = {
			images: [gameOJ.loadMC.getAsset("bullet")],
			frames: {width:50, height:50},
			animations: {
				tank1: 0,
				tank2: 1,
				tank3: 2,

				// Skill
				tank1_1: [3,6,true, 0.5],
				tank3_1: [7],

				// enemy
				enemy1: [8,11,true, 0.5]
			}
		};
		this.SpriteSheetList["bullet"]=new createjs.SpriteSheet(dataBullet);
		//effect
		var dataEffect = {
			images: [gameOJ.loadMC.getAsset("effect")],
			frames: {width: 50, height: 50},
			animations: {
				effect1: [0,6, false, 0.5],
				effect2: [7,16, false, 0.3],
				effect3: [17,21, false, 0.3],
				effect4: [22,26, false, 0.3],
				effect5: [27],
				effect6: [28,36, false, 0.3],
				effect7: [37,43, false, 0.2],
				effect8: [44,52, false, 0.2],
				effect9: [53, 58, false, 0.5],
				effect10: [59],
				effect11: [60, 65, false, 0.5],
				effect12: [66, 71, false, 0.1],
				effect13: [72,73, false, 0.1],
				effect14: [74,75, false, 0.1],
				effect15: [76,83, false ,0.3],
				effect16: [84,93, false ,0.2],
				effect17: [94,100, false ,0.3],
				effect18: [101,108, false ,0.3]
			}
		};
		this.SpriteSheetList["effect"]=new createjs.SpriteSheet(dataEffect);
		// effect_p
		var dataEffect_p = {
			images: [gameOJ.loadMC.getAsset("effect_p")],
			frames: {width: 50, height: 50},
			animations: {
				effect1: [0,2, true, 0.5],
				effect2: [3,5, true, 0.5],
				effect3: [6,9, true, 0.5],
				effect4: [10,14, true, 0.2],
				effect5: [15],
				effect6: [16, 19, true, 0.3],
				effect10: [20],
				effect11: [21,24, true, 0.3],
			}
		};
		this.SpriteSheetList["effect_p"]=new createjs.SpriteSheet(dataEffect_p);
		// item
		var dataItem = {
			images: [gameOJ.loadMC.getAsset("dropItem")],
			frames: {width: 50, height: 50},
			animations: {
				item1: 0,
				item2: [1,2,true,0.1],
				item3: [4,8,true,0.1],
				item4: [10,14,true, 0.1],
				item5: [16,20,true, 0.1],

				// Slot
				slot1: 3,
				slot2: 9,
				slot3: 15,
				slot4: 21,
				slot5: 22,
				slot6: 23,
				slot7: 24,
				slot8: 25,
				slot9: 26,
			}
		};
		this.SpriteSheetList["item"]=new createjs.SpriteSheet(dataItem);
		// icon
		var dataIcon = {
			images: [gameOJ.loadMC.getAsset("icon")],
			frames: {width: 50, height: 50},
			animations: {
				board: 0,
				kill1: 1,
				kill2: 2,
				kill3: 3,
				kill4: 4,
				kill5: [4,7,true, 0.5],
				fullScreenGo: 8,
				fullScreenExit: 9,
				soundAllow: 10,
				soundNotAllow: 11,
				emptySlot: 12,
				buildItem: 13,
				buildBack: 14,
				install: 15,
				installOff: 16,
				closeIcon: 17
			}
		};
		this.SpriteSheetList["icon"]=new createjs.SpriteSheet(dataIcon);
		// icon
		var dataLogo = {
			images: [gameOJ.loadMC.getAsset("logo")],
			frames: {width: 200, height: 64},
			animations: {
				victory: [1,3,true,0.1],
				defeat: [4],
			}
		};
		this.SpriteSheetList["logo"]=new createjs.SpriteSheet(dataLogo);
		// skill
		var dataSkill = {
			images: [gameOJ.loadMC.getAsset("skill")],
			frames: {width: 40, height: 40},
			animations: {
				back: [0],
				skill1_1: [1],
				skill2_1: [2],
				skill3_1: [3],
			}
		};
		this.SpriteSheetList["skill"]=new createjs.SpriteSheet(dataSkill);
		// font
		var dataFont = {
			images: [gameOJ.loadMC.getAsset("boxy_font")],
			frames: {width: 9, height: 8},
			animations: {
				'c0': 0,
				'c1': 1,
				'c2': 2,
				'c3': 3,
				'c4': 4,
				'c5': 5,
				'c6': 6,
				'c7': 7,
				'c8': 8,
				'c9': 9,
				'c:': 82,
				'c_': 79,
				'c+':65,
				'c.': 68,
				'c?': 35,
				'c!': 69,
				'c-': 67,
				'A': 10,
				'B': 11,
				'C': 12,
				'D': 13,
				'E': 14,
				'F': 15,
				'G': 16,
				'H': 17,
				'I': 18,
				'J': 19,
				'K': 20,
				'L': 21,
				'M': 22,
				'N': 23,
				'O': 24,
				'P': 25,
				'Q': 26,
				'R': 27,
				'S': 28,
				'T': 29,
				'U': 30,
				'V': 31,
				'W': 32,
				'X': 33,
				'Y': 34,
				'Z': 35,
				a:39,b:40,c:41,d:42,e:43,f:44,g:45,h:46,i:47,j:48,k:49,l:50,m:51,n:52,o:53,p:54,q:55,r:56,s:57,t:58,u:59,v:60,w:61,x:62,y:63,z:64
			}
		};
		this.SpriteSheetList["font"]=new createjs.SpriteSheet(dataFont);
		//map
		var dataMap_1 = {
			images: [gameOJ.loadMC.getAsset("map_1")],
			frames: {width:16, height:16},
			animations: {
				'a123': {
					frames: [123,124,125,163,164,165],
					next: true,
					speed: 0.1
				},
				'a16': {
					frames: [16,18,20,96,98,100],
					next: true,
					speed: 0.1
				},
				'a17': {
					frames: [17,19,21,97,99,101],
					next: true,
					speed: 0.1
				},
				'a56': {
					frames: [56,58,60,136,138,140],
					next: true,
					speed: 0.1
				},
				'a57': {
					frames: [57,59,61,137,139,141],
					next: true,
					speed: 0.1
				},
			},
		};
		this.SpriteSheetList["map_1"]=new createjs.SpriteSheet(dataMap_1);
		this.AniL1NameList.push(123, 16, 17, 56, 57);
		//hpbar
		var dataHpbar = {
			images: [gameOJ.loadMC.getAsset("hpbar")],
			frames: {width: 60, height: 20},
		};
		this.SpriteSheetList["hpbar"]=new createjs.SpriteSheet(dataHpbar);
	},
	resetGame: function(){
		gameOJ.bulletList = [];
		gameOJ.playerList = [];
		gameOJ.enemyList = [];
		gameOJ.effectList = [];
		gameOJ.scoreList = {
			value: [],
			updated: false,
			redraw: false
		};
		gameOJ.currentMap = null;
		gameOJ.player = null;
		gameOJ.pingtime = 0;
	},
	createMap: function(mapName){
		mapData = gameOJ.loadMC.getAsset(mapName);
		gameOJ.currentMap = mapData;
		// Background down
		var bigBackground = new createjs.Container();
		for( var tileIndex = 0; tileIndex < mapData.layers[0].data.length; tileIndex ++){
			var tileNumber = mapData.layers[0].data[tileIndex] - 1;
			var selectedCol = tileIndex % mapData.width;
			var selectedRow = Math.floor(tileIndex / mapData.width);
			if(tileNumber === -1) continue;
			var tile = new createjs.Sprite(this.SpriteSheetList["map_1"]);
			if(this.AniL1NameList.indexOf(tileNumber) === -1){
				tile.gotoAndStop(tileNumber);
				// if(tileNumber === 283){
				// 	tile.alpha = 0.5;
				// }
				tile.x = selectedCol * mapData.tilewidth;
				tile.y = selectedRow * mapData.tileheight;
				bigBackground.addChild(tile);
			}
			else {
				tile.gotoAndPlay('a' + tileNumber);
				// if(tileNumber === 283){
				// 	tile.alpha = 0.5;
				// }
				tile.x = selectedCol * mapData.tilewidth;
				tile.y = selectedRow * mapData.tileheight;
				gameOJ.stage2.getChildAt(gameOJ.staticValues.aniL1LayerNumber).addChild(tile);
			}
			// update Row
			selectedCol ++;
			if(selectedCol >= mapData.width){
				selectedRow ++;
				selectedCol = 0;
			}
		}
		// supply
		for( var supplyIndex = 0; supplyIndex < mapData.layers[5].objects.length; supplyIndex ++){
			let supplydata = mapData.layers[5].objects[supplyIndex];
			let supply = new createjs.Bitmap(gameOJ.loadMC.getAsset("map_1"));
			supply.sourceRect = new createjs.Rectangle(496,368,32,32);
			supply.x = supplydata.x - 8;
			supply.y = supplydata.y - 8;
			bigBackground.addChild(supply);
		}
		bigBackground.cache(0, 0, mapData.width * mapData.tilewidth, mapData.height * mapData.tileheight);
		var backgroundDisplay = new createjs.Bitmap(bigBackground.cacheCanvas);
		backgroundDisplay.sourceRect=new createjs.Rectangle(0,0,gameOJ.gameW,gameOJ.gameH);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL1LayerNumber).addChild(backgroundDisplay);
		bigBackground.removeAllChildren();
		gameOJ.canvasOfLayer.mapL1Layer = bigBackground;
		// Background mid
		var bigMidBackground = new createjs.Container();
		for( var tileIndex = 0; tileIndex < mapData.layers[1].data.length; tileIndex ++){
			var tileNumber = mapData.layers[1].data[tileIndex] - 1;
			var selectedCol = tileIndex % mapData.width;
			var selectedRow = Math.floor(tileIndex / mapData.width);
			if(tileNumber === -1) continue;
			var tile = new createjs.Sprite(this.SpriteSheetList["map_1"]);
			tile.gotoAndStop(tileNumber);
			tile.x = selectedCol * mapData.tilewidth;
			tile.y = selectedRow * mapData.tileheight;
			bigMidBackground.addChild(tile);
			// update Row
			selectedCol ++;
			if(selectedCol >= mapData.width){
				selectedRow ++;
				selectedCol = 0;
			}
		}
		bigMidBackground.cache(0, 0, mapData.width * mapData.tilewidth, mapData.height * mapData.tileheight);
		var midBackgroundDisplay = new createjs.Bitmap(bigMidBackground.cacheCanvas);
		midBackgroundDisplay.sourceRect=new createjs.Rectangle(0,0,gameOJ.gameW,gameOJ.gameH);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL1_5LayerNumber).addChild(midBackgroundDisplay);
		bigMidBackground.removeAllChildren();
		gameOJ.canvasOfLayer.mapL1_5Layer = bigMidBackground;
		// Background up
		var bigUpBackground = new createjs.Container();
		for( var tileIndex = 0; tileIndex < mapData.layers[2].data.length; tileIndex ++){
			var tileNumber = mapData.layers[2].data[tileIndex] - 1;
			var selectedCol = tileIndex % mapData.width;
			var selectedRow = Math.floor(tileIndex / mapData.width);
			if(tileNumber === -1) continue;
			var tile = new createjs.Sprite(this.SpriteSheetList["map_1"]);
			tile.gotoAndStop(tileNumber);
			tile.x = selectedCol * mapData.tilewidth;
			tile.y = selectedRow * mapData.tileheight;
			bigUpBackground.addChild(tile);
			// update Row
			selectedCol ++;
			if(selectedCol >= mapData.width){
				selectedRow ++;
				selectedCol = 0;
			}
		}
		bigUpBackground.cache(0, 0, mapData.width * mapData.tilewidth, mapData.height * mapData.tileheight);
		var upBackgroundDisplay = new createjs.Bitmap(bigUpBackground.cacheCanvas);
		upBackgroundDisplay.sourceRect=new createjs.Rectangle(0,0,gameOJ.gameW,gameOJ.gameH);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL2LayerNumber).addChild(upBackgroundDisplay);
		bigUpBackground.removeAllChildren();
		gameOJ.canvasOfLayer.mapL2Layer = bigUpBackground;

		if(Boolean(mapData.theme)){
			gameOJ.playSound(mapData.theme, 300, 300);
			gameOJ.currentTheme = mapData.theme;
		}
		else {
			gameOJ.playSound('theme1', 300, 300);
			gameOJ.currentTheme = 'theme1';
		}
	},
	FixCanvas: function(){
		gameOJ.stage.canvas.width=window.innerWidth;
		gameOJ.stage.canvas.height=window.innerHeight;
		gameOJ.gameSH=gameOJ.stage.canvas.height/gameOJ.gameH;
		gameOJ.gameSW=gameOJ.stage.canvas.width/gameOJ.gameW;
		gameOJ.stage.scaleX=gameOJ.gameSW;gameOJ.stage.scaleY=gameOJ.gameSH;
		gameOJ.stage.updateViewport(gameOJ.stage.canvas.width,gameOJ.stage.canvas.height);
		if(window.innerHeight > window.innerWidth){
			gameOJ.stage3.visible = true;
		}
		else {
			gameOJ.stage3.visible = false;
		}
	},
	Fitcon: function(){
		var newcon=new createjs.Container();
		newcon.scaleX=gameOJ.gameSW;
		newcon.scaleY=gameOJ.gameSH;
		return newcon;
	},
	buildText: function(text, maxLine, demoCon = null, color = null){
		let textCon = demoCon || new createjs.Container();
		let lineX = 0;
		let lineY = 0;
		let word = text.split(/[\s\/]/);
		let wordIndex = 0;
		let newWord = 0;
		for(let i = 0; i < text.length; i++){
			let char = text.charAt(i);
			if(char === ' '){
				lineX += 10;
				wordIndex++;
				newWord = 1;
			}
			else if( char === '/'){
				lineX = 0;
				lineY += 11;
				wordIndex++;
				newWord = 1;
			}
			else {
				if( newWord && lineX + word[wordIndex].length * 10 > maxLine){
					lineX = 0;
					lineY += 11;
				}

				let numberGet = char.match(/[a-z]/i)? '':'c';
				let sprite = new createjs.Sprite(gameOJ.SpriteSheetList["font"], numberGet + char);
				sprite.x = lineX;
				sprite.y = lineY;

				textCon.addChild(sprite);
				lineX += 10;
				newWord = 0;
			}
		}
		textCon.cache(0,0,maxLine + 10,lineY + 11);
		textCon.removeAllChildren();
		textCon.text = text;
		return textCon;
	},
	clearCanvas: function(){
		gameOJ.stage.removeAllChildren();
		gameOJ.stage1.removeAllChildren();
		gameOJ.stage2.removeAllChildren();
		//gameOJ.stage3.removeAllChildren();
		// Tạo lớp chứa
		var tankCon = new createjs.Container();
		var enemyCon = new createjs.Container();
		var bulletCon = new createjs.Container();
		var effectCon = new createjs.Container();
		var mapL1Con = new createjs.Container();
		var aniL1Con = new createjs.Container();
		var mapL1_5Con = new createjs.Container();
		var mapItemCon = new createjs.Container();
		var mapL2Con = new createjs.Container();
		var scoreCon = new createjs.Container();
		var alertCon = new createjs.Container();
		var controlCon = new createjs.Container();
		gameOJ.stage2.addChild(
			mapL1Con,
			aniL1Con,
			mapL1_5Con,
			mapItemCon,
			tankCon,
			enemyCon,
			bulletCon, 
			effectCon, 
			mapL2Con, 
			scoreCon, 
			controlCon, 
			alertCon
		);
		// Add vào stage gốc
		gameOJ.stage.addChild(gameOJ.stage1,gameOJ.stage2, gameOJ.stage3);
	},
	changeTT: function(num){
		gameOJ.gameTT=num;
		gameOJ.gameNN=0;
		gameOJ.playerID = null,
		gameOJ.playerTeam = null;
		//Clear
		gameOJ.clearCanvas();
	},
	createFinishMenu: function(endGame){
		//
		if(gameOJ.currentTheme !== null){
			gameOJ.Sound[gameOJ.currentTheme].volume(0.2);
		}
		// Disable touch sceen
		gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).alpha = 0;
		// alert dead banner
		var youDeadBanner = new createjs.Bitmap(gameOJ.loadMC.getAsset("uiList"));
		youDeadBanner.sourceRect = new createjs.Rectangle(18,24,302,45);
		youDeadBanner.regX = youDeadBanner.sourceRect.width / 2;
		youDeadBanner.regY = youDeadBanner.sourceRect.height / 2;
		youDeadBanner.x = gameOJ.gameW / 2;
		youDeadBanner.y = gameOJ.gameH / 2 - 45*2;
		// alert endgame banner
		var endGameBanner = new createjs.Bitmap(gameOJ.loadMC.getAsset("uiList"));
		endGameBanner.sourceRect = new createjs.Rectangle(26,230,302,60);
		endGameBanner.regX = endGameBanner.sourceRect.width / 2;
		endGameBanner.regY = endGameBanner.sourceRect.height / 2;
		endGameBanner.x = gameOJ.gameW / 2;
		endGameBanner.y = gameOJ.gameH / 2 - 45*2;
		// Victory
		var vicBanner = new createjs.Sprite(this.SpriteSheetList["logo"], 'victory');
		vicBanner.regX = 100;
		vicBanner.regY = 32;
		vicBanner.x = gameOJ.gameW / 2;
		vicBanner.y = gameOJ.gameH / 2 - 45*2;
		// Defeat
		var deBanner = new createjs.Sprite(this.SpriteSheetList["logo"], 'defeat');
		deBanner.regX = 100;
		deBanner.regY = 32;
		deBanner.x = gameOJ.gameW / 2;
		deBanner.y = gameOJ.gameH / 2 - 45*2;
		// point
		let lastEnemyIndex = gameOJ.findPlayer(endGame.lastEnemy);
		if(endGame.endCode === 1 && lastEnemyIndex !== -1){
			var enemyName = gameOJ.playerList[lastEnemyIndex].playerName;
		}
		else {
			var enemyName = '__';
		}

		var endBoard = new createjs.Container();
		var background = new createjs.Shape(new createjs.Graphics().beginFill("#000000").drawRect(0, 0, 220, 100));
		var pointNumber = new createjs.Text(endGame.point+'', "20px Arial", '#FFFFFF');
		var killerName = new createjs.Text(enemyName, "20px Arial", '#FFFFFF');
		var pointNumberText = new createjs.Text('Point:', "20px Arial", '#FFFFFF');
		var killerText = new createjs.Text('Enemy:', "20px Arial", '#FFFFFF');

		pointNumberText.maxWidth = 100;
		pointNumberText.x = 20;
		pointNumberText.y = 20;
		pointNumber.maxWidth = 100;
		pointNumber.x = 100;
		pointNumber.y = 20;
		killerName.maxWidth = 100;
		killerName.x = 100;
		killerName.y = 40;
		killerText.maxWidth = 100;
		killerText.x = 20;
		killerText.y = 40;

		endBoard.addChild(background, pointNumberText, killerText, pointNumber, killerName);
		endBoard.cache(0, 0, 220, 150);
		endBoard.regX = 220 / 2;
		endBoard.regY = 150 / 2;
		endBoard.alpha = 0.8;
		endBoard.x = gameOJ.gameW / 2;
		endBoard.y = gameOJ.gameH / 2 + 30;

		// go back button
		var goBackButton = new createjs.Bitmap(gameOJ.loadMC.getAsset("uiList"));
		goBackButton.sourceRect = new createjs.Rectangle(85,93,180,60);
		goBackButton.regX = goBackButton.sourceRect.width / 2;
		goBackButton.regY = goBackButton.sourceRect.height / 2;
		goBackButton.x = gameOJ.gameW / 2;
		goBackButton.y = gameOJ.gameH / 2 + 100;
		goBackButton.on("click", function(){
			if(gameOJ.currentTheme !== null){
				gameOJ.Sound[gameOJ.currentTheme].stop();
				gameOJ.currentTheme = null;
			}
			gameOJ.leaveMatch();
			gameOJ.changeTT(1);
		});
		// Add all
		if(endGame.endCode === 2){
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).removeAllChildren();
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).addChild(
				endGameBanner,
				goBackButton, 
				endBoard
			);
		}
		else if(endGame.endCode === 1) {
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).removeAllChildren();
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).addChild(
				youDeadBanner,
				goBackButton,
				endBoard
			);
		}
		else if(endGame.endCode === 3){
			gameOJ.playSound('win1', 0, 0);
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).removeAllChildren();
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).addChild(
				vicBanner,
				goBackButton,
				endBoard
			);
		}
		else if(endGame.endCode === 4){
			gameOJ.playSound('shoot1', 0, 0);
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).removeAllChildren();
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).addChild(
				deBanner,
				goBackButton,
				endBoard
			);
		}
	},
	updateScoreList: function(){
		if(gameOJ.stage2.getChildAt(gameOJ.staticValues.scoreLayerNumber).numChildren !== 0){
			var board = gameOJ.stage2.getChildAt(gameOJ.staticValues.scoreLayerNumber).getChildAt(0);
		}
		else {
			var board = new createjs.Container();
			board.alpha = 0.8;
			board.x = gameOJ.gameW/2 - 240/2;
			board.y = gameOJ.gameH/2 - 200/2;
			board.visible = false;
			gameOJ.stage2.getChildAt(gameOJ.staticValues.scoreLayerNumber).addChild(board);
		}
		board.removeAllChildren();
		board.addChild( new createjs.Shape(new createjs.Graphics().beginFill("#000000").drawRect(0, 0, 240*2, 200*2)) );
		
		var leaderBoardText = new createjs.Text('Leaderboard [G]', "36px Arial", '#FFFFFF');
		leaderBoardText.maxWidth = 120*2;
		leaderBoardText.x = 60*2;
		leaderBoardText.y = 5*2;
		board.addChild(leaderBoardText);

		var teamPoint = [0,0];
		var pointTeamList = new createjs.Container();
		pointTeamList.x = 240;
		pointTeamList.y = 200*2 - 60;
		
		var playerPoint = 999999;

		for(var i = 0; i < gameOJ.scoreList.value.length ; i++){
			var value = gameOJ.scoreList.value[i];
			if(Boolean(gameOJ.player) && value.playerID === gameOJ.player.playerID){
				teamPoint[0] += parseInt(value.point);
				var color = "green";
				if(i === 0 && value.point > gameOJ.player.killPoint){
					playerPoint = gameOJ.player.killPoint;
				}
				gameOJ.player.updateKillPoint( parseInt(value.point) );
			}
			else if(value.team !== '' && value.team === gameOJ.player.team ) {
				teamPoint[0] += parseInt(value.point);
				var color = "#80b7ff";
			}
			else {
				teamPoint[1] += parseInt(value.point);
				var color = "#ff665e";
			}

			if(i === 1 && parseInt(value.point) >= playerPoint ){
				gameOJ.playSound('s1', 100 , 100);
			}

			var nickName = new createjs.Text(value.nick, "30px Arial", color);
			nickName.maxWidth = 120*2;
			//nickName.cache(0,0,120,15);
			nickName.x = 10*2;
			nickName.y = ((i + 1)*20 + 5)*2;
			var point = new createjs.Text(value.point + '/' + value.dead, "30px Arial", color);
			point.x = 180*2;
			point.y = ((i + 1)*20 + 5)*2;
			point.maxWidth = 120*2;

			//point.cache(0,0,120,15);
			board.addChild(nickName, point);
		}
		for(var pointIndex = 0; pointIndex < teamPoint.length; pointIndex ++){
			var point = new createjs.Text(teamPoint[pointIndex] + '', "30px Arial", pointIndex === 0 ? '#80b7ff' : '#ff665e');
			point.lineWidth = 30*2;
			point.maxWidth = 30 * 2;
			point.x = pointIndex * 30 * 2;
			pointTeamList.regX += 20;

			if(teamPoint.length - pointIndex >= 2){
				var dash = new createjs.Text('-', "30px Arial", '#EEEEEE');
				dash.lineWidth = 30*2;
				dash.maxWidth = 30 * 2;
				dash.x = pointIndex * 30 * 2 + 32;
				pointTeamList.addChild(dash);
			}

			pointTeamList.addChild(point);
		}
		board.addChild(pointTeamList);

		board.cache(0, 0, 240*2, 200*2);
		board.scaleX = board.scaleY = 0.5;
	},
	changeMapCanvas: function(nameLayer, style, spriteNumber, xIndex, yIndex){
		var container = gameOJ.canvasOfLayer[nameLayer];
		var tile = new createjs.Sprite(this.SpriteSheetList["map_1"]);
		tile.x = xIndex * this.currentMap.tilewidth;
		tile.y = yIndex * this.currentMap.tileheight;
		if(style === -1 || style === 0){
			tile.gotoAndStop(0);
			container.addChild(tile);
			container.updateCache('destination-out');
		}
		if(style === 0){
			tile.gotoAndStop(spriteNumber);
			container.updateCache('source-over');
		}
		else if(style === 1){
			container.addChild(tile);
			tile.gotoAndStop(spriteNumber);
			container.updateCache('source-over');
		}
		container.removeAllChildren();
	},
	addItem: function(x, y, type, itemID){
		let newItem = new createjs.Sprite(gameOJ.SpriteSheetList["item"], "item"+type);
		newItem.itemID = itemID;
		newItem.regX = newItem.regY = 16;
		newItem.x = x;
		newItem.y = y;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapItemLayerNumber).addChild(newItem);
	},
	removeItem: function(itemID){
		var layer = gameOJ.stage2.getChildAt(gameOJ.staticValues.mapItemLayerNumber);
		let itemIndex = layer.children.findIndex(
			x => x.itemID === itemID
		);
		if(itemIndex !== -1){
			if(layer.getChildAt(itemIndex).currentAnimation === 'item2'){
				gameOJ.addEffect(layer.getChildAt(itemIndex).x + 8, layer.getChildAt(itemIndex).y + 8, 0, "7");
			}
			layer.removeChildAt(itemIndex);
		}
	},
	
	moveCamera: function(cx,cy,style){
		// cx: vị trí x mục tiêu
		// cy: vị trí y mục tiêu
		// style: 0 - ngay, 1 - từ từ
		var finalX = cx - gameOJ.gameW / 2;
		var finalY = cy - gameOJ.gameH / 2;
		if( finalX < 0) finalX = 0;
		if( finalX > gameOJ.currentMap.width * gameOJ.currentMap.tilewidth - gameOJ.gameW)
			finalX = gameOJ.currentMap.width * gameOJ.currentMap.tilewidth - gameOJ.gameW;
		if( finalY < 0) finalY = 0;
		if( finalY > gameOJ.currentMap.height * gameOJ.currentMap.tileheight - gameOJ.gameH)
			finalY = gameOJ.currentMap.height * gameOJ.currentMap.tileheight - gameOJ.gameH;
		//
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL1LayerNumber).getChildAt(0).sourceRect.x = finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL1LayerNumber).getChildAt(0).sourceRect.y = finalY;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.aniL1LayerNumber).x = -finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.aniL1LayerNumber).y = -finalY;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL1_5LayerNumber).getChildAt(0).sourceRect.x = finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL1_5LayerNumber).getChildAt(0).sourceRect.y = finalY;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapItemLayerNumber).x = -finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapItemLayerNumber).y = -finalY;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL2LayerNumber).getChildAt(0).sourceRect.x = finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL2LayerNumber).getChildAt(0).sourceRect.y = finalY;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.tankLayerNumber).x = - finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.tankLayerNumber).y = - finalY;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.enemyLayerNumber).x = - finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.enemyLayerNumber).y = - finalY;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.bulletLayerNumber).x = - finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.bulletLayerNumber).y = - finalY;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.effectLayerNumber).x = - finalX;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.effectLayerNumber).y = - finalY;
	},
	showAndHideBoard: function( value ){
		if(gameOJ.stage2.getChildAt(gameOJ.staticValues.scoreLayerNumber).numChildren > 0){
			var board = gameOJ.stage2.getChildAt(gameOJ.staticValues.scoreLayerNumber).getChildAt(0);
			board.visible = value;
		}
	},
	buildTimeText: function(){
		var muniteTime = ('00'+ (~~( (gameOJ.gameTime / 1000) / 60)) ).slice(-2);
		var secondTime = ('00'+ (~~( (gameOJ.gameTime / 1000) % 60 )) ).slice(-2);
		secondTime = muniteTime +':'+secondTime;
		var gameTimeSprite = new createjs.Container();
		for(var i = 0; i < secondTime.length; i++){
			let text = new createjs.Sprite(gameOJ.SpriteSheetList['font']);
			text.gotoAndStop('c' + secondTime.charAt(i));
			text.x = i*10;
			gameTimeSprite.addChild(text);
		}
		gameTimeSprite.regX = 20;
		gameTimeSprite.x = gameOJ.gameW / 2;
		gameTimeSprite.y = 2;
		gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).addChild(gameTimeSprite);
	},
	updateTimeText: function(time){
		if(gameOJ.gameTime === 0) return;
		var oldTime = gameOJ.gameTime;
		gameOJ.gameTime -= time;
		if(oldTime > 15000 && gameOJ.gameTime < 15000){
			gameOJ.playSound('bell',0,0);
			gameOJ.playSound('ticking',100,100);
		}
		// else if(oldTime > 3000 && gameOJ.gameTime < 3000){
		// 	gameOJ.playSound('ticking',100,100);
		// }
		var muniteTime = ('00'+ (~~( (gameOJ.gameTime / 1000) / 60)) ).slice(-2);
		var secondTime = ('00'+ (~~( (gameOJ.gameTime / 1000) % 60 )) ).slice(-2);
		secondTime = muniteTime +':'+secondTime;
		var timeLayer = gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(
			gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).numChildren - 1
		);
		for(var i = 0; i < secondTime.length; i++){
			timeLayer.getChildAt(i).gotoAndStop( 'c' + secondTime.charAt(i) );
		}
	},
	blockGame: function(){
		if(gameOJ.gameTT === 2){
			gameOJ.playerControl.clearMove();
		}
	},
	findPlayer: function(cid){
		return gameOJ.playerList.findIndex( (x) => {return x.playerID === cid} );
	},
	findEnemy: function(cid){
		return gameOJ.enemyList.findIndex( (x) => {return x.playerID === cid} );
	},
	findBullet: function(cid){
		return gameOJ.bulletList.findIndex( (x) => {return x.bulletID === cid} );
	},
	addPlayer: function(cx,cy,cid, playerName){
		var newPlayer = new gameOJ.Player(cx,cy,cid, playerName);
		gameOJ.playerList.push(newPlayer);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.tankLayerNumber).addChild(newPlayer.tankGraphic);
	},
	addEnemy: function(cx,cy,cid, enemyName, enemyStyle){
		var newEnemy = new gameOJ.Enemy(cx,cy,cid, enemyName,enemyStyle);
		gameOJ.enemyList.push(newEnemy);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.enemyLayerNumber).addChild(newEnemy.tankGraphic);
	},
	addBullet: function(cx, cy, angle, playerID, bulletID, style, isNotReal = false){
		var newBullet = new gameOJ.Bullet(cx, cy, angle, playerID, bulletID, style, isNotReal);
		gameOJ.bulletList.push(newBullet);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.bulletLayerNumber).addChild(newBullet.bulletGraphic);
	},
	addEffect: function(cx, cy, angle, style, isFixed = false, specialSprite = null ){
		var newEffect = new gameOJ.Effect(cx, cy, angle, style, gameOJ.effectList.length,isFixed, specialSprite);
		gameOJ.effectList.push(newEffect);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.effectLayerNumber).addChild(newEffect.effectGraphic);
	},
	removePlayer: function(cid, knowIndex = -1){
		var index = knowIndex !== -1 ? knowIndex : gameOJ.findPlayer(cid);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.tankLayerNumber).removeChild(gameOJ.playerList[index].tankGraphic);
		gameOJ.playerList.splice(index,1);
		// score board
		var scoreIndex = gameOJ.scoreList.value.findIndex(x => x.playerID === cid);
		if(scoreIndex !== -1){
			gameOJ.scoreList.value.splice(scoreIndex,1);
			gameOJ.scoreList.redraw = true;
		}
	},
	removeEnemy: function(cid, knowIndex = -1){
		let index = knowIndex !== -1 ? knowIndex : gameOJ.findEnemy(cid);
		let Enemy = gameOJ.enemyList[index];
		gameOJ.stage2.getChildAt(gameOJ.staticValues.enemyLayerNumber).removeChild(Enemy.tankGraphic);
		gameOJ.enemyList.splice(index,1);
	},
	removeBullet: function(cid){
		var index = gameOJ.findBullet(cid);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.bulletLayerNumber).removeChild(gameOJ.bulletList[index].bulletGraphic);
		gameOJ.bulletList.splice(index,1);
	},
	removeEffect: function(cid){
		gameOJ.stage2.getChildAt(gameOJ.staticValues.effectLayerNumber).removeChildAt(cid);
		gameOJ.effectList.splice(cid,1);
	},
	updateScoreListNick: function(){
		var hasUnknown = false;
		for(var i = 0; i< gameOJ.scoreList.value.length; i++){
			if(gameOJ.scoreList.value[i].nick === '@'){
				var index = gameOJ.findPlayer(gameOJ.scoreList.value[i].playerID);
				
				if(index !== -1){
					gameOJ.scoreList.value[i].nick = gameOJ.playerList[index].playerName;
					gameOJ.scoreList.value[i].team = gameOJ.playerList[index].team;
				}
				else {
					gameOJ.scoreList.updated = true;
					hasUnknown = true;
				}
			}
		}
		return hasUnknown;
	},
	stopAllPlayer: function(){
		for(var i = 0; i < gameOJ.playerList.length; i++){
			var player = gameOJ.playerList[i];
			player.addNewPosition(player.tankPoint.x + 1, player.tankPoint.y + 1, -1);
		}
	},
	displayKillIcon: function(number){
		if(number > 5){
			number = 5;
		}
		var graphic = gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(3);
		graphic.visible = true;
		graphic.displayScore = 1000;
		gameOJ.playSound('kill', 300 , 300);
		graphic.gotoAndPlay('kill'+number);
	},
	createInGameMenu: function(){
		let simpleRect = new createjs.Shape(
			new createjs.Graphics().beginFill("#000000").drawRect(15, 15, 20, 20)
		); // use for hitTest icon
		//
		let leaderImage = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'board');
		leaderImage.hitArea = simpleRect;
		leaderImage.on('mousedown',()=>{
			gameOJ.showAndHideBoard(true);
		});
		leaderImage.on('pressup',()=>{
			gameOJ.showAndHideBoard(false);
		});

		//skill
		let skillBoard = new createjs.Container();
		let spaceSkill = new createjs.Sprite(gameOJ.SpriteSheetList['skill'], 'skill1_1');
		let background = new createjs.Sprite(gameOJ.SpriteSheetList['skill'], 'back');
		let spaceCountdown = new createjs.Container();
		spaceCountdown.x = 12;
		spaceCountdown.y = 12;
		skillBoard.addChild( background,spaceSkill, spaceCountdown);
		skillBoard.alpha = 0.8;
		skillBoard.regX = skillBoard.regY = 20;
		skillBoard.x = gameOJ.gameW / 2;
		skillBoard.y = gameOJ.gameH - 20;
		spaceCountdown.scaleX = spaceCountdown.scaleY = 2;

		// Dead countdown
		let deadNumber = new createjs.Container();
		deadNumber.scaleX = deadNumber.scaleY = 5;
		deadNumber.x = gameOJ.gameW / 2 - 25;
		deadNumber.y = gameOJ.gameH / 2 - 25;
		deadNumber.countdown = 0;

		// Skill metal
		let skillMetal = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'kill1');
		skillMetal.x = gameOJ.gameW / 2 - 25;
		skillMetal.y = gameOJ.gameH / 2 - 120;
		skillMetal.visible = false;
		skillMetal.displayScore = 0;
		skillMetal.on('tick', ()=>{
			if(skillMetal.displayScore > 0){
				skillMetal.displayScore -= 17;
				if(skillMetal.displayScore <= 0){
					skillMetal.visible = false;
				}
			}
		});

		// Item shop
		let itemShop = new createjs.Container();

		let shopStaticBack = new createjs.Container();
		let shopBack = new createjs.Shape(
			new createjs.Graphics().beginFill("#000000").drawRect(0, 0, 400, 250)
		)
		shopBack.alpha = 0.8;
		let SlotEmpty = new createjs.Container();
		SlotEmpty.y = 200;
		let SlotCon = new createjs.Container();
		SlotCon.y = 200;

		shopStaticBack.addChild(shopBack, SlotEmpty);

				
		let buildInforCon = new createjs.Container();

		for(let slotIndex = 0; slotIndex < 5; slotIndex ++){
			// empty
			let newEmptySlot = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'emptySlot');
			newEmptySlot.x = slotIndex * 26;
			SlotEmpty.addChild(newEmptySlot);
			// slot
			let newSlot = new createjs.Sprite(gameOJ.SpriteSheetList['item'], 'slot1');
			newSlot.x = slotIndex * 26;
			newSlot.visible = false;
			SlotCon.addChild(newSlot);
		}

		let unlimitCon = new createjs.Container();
		unlimitCon.y = 150;
		for(let unlimitSlotIndex = 0; unlimitSlotIndex < 3; unlimitSlotIndex ++){
			let newEmptySlot = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'emptySlot');
			newEmptySlot.x = unlimitSlotIndex * 26;
			newEmptySlot.y = -24;
			SlotEmpty.addChild(newEmptySlot);
			// // slot
			let newSlot = new createjs.Sprite(gameOJ.SpriteSheetList['item'], 'slot'+(unlimitSlotIndex+1));
			newSlot.x = unlimitSlotIndex * 26;
			newSlot.y = -24;
			// Number
			let number = gameOJ.buildText('0', 30);
			number.x = unlimitSlotIndex * 26  + 25 - 10;
			number.y = 50;
			//
			SlotEmpty.addChild(newSlot);
			unlimitCon.addChild(number);
		}

		let productPosition = {x: 0, y: 0};
		let productLayout = new createjs.Container();
		let fastBuildLayout = new createjs.Container();
		fastBuildLayout.y = 40;
		fastBuildLayout.x = 30;
		fastBuildLayout.saveChild = [];
		for(let productIndex = 0; productIndex < gameOJ.slotInfor.length; productIndex ++){
			let product = gameOJ.slotInfor[productIndex];
			if( product.build.length > 0){
				let productCon = new createjs.Container();

				let back = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'buildBack');
				let slot = new createjs.Sprite(gameOJ.SpriteSheetList['item'], 'slot' + product.id);

				back.alpha = 0.8;

				productCon.addChild(back, slot);
				productCon.cache(0,0,50,50);
				productCon.hitArea = simpleRect;
				productCon.removeAllChildren();

				productCon.x = 50 * (productPosition.x ++);

				if(productCon.x === 100){
					productCon.y = 50 * (productPosition.y ++);
					productPosition.x = 0;
				}
				else {
					productCon.y = 50 * productPosition.y;
				}

				productCon.scaleX = productCon.scaleY = 2;

				productLayout.addChild(productCon);
				// Build infor
				let buildCon = new createjs.Container();
				buildCon.x = 200;
				buildCon.scaleY = buildCon.scaleX = 1.5;

				let slotIcon = new createjs.Container();
				let slotIconBack = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'buildBack');
				let slotIconItem = new createjs.Sprite(gameOJ.SpriteSheetList['item'], 'slot' + product.id);
				slotIcon.x = 25;
				slotIcon.y = 10;
				slotIcon.addChild(slotIconBack, slotIconItem);
				

				let name = gameOJ.buildText(product.name, product.name.length * 10);
				name.scaleY = 2;
				name.x = 50 - product.name.length * 5;

				let infor = gameOJ.buildText(product.dic, 120);
				infor.y = 100;

				let buildPart = new createjs.Container();
				buildPart.y = 50;
				if(product.buildNum > 0){
					//Connect line
					let connectLineGraphic = new createjs.Graphics().beginFill("#bff0ff")
					.drawRect(slotIcon.x + 25 - ~~(((product.buildNum - 1) * 25 )/2), 5, (product.buildNum - 1) * 25, 3)
					.drawRect(slotIcon.x + 25 - 2, 0, 4, 6);
					let connectLine = new createjs.Shape(connectLineGraphic);
					
					//
					let evenNum = (product.buildNum % 2 === 0 ? 11:0);
					let childrenX = slotIcon.x + evenNum - ~~(product.buildNum / 2) * 25;
					let countChild = 1;
					let nextChild = 0;
					for(let childrenIndex = 0; childrenIndex < product.buildNum; childrenIndex ++){
						let childrenBack = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'buildBack');
						let children = new createjs.Sprite(gameOJ.SpriteSheetList['item'], 'slot' + product.build[nextChild].id);
						children.x = childrenBack.x = childrenX;
						childrenX += 25;
						connectLineGraphic.drawRect(children.x + 25 + (evenNum > 0 ? 2 : 0) - 2, 5, 4, 6);
						buildPart.addChild(childrenBack, children);

						if(countChild < product.build[nextChild].cost){
							countChild ++;
						}
						else {
							countChild = 1;
							nextChild ++;
						}
					}

					buildPart.addChild(connectLine);
					connectLine.cache(0,-5,(product.buildNum - 1) * 25 + 100, 8 + 100);

					// Add fast build
					let fastBuildProductCon = new createjs.Container();
					let fastProduct = new createjs.Sprite(gameOJ.SpriteSheetList['item'], 'slot' + product.id);
					let fastProductBack = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'buildBack');
					fastProductBack.alpha = 0.5;
					fastBuildProductCon.addChild(fastProductBack, fastProduct);
					fastBuildProductCon.on('mousedown', ()=>{
						gameOJ.buildItem([product.id]);
					});
					fastBuildLayout.saveChild.push(
						fastBuildProductCon
					);
				}

				let installButton = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'install');
				installButton.x = slotIcon.x + 50;
				installButton.y = 5;
				
				//
				installButton.on('mousedown', ()=>{
					if(installButton.currentAnimation !== 'install'){
						return;
					}
					gameOJ.buildItem([product.id]);
					itemShop.visible = false;
				});

				buildCon.addChild(slotIcon, name, infor, buildPart, installButton);

				productCon.buildCon = buildCon;
				productCon.on('mousedown', ()=>{
					buildInforCon.removeAllChildren();
					buildInforCon.addChild(buildCon);
				});
			}
		}

		shopStaticBack.cache(0,0,400,300);
		shopStaticBack.removeAllChildren();

		let closeButton = new createjs.Container();
		let closeBack = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'buildBack');
		closeBack.alpha = 0.5;
		closeButton.addChild(
			closeBack,
			new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'closeIcon')
		);
		closeButton.cache(0,0,50,50);
		closeButton.removeAllChildren();
		closeButton.x = 400;
		closeButton.hitArea = simpleRect;
		closeButton.on('mousedown',()=>{
			itemShop.visible = false;
		});


		itemShop.regX = 400 / 2;
		itemShop.regY = 250 / 2;
		itemShop.x = gameOJ.gameW / 2;
		itemShop.y = gameOJ.gameH / 2;
		itemShop.addChild(shopStaticBack, SlotCon, unlimitCon, productLayout, buildInforCon, closeButton);
		itemShop.visible = false;

		
		// Build item icon
		let buildItemIcon = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'buildItem');
		buildItemIcon.hitArea = simpleRect;
		buildItemIcon.y = 40;
		buildItemIcon.on('mousedown',()=>{
			itemShop.visible = !itemShop.visible;
		});

		gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).addChild(
			leaderImage,
			skillBoard,
			deadNumber,
			skillMetal,
			buildItemIcon,
			itemShop,
			fastBuildLayout
		);
	},
	//Tick
	tick: function(event){
		if(gameOJ.gameTT==1)
			gameOJ.tickMenu();
		else if(gameOJ.gameTT==2)
			gameOJ.tickPlay(event);
		gameOJ.gameNN ++ ;
		gameOJ.stage.update();
	},
	tickMenu: function(){
		if(gameOJ.gameNN === 0){
			gameOJ.resetGame();
			// show user input
			//gameOJ.userNameInput.style.display = "block";
			// Create menu
			var background = new createjs.Bitmap(gameOJ.loadMC.getAsset('menuImage'));

			var left = new createjs.Bitmap(gameOJ.loadMC.getAsset('uiList'));
			left.sourceRect=new createjs.Rectangle(168,293,45,45);
			left.x = gameOJ.gameW / 2 - 35 - 45;
			left.y = 70 + 50;
			var right = new createjs.Bitmap(gameOJ.loadMC.getAsset('uiList'));
			right.sourceRect=new createjs.Rectangle(216,293,46,46);
			right.x = gameOJ.gameW / 2 + 32;
			right.y = 70 + 50;

			// Create tank list
			var allTank = new createjs.Container();
			for(var i = 1; i < 4; i++){
				let tank = new createjs.Sprite(gameOJ.SpriteSheetList["TankBigSize"], "tank"+i);
				//tank.x = (i - 1) * 32;
				tank.visible = i === gameOJ.pickedTank;
				allTank.addChild(tank);
			}
			allTank.scaleX = allTank.scaleY = 2;
			allTank.regX = allTank.regY = 16;
			allTank.y = gameOJ.gameH / 2 - 25;
			allTank.x = gameOJ.gameW / 2 - 15;

			// Play button
			var playButton = new createjs.Bitmap(gameOJ.loadMC.getAsset('uiList'));
			playButton.sourceRect=new createjs.Rectangle(30,295,110,110);
			playButton.regX = playButton.regY = 55;
			playButton.x = gameOJ.gameW / 2;
			playButton.y = gameOJ.gameH / 2 + 80 + 50;

			// nick Name
			var nickName = new createjs.Container();
			var textNick = new createjs.Text(document.getElementById('userJoinGameName').value, "15px Arial", "#FFFFFF");
			var borderNick = new createjs.Shape(
				new createjs.Graphics().beginStroke("white").f('#999999').drawRect(0, 0, 200, 30)
			);
			textNick.maxWidth = 200;
			textNick.maxHeight = 30;
			textNick.textAlign = 'center';
			textNick.x = 100;
			textNick.y = 7;
			nickName.addChild(borderNick, textNick);
			nickName.cache(0,0,200,30);
			nickName.regX = 100;
			nickName.regY = 15;
			nickName.x = gameOJ.gameW / 2;
			nickName.y = gameOJ.gameH / 2 + 50;

			// Logo
			var logo = new createjs.Bitmap(gameOJ.loadMC.getAsset('logo'));
			logo.sourceRect = new createjs.Rectangle(0,0, 200, 64);
			logo.x = gameOJ.gameW / 2;
			logo.y = gameOJ.gameH / 2 - 80;
			logo.regX = 100;
			logo.regY = 32;

			// Back border
			var backborder = new createjs.Shape(
				new createjs.Graphics().f('#000000').drawRect(0, 0, 250, 270)
			);
			backborder.x = gameOJ.gameW / 2;
			backborder.y = gameOJ.gameH / 2;
			backborder.regX = 125;
			backborder.regY = 125;
			backborder.alpha = 0.5;
			backborder.cache(0,0,250,270);

			// UI
			var UIList = new createjs.Container();
			var fullScreenIcon = new createjs.Sprite(this.SpriteSheetList["icon"]);
			fullScreenIcon.gotoAndStop(gameOJ.gameSetting.fullScreen ? 'fullScreenExit':'fullScreenGo');
			fullScreenIcon.x = gameOJ.gameW - 50;
			fullScreenIcon.y = -10;

			var soundIcon = new createjs.Sprite(this.SpriteSheetList["icon"]);
			soundIcon.gotoAndStop(gameOJ.gameSetting.allowSound? 'soundAllow':'soundNotAllow');
			soundIcon.x = gameOJ.gameW - 100;
			soundIcon.y = -10;

			UIList.addChild(fullScreenIcon, soundIcon);

			gameOJ.stage1.addChild(background , backborder, left, right, allTank, playButton, logo, nickName, UIList);

			//Event
			left.on('mousedown', () => {
				if(gameOJ.pickedTank === 1){
					allTank.getChildAt(gameOJ.pickedTank - 1).visible = false;
					gameOJ.pickedTank = allTank.numChildren;
					allTank.getChildAt(gameOJ.pickedTank - 1).visible = true;
				}
				else {
					allTank.getChildAt(gameOJ.pickedTank - 1).visible = false;
					gameOJ.pickedTank --;
					allTank.getChildAt(gameOJ.pickedTank - 1).visible = true;
				}
			});
			right.on('mousedown', () => {
				if(gameOJ.pickedTank === allTank.numChildren){
					allTank.getChildAt(gameOJ.pickedTank - 1).visible = false;
					gameOJ.pickedTank = 1;
					allTank.getChildAt(gameOJ.pickedTank - 1).visible = true;
				}
				else {
					allTank.getChildAt(gameOJ.pickedTank - 1).visible = false;
					gameOJ.pickedTank ++;
					allTank.getChildAt(gameOJ.pickedTank - 1).visible = true;
				}
			});
			playButton.on('mousedown', () => {
				gameOJ.changeTT(2);
				gameOJ.joinGame(document.getElementById('userJoinGameName').value);
			});
			nickName.on('mousedown', () =>{
				gameOJ.userNameInput.style.display = "block";
				let usernameDom = document.getElementById('userJoinGameName');
				
				usernameDom.focus();
				usernameDom.value = usernameDom.value;
			});
			fullScreenIcon.on('mousedown', () => {
				if(fullScreenIcon.currentAnimation === 'fullScreenGo'){
					fullScreenIcon.gotoAndStop('fullScreenExit')
					gameOJ.openFullscreen();
				}
				else {
					fullScreenIcon.gotoAndStop('fullScreenGo')
					gameOJ.exitFullscreen();
				}
			});

			soundIcon.on('mousedown', () => {
				if(soundIcon.currentAnimation === 'soundAllow'){
					soundIcon.gotoAndStop('soundNotAllow')
					gameOJ.changeSoundGame(0);
				}
				else {
					soundIcon.gotoAndStop('soundAllow')
					gameOJ.changeSoundGame(1);
				}
			});

			//
			return;
		}
	},
	tickPlay: function(event){
		
		if(gameOJ.gameNN === 0){
			gameOJ.createControl();
			
			var background = new createjs.Bitmap(gameOJ.loadMC.getAsset('menuImage'));
			var findMatchText = new createjs.Bitmap(gameOJ.loadMC.getAsset("uiList"));
			var waitingGraphic = new createjs.Container();
			findMatchText.sourceRect = new createjs.Rectangle(32,160,279,64);
			findMatchText.regX = findMatchText.sourceRect.width / 2;
			findMatchText.regY = findMatchText.sourceRect.height / 2;
			findMatchText.x = gameOJ.gameW / 2;
			findMatchText.y = gameOJ.gameH / 2 - 100;
			waitingGraphic.addChild(background, findMatchText);
			gameOJ.stage2.addChild(waitingGraphic);
		} else if(gameOJ.playerList.length > 0){
			gameOJ.updateTimeText(event.delta);
			gameOJ.updateSkillCountdown(gameOJ.skillValue.k1.countdown - event.delta);
			gameOJ.updateDeadCountdown(event.delta);
			var removeNumber = 0;
			var i =0;
			while( Boolean(gameOJ.playerList[i]) && gameOJ.player){
				if(Boolean(gameOJ.playerList[i].removed) && gameOJ.playerList[i].removed === gameOJ.pingtime ){
					gameOJ.playerList[i].updateShootTime(Math.round(event.delta));
					gameOJ.playerList[i].Tick(event.delta);
					i++;
				}
				else if(Boolean(gameOJ.playerList[i].removed) && gameOJ.playerList[i].removed !== gameOJ.pingtime){
					// gameOJ.playerList[i].updateVisible(false);
					gameOJ.playerList[i].updateShootTime(Math.round(event.delta));
					gameOJ.playerList[i].Tick(event.delta);
					i++;
				}
				else {
					gameOJ.addEffect(gameOJ.playerList[i].tankPoint.x, gameOJ.playerList[i].tankPoint.y, gameOJ.playerList[i].tankBaseSprite.rotation, "5");
					gameOJ.addEffect(gameOJ.playerList[i].tankPoint.x, gameOJ.playerList[i].tankPoint.y, gameOJ.playerList[i].tankBaseSprite.rotation, "2");
					gameOJ.removePlayer(gameOJ.playerList[i].playerID);
					removeNumber++;
				}
			}
			if(gameOJ.scoreList.redraw){
				gameOJ.updateScoreList();
				gameOJ.scoreList.redraw = false;
			}

			removeNumber = 0;
			var enemyIndex = 0;
			while( Boolean(gameOJ.enemyList[enemyIndex]) && gameOJ.player){
				if(Boolean(gameOJ.enemyList[enemyIndex].removed) && gameOJ.enemyList[enemyIndex].removed === gameOJ.pingtime ){
					gameOJ.enemyList[enemyIndex].updateShootTime(Math.round(event.delta));
					gameOJ.enemyList[enemyIndex].Tick(event.delta);
					enemyIndex++;
				}
				else if(Boolean(gameOJ.enemyList[enemyIndex].removed) && gameOJ.enemyList[enemyIndex].removed !== gameOJ.pingtime){
					// gameOJ.playerList[i].updateVisible(false);
					gameOJ.enemyList[enemyIndex].updateShootTime(Math.round(event.delta));
					gameOJ.enemyList[enemyIndex].Tick(event.delta);
					enemyIndex++;
				}
				else {
					//gameOJ.addEffect(gameOJ.enemyList[enemyIndex].tankPoint.x, gameOJ.enemyList[enemyIndex].tankPoint.y, gameOJ.enemyList[enemyIndex].tankBaseSprite.rotation, "5");
					//gameOJ.addEffect(gameOJ.enemyList[enemyIndex].tankPoint.x, gameOJ.enemyList[enemyIndex].tankPoint.y, gameOJ.enemyList[enemyIndex].tankBaseSprite.rotation, "2");
					gameOJ.removeEnemy(gameOJ.enemyList[enemyIndex].playerID, enemyIndex);
					removeNumber++;
				}
			}

			removeNumber = 0;
			var j = 0;
			while( Boolean(gameOJ.bulletList[j]) ){
				if(Boolean(gameOJ.bulletList[j].removed) && gameOJ.bulletList[j].removed === gameOJ.pingtime ){
					gameOJ.bulletList[j].Tick();
					j++;
				}
				else if(Boolean(gameOJ.bulletList[j].removed) && gameOJ.bulletList[j].removed !== gameOJ.pingtime ){
					gameOJ.bulletList[j].Tick();
					j++;
				}
				else {
					var checkBullet = gameOJ.bulletList[j];
					if(!checkBullet.fake){
						var listBulletEffect = gameOJ.bulletInfor[checkBullet.bulletStyle].effect;
						var endE;
						var Eid = 0;
						while(Boolean(endE = listBulletEffect[Eid])){
							gameOJ.addEffect(checkBullet.bulletPoint.x, checkBullet.bulletPoint.y, checkBullet.bulletRotation + 90, ''+endE);
							Eid ++;
						}
					}
					gameOJ.removeBullet(checkBullet.bulletID);
					removeNumber++;
				}
			}

			removeNumber = 0;
			var e = 0;
			while( Boolean(gameOJ.effectList[e]) ){
				gameOJ.effectList[e].sortID -= removeNumber;
				if( gameOJ.effectList[e].live > 0 ){
					gameOJ.effectList[e].Tick();
					e++;
				}
				else {
					gameOJ.removeEffect(gameOJ.effectList[e].sortID);
					removeNumber++;
				}
			}
			// event
			if(gameOJ.playerControl.controlType === 'key'){
				gameOJ.playerControl.mouseMoveEvent(gameOJ.stage.mouseX,gameOJ.stage.mouseY);
				if(gameOJ.player){
					let aimSprite = gameOJ.player.tankAimStore[gameOJ.playerControl.aimSpriteIndex];
					if(gameOJ.player.tankAimSprite.getChildAt(0) !== aimSprite){
						gameOJ.player.tankAimSprite.removeAllChildren();
						gameOJ.player.tankAimSprite.addChild(aimSprite);
					}
					gameOJ.player.tankAimSprite.visible = gameOJ.playerControl.touchAim;
				}
				if(gameOJ.playerControl.spaceSkill.a === 2){
					gameOJ.shootSkill();
				}
			}
			else if(gameOJ.playerControl.controlType === 'touch'){
				gameOJ.playerControl.fakeMouseMoveEvent(gameOJ.player.tankPoint.x + gameOJ.playerControl.fakeMouse.x,gameOJ.player.tankPoint.y + gameOJ.playerControl.fakeMouse.y);
				if( gameOJ.playerControl.touchShoot && gameOJ.player.lastShootTime < 1){
					gameOJ.shootBullet();
					if(gameOJ.player){
						gameOJ.player.updateShootTime(Math.round(event.delta));
						gameOJ.playerControl.touchShoot = false;
					}
				}
				if(gameOJ.player){
					let aimSprite = gameOJ.player.tankAimStore[gameOJ.playerControl.aimSpriteIndex];
					if(gameOJ.player.tankAimSprite.getChildAt(0) !== aimSprite){
						gameOJ.player.tankAimSprite.removeAllChildren();
						gameOJ.player.tankAimSprite.addChild(aimSprite);
					}
					gameOJ.player.tankAimSprite.visible = gameOJ.playerControl.touchAim;
				}
				if(gameOJ.playerControl.spaceSkill.a === 2){
					gameOJ.shootSkill();
				}
			}
			if(gameOJ.player){
				gameOJ.moveCamera(gameOJ.player.tankPoint.x, gameOJ.player.tankPoint.y);
			}
			if(gameOJ.player !== null) gameOJ.moveTurret();
		}

		if(gameOJ.gameEnd.endCode !== 0){
			gameOJ.createFinishMenu(gameOJ.gameEnd);
			if(gameOJ.gameEnd.endCode > 2){
				gameOJ.stopAllPlayer();
			}
			gameOJ.gameEnd.endCode = 0;
			gameOJ.gameEnd.point = 0;
			gameOJ.gameEnd.lastEnemy = '';
			gameOJ.gameTime = 0;
			gameOJ.skillValue.k1.countdown = 0;
		}

	},
	/* Socket event */
	updateData: function(data){
		if(gameOJ.gameTT === 2 && gameOJ.gameNN > 0 && gameOJ.currentMap !== null){
			var now = Date.now();

			if(data.Y !== null){
				for(var i = 0; i < data.Y.length ; i++){
					update_player = data.Y[i];

					var playerIndex = gameOJ.findPlayer(update_player.p);


					if(playerIndex === -1){
						gameOJ.addPlayer(update_player.x,update_player.y,update_player.p);
						let newPlayer = gameOJ.playerList[gameOJ.playerList.length-1];
						newPlayer.removed = now;
						newPlayer.moveSpeed = update_player.s;
						newPlayer.updateVisible(true);
						playerIndex = gameOJ.playerList.length-1;
					}
					else {
						var currentPlayer = gameOJ.playerList[playerIndex];
						if( currentPlayer.updateVisible(true) && currentPlayer.tankVisible){
							currentPlayer.changePosition(update_player.x,update_player.y);
							currentPlayer.showTank();
						}
						// currentPlayer.updateHistoryMove(update_player.m);
						currentPlayer.addNewPosition(update_player.x,update_player.y, update_player.m, update_player.moveAngle);
						currentPlayer.moveTurret(update_player.g);
						currentPlayer.updateEffects(update_player.e);
						currentPlayer.lastShootTime = update_player.reload;
						currentPlayer.tankHP = update_player.t;
						currentPlayer.moveSpeed = update_player.s;
						currentPlayer.removed = now;
					}
					// Get user player
					if(
						gameOJ.player === null
						&& Boolean(gameOJ.playerID)
						&& gameOJ.playerList[playerIndex].playerID === gameOJ.playerID)
					{
						gameOJ.player = gameOJ.playerList[playerIndex];
						gameOJ.player.tankHpBar.getChildAt(2).sourceRect.y -= 10;
						gameOJ.player.tankReloadBar.getChildAt(0).sourceRect.y = 40;
						gameOJ.player.tankReloadBar.getChildAt(1).sourceRect.y = 50;
						gameOJ.stage2.removeChildAt(gameOJ.stage2.numChildren - 1);
						gameOJ.createInGameMenu();
						gameOJ.buildTimeText();
					}
					// Get team player

				}

				if(gameOJ.userNameUpdateList !== null){
					gameOJ.userNameUpdateList = gameOJ.updateUsername(gameOJ.userNameUpdateList);
				}
	
				if(gameOJ.dataTeam !== null){
					gameOJ.updateTeam(gameOJ.dataTeam);
					gameOJ.dataTeam = null;
				}
	
				if(gameOJ.tankStyleUpdateList !== null){
					gameOJ.tankStyleUpdateList = gameOJ.updateNewTankStyle(gameOJ.tankStyleUpdateList);
				}
	
				if(gameOJ.scoreList.updated){
					gameOJ.scoreList.updated = gameOJ.updateScoreListNick();
					gameOJ.scoreList.redraw = true;
				}
			}

			if(data.E !== null){
				for(var i = 0; i < data.E.length ; i++){
					update_enemy = data.E[i];
					var currentEnemy;
					var enemyIndex = gameOJ.findEnemy(update_enemy.p);
					if(enemyIndex === -1){
						gameOJ.addEnemy(update_enemy.x,update_enemy.y,update_enemy.p,'bot', update_enemy.style);
						let newEnemy = gameOJ.enemyList[gameOJ.enemyList.length-1];
						newEnemy.removed = now;
						newEnemy.moveSpeed = update_enemy.s;
						newEnemy.tankHP = update_enemy.t;
						newEnemy.updateVisible(true);
						if(update_enemy.team === gameOJ.playerTeam){
							newEnemy.team = update_enemy.team;
							newEnemy.tankHpBar.getChildAt(2).sourceRect.y = 80;
							newEnemy.tankReloadBar.getChildAt(0).sourceRect.y = 40;
							newEnemy.tankReloadBar.getChildAt(1).sourceRect.y = 50;
						}
						else {
							newEnemy.team = update_enemy.team;
						}

						if(newEnemy.tankStyle === '2'){
							newEnemy.tankBaseSprite.gotoAndPlay('item'+newEnemy.tankHP);
						}
						currentEnemy = newEnemy;
					}
					else {
						currentEnemy = gameOJ.enemyList[enemyIndex];
						if( currentEnemy.updateVisible(true) && currentEnemy.tankVisible){
							currentEnemy.changePosition(update_enemy.x,update_enemy.y);
							currentEnemy.showTank();
						}
					}
					currentEnemy.addNewPosition(update_enemy.x,update_enemy.y, update_enemy.m, update_enemy.moveAngle);
					currentEnemy.moveTurret(update_enemy.g);
					currentEnemy.updateEffects(update_enemy.e);
					currentEnemy.lastShootTime = update_enemy.reload;
					currentEnemy.countdown = update_enemy.reload > currentEnemy.countdown ? update_enemy.reload : currentEnemy.countdown;
					currentEnemy.tankMaxHP = update_enemy.t > currentEnemy.tankMaxHP ? update_enemy.t : currentEnemy.tankMaxHP;
					currentEnemy.tankHP = update_enemy.t;
					currentEnemy.moveSpeed = update_enemy.s;
					currentEnemy.removed = now;
				}
			}

			if(data.HE !== null){
				for(var i = 0; i < data.HE.length; i++){
					var enemyIndex = gameOJ.findEnemy(data.HE[i]);
					if( enemyIndex !== -1 ){
						gameOJ.enemyList[enemyIndex].removed = 0;
					}
				}
			}

			if(data.B !== null){
				let randomNum = ~~((Math.random() * 100) + 1) + gameOJ.gameNN;
				for(var i = 0; i < data.B.length ; i++){
					var update_bullet = data.B[i];

					var bulletIndex = gameOJ.findBullet(update_bullet.i);

					if( bulletIndex === -1){
						var target = gameOJ.player || {tankPoint: {x: 0, y:0}};
						gameOJ.addBullet(update_bullet.x, update_bullet.y, update_bullet.r, update_bullet.p, update_bullet.i, update_bullet.s);
						gameOJ.bulletList[gameOJ.bulletList.length-1].removed = now;
						gameOJ.playSound(gameOJ.bulletInfor[update_bullet.s].sound, Math.abs( target.tankPoint.x - update_bullet.x), Math.abs( (target.tankPoint.y || 0) - update_bullet.y), randomNum);
						gameOJ.addEffect(update_bullet.x, update_bullet.y, update_bullet.r + 90, '17');
						if(update_bullet.n && update_bullet.s != '3_1'){
							if(update_bullet.p.charAt(update_bullet.p.length - 1) !== 'e'){
								var playerIndex = gameOJ.findPlayer(update_bullet.p);
								var list = gameOJ.playerList;
							}
							else {
								var playerIndex = gameOJ.findEnemy(update_bullet.p);
								var list = gameOJ.enemyList;
							}

							if(playerIndex !== -1){
								let playerShooted = list[playerIndex];
								playerShooted.tankTurretSprite.gotoAndPlay(playerShooted.objectType+playerShooted.tankStyle+'s');
							}
						}
					}
					else {
						//gameOJ.bulletList[bulletIndex].moveTo(update_bullet.x, update_bullet.y);
						gameOJ.bulletList[bulletIndex].removed = now;
					}
				}
			}

			if(data.H !== null){
				for(var i = 0; i < data.H.length ; i++){
					var playerIndex = gameOJ.findPlayer(data.H[i]);
					if(playerIndex !== -1){
						gameOJ.playerList[playerIndex].updateVisible(false);
					}
				}
			}

			if( Boolean(data.e) ){
				gameOJ.applyEffect(data.e);
			}

			if(gameOJ.dataDead !== null){
				gameOJ.updateDead(gameOJ.dataDead);
				gameOJ.dataDead = null;
			}
			// Update ping time
			gameOJ.pingtime = now;
			gameOJ.moveTankData.Y = null;
			gameOJ.moveTankData.B = null;
			gameOJ.moveTankData.H = null;
			gameOJ.moveTankData.E = null;
			gameOJ.moveTankData.HE = null;
		}
	},
	applyEffect: function(effect, isNeedAnimation = true){
		if(gameOJ.gameTT === 2 && gameOJ.currentMap !== null){
			var listEffect = effect.split(';');
			var effectString;
			var effectIndex = 0;
			listEffect.length--;
			while (Boolean(effectString = listEffect[effectIndex])){
				let value = effectString.split(',');
				if(value[0] === 'I'){
					gameOJ.addItem(parseInt(value[1]), parseInt(value[2]), parseInt(value[3]), value[4]);
				}
				else if(value[0] === 'RI'){
					gameOJ.removeItem(value[1]);
				}
				else if(value[0] === 'E' && isNeedAnimation){
					gameOJ.addEffect(parseInt(value[1]), parseInt(value[2]), parseInt(value[3]), value[4]);
				}
				else if(value[0] !== 'E'){
					gameOJ.changeMapCanvas('map'+value[0]+'Layer', parseInt(value[1]), parseInt(value[2]), parseInt(value[3]), parseInt(value[4]));
				}
				
				effectIndex ++;
			}
		}
	},
	saveTankData: function(data){
		gameOJ.moveTankData.Y = data;
		gameOJ.updateData(gameOJ.moveTankData);
	},
	saveBulletData: function(data){
		gameOJ.moveTankData.B = data;
		gameOJ.updateData(gameOJ.moveTankData);
	},
	saveEnemyData: function(data){
		gameOJ.moveTankData.E = data;
		gameOJ.updateData(gameOJ.moveTankData);
	},
	saveHideTankData: function(data){
		gameOJ.moveTankData.H = data;
		gameOJ.updateData(gameOJ.moveTankData);
	},
	saveHideEnemyData: function(data){
		gameOJ.moveTankData.HE = data;
		gameOJ.updateData(gameOJ.moveTankData);
	},
	saveUpdateUserName: function(data){
		if(gameOJ.gameTT === 2){
			gameOJ.userNameUpdateList = data;
		}
	},
	saveUpdateTankStyle: function(data){
		if(gameOJ.gameTT === 2){
			gameOJ.tankStyleUpdateList = data;
		}
	},
	savePlayerID: function(data){
		if(gameOJ.gameTT === 2){
			gameOJ.playerID = data;
		}
	},
	saveDataTeam: function(data){
		gameOJ.dataTeam = data;
	},
	saveDeadData: function(data){
		gameOJ.dataDead = data;
	},
	saveDetroyedBullet: function(data){
		for(var i = 0; i < data.length; i++){
			var bulletIndex = gameOJ.findBullet(data[i]);
			if( bulletIndex !== -1 ){
				gameOJ.bulletList[bulletIndex].removed = 0;
			}
		}
	},
	saveLogoutPlayer: function(data){
		for(var i = 0; i < data.length; i++){
			var playerIndex = gameOJ.findPlayer(data[i]);
			if( playerIndex !== -1 ){
				gameOJ.playerList[playerIndex].removed = 0;
			}
		}
	},
	updateTeam: function(data){
		for(var i = 0; i < data.length; i++){
			var value = data[i];
			var index = gameOJ.findPlayer(value.playerID);
			if(index !== -1){
				let player = gameOJ.playerList[index];
				if(value.teamID === gameOJ.playerTeam && player !== gameOJ.player){
					player.team = value.teamID;
					player.tankHpBar.getChildAt(2).sourceRect.y = 80;
					player.tankReloadBar.getChildAt(0).sourceRect.y = 40;
					player.tankReloadBar.getChildAt(1).sourceRect.y = 50;
				}
				else {
					player.team = value.teamID;
				}
			}
		}
	},
	updateDead: function(data){
		for(var i = 0; i < data.length; i++){
			var value = data[i];
			var index = gameOJ.findPlayer(value.playerId);
			if(index !== -1){
				let player = gameOJ.playerList[index];
				// gameOJ.addEffect(player.tankPoint.x, player.tankPoint.y, player.tankBaseSprite.rotation, '2');
				player.updateVisible(false);
				player.movePointList = [];
				player.targetMove = {
					baseRotaion: null, // value, stepValue
					tankPosition: null, // targetPoint, stepValue, angle
					turretRotation: null, //value, stepValue
				};
				if(player === gameOJ.player){
					gameOJ.player.comboKill = 0;
					gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(2).countdown = parseInt(value.time);
				}
			}
		}
	},
	updateStatus: function(data){
		if(gameOJ.gameTT === 2){
			gameOJ.gameEnd.endCode = data.r;
			gameOJ.gameEnd.point = data.p;
			gameOJ.gameEnd.lastEnemy = data.rs;
		}
	},
	updateSkillIcon: function(skillName){
		gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(1).getChildAt(1).gotoAndStop('skill'+skillName);
	},
	updateSkill: function(data){
		for(var i = 0; i< data.length; i++){
			var value = data[i];
			var skillIndex = value.index;
			gameOJ.updateSkillCountdown(value.countDown);
		}
	},
	updateSlot: function(data){
		for(let i = 0; i < data.length; i++){
			let playerIndex = gameOJ.findPlayer(data[i].playerID);
			if(playerIndex !== -1){
				let player = gameOJ.playerList[playerIndex];
				player.slot = data[i].slotList[0] === 0 ? [] : data[i].slotList;
				if(player === gameOJ.player){
					let slotCon = gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(5).getChildAt(1);
					let fastBuildCon = gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(6);
					for(let slotIndex = 0, l=slotCon.numChildren; slotIndex < l; slotIndex++){
						if(slotIndex < player.slot.length){
							slotCon.getChildAt(slotIndex).gotoAndPlay('slot'+player.slot[slotIndex]);
							slotCon.getChildAt(slotIndex).visible = true;
						}
						else {
							slotCon.getChildAt(slotIndex).visible = false;
						}
					}
					// update unlimitSlot
					let unlimitCon = gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(5).getChildAt(2);
					for(let unlimitIndex = 0, l = player.unlimitSlot.length, unlimitData = data[i].unlimitSlot; unlimitIndex < l; unlimitIndex++){
						let checkUnlimit = unlimitCon.getChildAt(unlimitIndex);
						player.unlimitSlot[unlimitIndex] = unlimitData[unlimitIndex] || 0;
						if(checkUnlimit.text !==  player.unlimitSlot[unlimitIndex]+''){
							gameOJ.buildText(player.unlimitSlot[unlimitIndex]+'', 5, checkUnlimit);
						}
					}

					fastBuildCon.removeAllChildren();
					let yFast = -40;
					let isFullSlot = player.slot.length >= 5;
					let productLayout = gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(5).getChildAt(3);
					for(let fastSlotIndex = 3; fastSlotIndex < gameOJ.slotInfor.length; fastSlotIndex ++){
						let buildData = gameOJ.slotInfor[fastSlotIndex];
						if(player.canBuildSlot(buildData.id) && !(isFullSlot && buildData.giveSlot === 0) ){
							let slotGraphic = fastBuildCon.saveChild[buildData.id-4];
							slotGraphic.y = (yFast += 30);
							fastBuildCon.addChild(slotGraphic);
							productLayout.getChildAt(buildData.id-4).buildCon.getChildAt(4).gotoAndPlay('install');
						}
						else {
							productLayout.getChildAt(buildData.id-4).buildCon.getChildAt(4).gotoAndPlay('installOff');
						}
					}
					if(fastBuildCon.numChildren > 0){
						let ignoreFastBuildIcon = new createjs.Container();
						let ignoreBack = new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'buildBack');
						ignoreBack.alpha = 0.5;
						ignoreFastBuildIcon.addChild(
							ignoreBack,
							new createjs.Sprite(gameOJ.SpriteSheetList['icon'], 'closeIcon')
						);
						ignoreFastBuildIcon.x = fastBuildCon.getChildAt(0).x + 30;
						ignoreFastBuildIcon.y = fastBuildCon.getChildAt(0).y;
						fastBuildCon.addChild(ignoreFastBuildIcon);
						ignoreFastBuildIcon.on('mousedown',()=>{
							fastBuildCon.removeAllChildren();
						});
					}
				}
				// Slot Effect
				if(player.tankVisible === true){
					let updateItem = data[i].updateItem;
					if(updateItem[0] !== 0){
						for(let newSlotID = 0, l = updateItem.length; newSlotID < l; newSlotID++){
							gameOJ.addEffect(
								player.tankPoint.x, 
								player.tankPoint.y, 
								0, 
								'item', 
								false,
								new createjs.Sprite(gameOJ.SpriteSheetList['item'], 'slot'+updateItem[newSlotID])
							);
						}
					}
				}
				// update slot bar
				player.tankSlotBar.removeAllChildren();
				player.tankSlotBar.x = - player.tankSlotBar.scaleX * (13 * (player.slot.length - 1) + 25);
				for(let slotIndex = 0,l = player.slot.length; slotIndex < l; slotIndex++){
					let slotID = player.slot[slotIndex];
					let newSlot = new createjs.Sprite(gameOJ.SpriteSheetList['item'], 'slot'+slotID);
					newSlot.x = slotIndex * 22;
					player.tankSlotBar.addChild(
						newSlot
					);
				}
			}
		}
	},
	updateDeadCountdown: function(value){
		if(gameOJ.gameTime === 0){
			return;
		}
		var deadnumber = gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(2);
		deadnumber.countdown -= value;
		if(deadnumber.countdown < 0){
			deadnumber.countdown = 0;
			deadnumber.visible = false;
			return;
		}
		deadnumber.visible = true;
		let second = ~~(deadnumber.countdown / 1000) + '';
		let loopnum = Math.max(deadnumber.numChildren, second.length )
		for(var i = 0; i < loopnum ; i++){
			if( i < deadnumber.numChildren && i < second.length){
				deadnumber.getChildAt(i).gotoAndStop('c' + second.charAt(i));
			}
			else if ( i >= deadnumber.numChildren ) {
				let number = new createjs.Sprite(gameOJ.SpriteSheetList['font'], 'c' + second.charAt(i));
				deadnumber.addChild(number);
			}
			else if( i >= second.length ) {
				deadnumber.removeChildAt(i);
			}
		}
	},
	updateSkillCountdown: function(value){
		if(gameOJ.gameTime === 0){
			return;
		}
		if(value <= 0){
			value = 0;
		}
		gameOJ.skillValue.k1.countdown = value;
		var skillCountdown = ~~( parseInt(value) / 1000 ) + '';
		var spaceSprite = gameOJ.stage2.getChildAt(gameOJ.staticValues.alertLayerNumer).getChildAt(1).getChildAt(2);
		var maxLength = Math.max(skillCountdown.length, spaceSprite.numChildren);
		spaceSprite.visible = value > 0;

		for( var t = 0; t < maxLength; t++){
			if( t < spaceSprite.numChildren){
				spaceSprite.getChildAt(t).gotoAndStop('c' + skillCountdown.charAt(t));
			}
			else if(t >= spaceSprite.numChildren) {
				let text = new createjs.Sprite(gameOJ.SpriteSheetList['font']);
				text.gotoAndStop('c' + skillCountdown.charAt(t));
				text.x = t*10;
				spaceSprite.addChild(
					text
				);
			}
			else if(t >= skillCountdown.length){
				spaceSprite.removeChildAt(t);
			}
		}
	},
	saveScore: function(data){
		if(gameOJ.gameTT === 2){
			var scoreData;
			var dataIndex = 0;
			while(scoreData = data[dataIndex]){
				var playerScoreIndex = gameOJ.scoreList.value.findIndex((x)=> x.playerID === scoreData.playerID);
				if(playerScoreIndex !== -1){
					gameOJ.scoreList.value[playerScoreIndex].point = scoreData.point;
					gameOJ.scoreList.value[playerScoreIndex].dead = scoreData.d;
					gameOJ.scoreList.updated = true;
					gameOJ.scoreList.redraw = true;
				}
				else {
					gameOJ.scoreList.value.push({
						playerID: scoreData.playerID,
						point: scoreData.point,
						dead: scoreData.d,
						nick: '@',
						team: ''
					});
					gameOJ.scoreList.updated = true;
					playerScoreIndex = gameOJ.scoreList.value.length - 1;
				}
				// Sort new score
				while(playerScoreIndex > 0 && gameOJ.scoreList.value[playerScoreIndex - 1].point < scoreData.point){
					let draft = gameOJ.scoreList.value[playerScoreIndex - 1];
					gameOJ.scoreList.value[playerScoreIndex - 1] = gameOJ.scoreList.value[playerScoreIndex];
					gameOJ.scoreList.value[playerScoreIndex] = draft;
					playerScoreIndex -= 1;
				}
				//
				dataIndex ++;
			}
		}
	},
	updateUsername: function(data){
		if(gameOJ.gameTT === 2){
			var notFound = [];
			for(var i = 0; i < data.length ; i ++){
				var x = data[i];
				var playerIndex = gameOJ.findPlayer(x.playerID);
				if(playerIndex === -1) {
					notFound.push(x);
					continue;
				}
				gameOJ.playerList[playerIndex].updateNickName(x.playerName);
			}
			return notFound.length > 0 ? notFound : null;
		}
		return null;
	},
	updateNewTankStyle: function(data){
		if(gameOJ.gameTT === 2){
			var notFound = [];
			for(var i = 0; i < data.length ; i ++){
				var x = data[i];
				var playerIndex = gameOJ.findPlayer(x.p);
				if(playerIndex === -1){
					notFound.push(x);
					continue;
				}
				var player = gameOJ.playerList[playerIndex];
				player.updateTankStyle(x.s);
				if(gameOJ.player === player){
					player.setTankAim(player.tankStyle);
					gameOJ.updateSkillIcon(player.tankStyle+'_1');
				}
			}
			return notFound.length > 0 ? notFound : null;
		}
		return null;
	},
	getAndBuildMap: function(data){
		if(gameOJ.gameTT === 2){
			gameOJ.createMap(data.mapName);
		}
	},
	joinGame: function(userName){
		gameOJ.Socket.emit("join-game", {userName: userName, tankStyle: ''+gameOJ.pickedTank});
	},
	movePlayer: function(moveCode){
		if(gameOJ.player === null) return;
		// move code: 0-U 1-UR 2-R 3-DR 4-D 5-DL 6-L 7-UL
		gameOJ.Socket.emit(gameOJ.socketName.moveTank,  moveCode );
	},
	moveTurret: function(){
		if(gameOJ.gameNN % 60 === 0){
			//gameOJ.Socket.emit("move-turret",{turretRotation: gameOJ.player.gunAngle});
		}
	},
	shootBullet: function(){
		if(gameOJ.player === null) return;
		var angle = gameOJ.player.shoot();
		gameOJ.Socket.emit(
			gameOJ.socketName.shootBullet,
			Math.round(angle)
		);
	},
	shootSkill: function(){
		if(gameOJ.player === null) return;
		gameOJ.Socket.emit(
			gameOJ.socketName.shootSkill,
			{
				t: gameOJ.playerControl.spaceSkill.t,
				r: Math.round(gameOJ.playerControl.spaceSkill.r),
				p: gameOJ.playerControl.spaceSkill.p
			}
		);
		gameOJ.playerControl.spaceSkill.a = 0;
	},
	buildItem: function(itemList) {
		if(gameOJ.player === null) return;
		gameOJ.Socket.emit(
			gameOJ.socketName.buildItem,
			itemList
		);
	},
	leaveMatch: function(){
		gameOJ.Socket.emit("leave-match", "ok");
	},
	createControl: function(){
		gameOJ.playerControl = new gameOJ.GameControl();
	},
};

/* Các đối tượng của game */
//Player
(function(){
	/* Khởi tạo */
	function Player(cx,cy,cid, userName="@", objectType = 'tank'){
		//tankValue
		this.tankMaxHP = 500;
        this.countdown = 300;
		this.timeNowServer = 0;
		this.nextBullet = '1';
		this.tankRSize = 15;
		// game point
		this.killPoint = 0;
		this.comboKill = 0;
		//Slot
		this.slot = [];
		this.unlimitSlot = [
            0,
            0,
            0
        ],
		this.canUpSlot = [

		];
		// shoot value
        this.lastShootTime = 0; //chạy ngược lại từ coutdown về 0 (khác server)
		//
		this.tankPoint = new KhoiTest._Point(cx,cy);
		this.tankVisible = true;
		this.gunAngle = 0;
		this.tankHP = 500;
		this.moveSpeed = 1.5;
		this.playerName = userName;
		this.tankStyle = "1";
		this.playerID = cid;
		this.removed = 1; // Không còn tồn tại trên server?
		this.movePointList = [];
		this.team = '';
		this.objectType = objectType;
		// chỉnh sai số
		this.targetMove = {
			baseRotaion: null, // value, stepValue
			tankPosition: null, // targetPoint, stepValue, angle
			turretRotation: null, //value, stepValue
		};
		//Đồ họa
		this.tankAimSprite = new createjs.Container;
		this.tankEffectSprite = new createjs.Container();
		this.tankNickSprite = gameOJ.buildText(this.playerName, this.playerName.length * 10);
		this.tankBaseSprite = new createjs.Sprite(gameOJ.SpriteSheetList["TankBase"], "tank"+this.tankStyle);
		this.tankTurretSprite = new createjs.Sprite(gameOJ.SpriteSheetList["TankTurret"], "tank"+this.tankStyle);
		this.tankHpBar = new createjs.Container();
		this.tankReloadBar = new createjs.Container();
		this.tankSlotBar = new createjs.Container();
		this.tankGraphic = new createjs.Container(); //Tạo container chứa đồ họa
		this.tankGraphic.addChild(this.tankBaseSprite, this.tankTurretSprite, this.tankAimSprite, this.tankEffectSprite, this.tankNickSprite, this.tankHpBar, this.tankReloadBar, this.tankSlotBar); // Add
		
		this.tankBaseSprite.regX=this.tankBaseSprite.regY=16; // Điểm neo ở giữa ảnh 32x32
		this.tankTurretSprite.regX=this.tankTurretSprite.regY=16; // ...
		var textLength = this.playerName.length * 10;
		this.tankNickSprite.regX=textLength / 2;
		this.tankNickSprite.regY = 15;
		//this.tankNickSprite.cache(0,0,textLength,15);
		var emptyBar = new createjs.Bitmap(gameOJ.loadMC.getAsset("hpbar"));
		var bloodBar = new createjs.Bitmap(gameOJ.loadMC.getAsset("hpbar"));
		var historyBloodBar = new createjs.Bitmap(gameOJ.loadMC.getAsset("hpbar"));
		bloodBar.x = 1;
		historyBloodBar.x = 1;
		emptyBar.sourceRect=new createjs.Rectangle(0,0,30,10);
		bloodBar.sourceRect=new createjs.Rectangle(0,30,30,10);
		historyBloodBar.sourceRect=new createjs.Rectangle(0,10,30,10);
		
		this.tankHpBar.addChild(emptyBar, historyBloodBar, bloodBar);
		this.tankHpBar.regX = 15;
		this.tankHpBar.regY = 30;

		var emptyReloadBar = new createjs.Bitmap(gameOJ.loadMC.getAsset('hpbar'));
		var fillReloadBar = new createjs.Bitmap(gameOJ.loadMC.getAsset('hpbar'));
		fillReloadBar.x = 1;
		emptyReloadBar.sourceRect=new createjs.Rectangle(0,60,30,10);
		fillReloadBar.sourceRect=new createjs.Rectangle(0,70,30,10);
		this.tankReloadBar.addChild(emptyReloadBar, fillReloadBar);
		this.tankReloadBar.regX = 15;
		this.tankReloadBar.regY = 5;
		this.tankReloadBar.y = -31;
		this.tankReloadBar.visible = false;
		// Tank aim
		this.tankAimSprite.visible = false;
		this.tankAimStore = [

		];

		// Effect Sprite
		let noHit = new createjs.Sprite(gameOJ.SpriteSheetList['effect_p'], 'effect1');
		noHit.visible = false;
		noHit.regX = noHit.regY = 25;
		noHit.effectType = 1;

		let healHp = new createjs.Sprite(gameOJ.SpriteSheetList['effect_p'], 'effect2');
		healHp.visible = false;
		healHp.regX = healHp.regY = 25;
		healHp.alpha = 0.5;
		healHp.effectType = 2;

		let effect3 =new createjs.Container();
		effect3.visible = false;
		effect3.effectType = 3;

		let bullet3 = new createjs.Sprite(gameOJ.SpriteSheetList['effect_p'], 'effect3');
		bullet3.visible = false;
		bullet3.regX = bullet3.regY = 25;
		bullet3.effectType = 4;

		let plusdame = new createjs.Sprite(gameOJ.SpriteSheetList['effect_p'], 'effect4');
		plusdame.visible = false;
		plusdame.regX = plusdame.regY = 25;
		plusdame.alpha = 0.5;
		plusdame.effectType = 5;

		let invisibleSprite = new createjs.Container();
		invisibleSprite.visible = false;
		invisibleSprite.effectType = 6;

		let bugSheld = new createjs.Sprite(gameOJ.SpriteSheetList['effect_p'], 'effect5');
		bugSheld.visible = false;
		bugSheld.regX = bugSheld.regY = 25;
		bugSheld.alpha = 0.5;
		bugSheld.effectType = 7;

		let disable = new createjs.Sprite(gameOJ.SpriteSheetList['effect_p'], 'effect6');
		disable.visible = false;
		disable.regX = disable.regY = 25;
		disable.alpha = 1;
		disable.effectType = 8;

		let effect9 = new createjs.Container();
		effect9.effectType = 9;

		let capSheld = new createjs.Sprite(gameOJ.SpriteSheetList['effect_p'], 'effect10');
		capSheld.visible = false;
		capSheld.regX = capSheld.regY = 25;
		capSheld.alpha = 0.5;
		capSheld.effectType = 10;

		let buildTank = new createjs.Sprite(gameOJ.SpriteSheetList['effect_p'], 'effect11');
		buildTank.visible = false;
		buildTank.regX = buildTank.regY = 25;
		buildTank.alpha = 0.6;
		buildTank.effectType = 11;

		this.effectSpriteStore = [];

		this.effectSpriteStore.push(
			noHit, healHp, effect3, bullet3, plusdame,
			invisibleSprite, bugSheld, disable,
			effect9, capSheld,
			buildTank
		);
		// Tank Slot bar
		this.tankSlotBar.y = -58;
		this.tankSlotBar.scaleX = this.tankSlotBar.scaleY = 0.7;


		//Default position
		this.changePosition(cx,cy,textLength, 15);
		this.changeTurretRotation(this.gunAngle);
	}
	/*Các phương thức chung */
	var p=Player.prototype;
	//Đổi mục tiêu di chuyển thành vị trí cx,cy
	p.moveTo=function(cx, cy, moveCode, forceSpeed = -1){
		var targetPoint = new KhoiTest._Point(cx,cy);
		//var stepValue = 2;
		if(forceSpeed < 0){
			var stepValue = Math.max(this.moveSpeed, this.tankPoint.lengP(targetPoint) / 5);
			//var stepValue = Math.max(this.moveSpeed, this.moveSpeed);
			//var stepValue = Math.max(this.moveSpeed, 1.5);
		}
		else {
			var stepValue = forceSpeed;
		}
		if(moveCode === -1 || 1){
			var angle = this.tankPoint.angleP(targetPoint);
		}
		else {
			//var angle = (moveCode - 2)*45;
			var angle = this.tankPoint.angleP(targetPoint);
		}

		this.updateHistoryMove(moveCode);
		this.targetMove.tankPosition = {
			targetPoint: targetPoint,
			stepValue: stepValue,
			angle: angle
		};
	}
	// Add effect graphic
	p.updateEffects = function(effectNumberArray){
		if(this.objectType ==='enemy' && this.tankStyle === '2') return;
		var effectChecked = [];
		for(var i = 0; i < effectNumberArray.length; i++){
			var effectID = effectNumberArray[i];
			var currentEffect = this.effectSpriteStore[effectID - 1];
			effectChecked[effectID] = true;

			if(effectID === 6){
				this.tankGraphic.alpha = 0.6;
			}
			
			if( !currentEffect.visible ){
				this.tankEffectSprite.addChild(currentEffect);
				currentEffect.visible = true;

				if( Boolean(gameOJ.Sound['peffect'+ effectID]) ){
					gameOJ.playSound(
						'peffect'+ + effectID, 
						Math.abs(this.tankPoint.x - gameOJ.player.tankPoint.x), 
						Math.abs(this.tankPoint.y - gameOJ.player.tankPoint.y)
					);
				}
			}
			else {

			}
		}

		for(var k = 0; k < this.tankEffectSprite.numChildren ; k++){
			var effectGraphic = this.tankEffectSprite.getChildAt(k);
			if( !Boolean( effectChecked[effectGraphic.effectType] ) ){
				effectGraphic.visible = false;
				if(effectGraphic.effectType === 6){
					this.tankGraphic.alpha = 1;
				}
				else if( effectGraphic.effectType === 8 && this === gameOJ.player){
					gameOJ.playerControl.touchCode = -1;
				}

				this.tankEffectSprite.removeChildAt(k);
				k --;
			}
		}
	}
	p.updateVisible = function(value){
		if(value === this.tankVisible) return false;
		this.tankVisible = value;
		if(!value){
			var visiblePoint = {x: 0, y: 0};
			if(this.movePointList.length === 0){
				visiblePoint.x = this.tankPoint.x+1;
				visiblePoint.y = this.tankPoint.y+1;
			}
			else {
				visiblePoint.x = this.movePointList[this.movePointList.length - 1].x;
				visiblePoint.y = this.movePointList[this.movePointList.length - 1].y;
			}
			//this.addNewPosition(visiblePoint.x, visiblePoint.y, -1);
			this.hideTank();
		}
		return true;
	}
	p.updateKillPoint = function(value){
		var se = this;
		var plus = value - this.killPoint;
		this.killPoint = value;
		this.comboKill += plus;
		if(plus > 0) gameOJ.displayKillIcon(se.comboKill);
	}
	p.showTank = function(){
		this.tankGraphic.visible = true;
	}
	p.hideTank = function(){
		this.tankGraphic.visible = false;
		this.targetMove.tankPosition = null;
		this.movePointList.length = 0;
	}
	// Add new Position
	p.addNewPosition = function(cx, cy, moveCode, moveAngle = 0){
		if(this.movePointList.length === 1 && this.movePointList[0].reuse){
			//this.movePointList.length = 0;
			this.targetMove.tankPosition = null;
		}
		this.movePointList.push({x: cx, y: cy, moveCode: moveCode, reuse: false, moveAngle});
	}
	p.updateNickName = function(username, color = null){
		if(this.playerName === username) return;
		if(color !== null){
			//this.tankNickSprite.color = color;
		}
		this.playerName = username;
		gameOJ.buildText(username, username.length * 10, this.tankNickSprite);
		var textLength = username.length * 10;
		this.tankNickSprite.regX=textLength / 2;
		this.tankNickSprite.regY = 40;
		this.tankNickSprite.scaleY = 1.5;
	}
	p.updateTankStyle = function(tankStyle){
		this.tankStyle = tankStyle;
		this.tankBaseSprite.gotoAndPlay('tank'+tankStyle);
		this.tankTurretSprite.gotoAndPlay('tank'+tankStyle);
		// like server
		if(tankStyle === '1'){
            this.countdown = 750;
            this.nextBullet = '1';
            this.tankHP = 500 - this.tankMaxHP + this.tankHP;
            this.tankMaxHP = 500;
            this.tankRSize = 15;
        }
        else if(tankStyle === '2'){
            this.countdown = 1000;
            this.nextBullet = '2';
            this.tankHP = 700 - this.tankMaxHP + this.tankHP;
            this.tankMaxHP = 700;
            this.tankRSize = 15;
        }
        else if( tankStyle === '3'){
            this.countdown = 1000;
            this.nextBullet = '3';
            this.tankHP = 500 - this.tankMaxHP + this.tankHP;
            this.tankMaxHP = 500;
            this.tankRSize = 15;
        }
	}
	p.setTankAim = function(tankStyle){
		let simple = new createjs.Shape();
		simple.graphics.beginFill("#EEEEEE").drawRect(0, 0, 20, 280);
		simple.regY = 280 + 15;
		simple.regX = 10;
		simple.alpha = 0.3;
		simple.cache(0,0,20,280);
		if(tankStyle === '1'){
			let skill1 = new createjs.Shape();
			skill1.graphics.beginFill("#2300f5").drawRect(0, 0, 20, 280);
			skill1.regY = 280 + 15;
			skill1.regX = 10;
			skill1.alpha = 0.3;
			skill1.cache(0,0,20,280);
			this.tankAimStore.push(simple,skill1);
		}
		else if(tankStyle === '2'){
			let skill1 = new createjs.Shape();
			skill1.graphics.s("#2300f5").drawCircle(0,0,30);
			skill1.regY = 0;
			skill1.regX = 0;
			skill1.alpha = 0.2;
			skill1.cache(-30,-30,60,60);
			this.tankAimStore.push(simple,skill1);
		}
		else if(tankStyle === '3'){
			let skill1 = new createjs.Shape();
			skill1.graphics.beginFill("#2300f5").drawRect(0, 0, 20, 280);
			skill1.regY = 280 + 15;
			skill1.regX = 10;
			skill1.alpha = 0.3;
			skill1.cache(0,0,20,280);
			this.tankAimStore.push(simple,skill1);
		}
		else if(tankStyle === '4'){
			let skill1 = new createjs.Shape();
			skill1.graphics.sd([2,2]).setStrokeStyle(2).beginStroke("red").drawRect(0, 0, 3, gameOJ.gameW);
			skill1.regY = gameOJ.gameW + 15;
			skill1.regX = 1;
			skill1.alpha = 0.5;
			skill1.cache(0,0,3,gameOJ.gameW);
			this.tankAimStore.push(simple,skill1);
		}
	}
	p.applyNewPosition = function(rr){
		var newMove;
		var forceSpeed = -1;
		if(this.movePointList.length > 10){
			this.movePointList = [this.movePointList[this.movePointList.length - 1], this.movePointList[this.movePointList.length - 2]];
			this.changePosition(this.movePointList[0].x, this.movePointList[0].y);
		}
		if(this.movePointList.length === 0){
			this.targetMove.tankPosition = null;
			return;
		}
		if( this.movePointList.length === 1 && this.movePointList[0].moveCode === -1){
			this.movePointList.shift();
			this.targetMove.tankPosition = null; // dừng
			return;
		}
		else if(this.movePointList.length === 1 ){
			newMove = this.movePointList[0];
			if( this.targetMove.tankPosition !== null ){
				let anglePrediction =  
				newMove.moveCode !== 8
				? ((newMove.moveCode - 2)*45)
				: newMove.moveAngle
				;
				newPoint = this.tankPoint.moveT(this.moveSpeed * 66, anglePrediction);
				newMove.x = newPoint.x;
				newMove.y = newPoint.y;
				forceSpeed = this.moveSpeed;
				newMove.reuse = true;
			}
			else {
			}
		}
		else if(this.movePointList.length > 1 ){
			this.movePointList.shift();
			newMove = this.movePointList[0];
		}
		this.moveTo(newMove.x, newMove.y, newMove.moveCode, forceSpeed);
	}
	p.shootFakeBullet=function(rotation){
        var now = this.timeNowServer;
        //if(now - this.lastShootTime < this.countdown) return false;
        //
        this.gunAngle = rotation;
        var bulletPosition = this.tankPoint.moveT(16,rotation-90);
        gameOJ.addBullet(bulletPosition.x, bulletPosition.y , rotation, this.playerID, '1', "fake", true);
		gameOJ.bulletList[gameOJ.bulletList.length-1].removed = gameOJ.pingtime;
		// Count down
        this.lastShootTime = now;
        return true;
    }
	//Di chuyển Player đến vị trí cx,cy
	p.changePosition=function(cx,cy){
		this.tankPoint.setV(cx,cy);
		this.tankGraphic.x = cx;
		this.tankGraphic.y = cy;
	}
	p.updateBloodBar = function(){
		this.tankHpBar.getChildAt(2).sourceRect.x = 30 - (this.tankHP/this.tankMaxHP) * 30;
		if(this.tankHpBar.getChildAt(1).sourceRect.x < this.tankHpBar.getChildAt(2).sourceRect.x){
			this.tankHpBar.getChildAt(1).sourceRect.x += 1;
		}
		else {
			this.tankHpBar.getChildAt(1).sourceRect.x = this.tankHpBar.getChildAt(2).sourceRect.x;
		}
	}
	p.moveTurret=function(angle){
		var value = angle;
		var currentValue = this.tankTurretSprite.rotation;
		var stepValue = 1;
		if( Math.abs(currentValue - value) < 0.0001){
			this.tankTurretSprite.rotation = value;
			return;
		}
		if(currentValue < 180){
			var bigValue = currentValue + 180;
			var smallValue =currentValue;
			var arrow = 1;
		} else {
			var bigValue = currentValue;
			var smallValue =currentValue - 180;
			var arrow = -1;
		}
		if(value >= smallValue && value < bigValue){
			stepValue = stepValue*arrow;
		}
		else {
			stepValue = -stepValue*arrow;
		}

		// go throught zero?
		if(stepValue > 0 && value < currentValue){
			stepValue = stepValue * (Math.abs(360 - currentValue + value)/5);
		}
		else if (stepValue < 0 && value > currentValue){
			stepValue = stepValue * (Math.abs(360 - value + currentValue)/5);
		}
		else {
			stepValue = stepValue * (Math.abs(currentValue - value)/5);
		}
		// Save to rotate later
		this.targetMove.turretRotation = {value: value, stepValue: stepValue };
	}
	p.changeTurretRotation=function(angle){
		if(angle < 0 ){
			angle += 360;
		}
		else if(angle > 360){
			angle = angle % 360;
		}
		this.gunAngle = angle;
		this.tankTurretSprite.rotation = angle;
	}
	p.updateHistoryMove=function(moveCode){
		if(moveCode === -1 || moveCode === 8 || this.tankBaseSprite.rotation === moveCode*45) {
			this.targetMove.baseRotaion = null;
			return;
		}
		//
		var value = moveCode*45;
		var stepValue = 5;
		var currentValue = this.tankBaseSprite.rotation;
		if(currentValue < 180){
			var bigValue = currentValue + 180;
			var smallValue =currentValue;
			var arrow = 1;
		} else {
			var bigValue = currentValue;
			var smallValue = currentValue - 180;
			var arrow = -1;
		}
		if(value >= smallValue && value < bigValue){
			stepValue = stepValue*arrow
		}
		else {
			stepValue = -stepValue*arrow;
		}
		// Save to rotate later
		this.targetMove.baseRotaion = {value: value, stepValue: stepValue };
	}
	p.shoot=function(){
		return this.gunAngle;
	}
	p.updateShootTime = function(time){
		if(this.lastShootTime === 0) return;
		this.lastShootTime -= time;
		//
		this.tankReloadBar.visible = true;
		this.tankReloadBar.getChildAt(1).sourceRect.width = 30 * (this.countdown - this.lastShootTime)/this.countdown;
		//
		if(this.lastShootTime <= 0){
			this.lastShootTime = 0;
			this.tankReloadBar.visible = false;
		}
	}
	p.countSlot = function(slotID, count = 100, positionArray = []) {
		if(slotID < 4){
            return Math.min(this.unlimitSlot[slotID - 1], count);
        }
        var num = 0;
        var index = 0;
        this.slot.findIndex( x =>{
            x === slotID && positionArray.push(index) && (num ++);
            index ++;
            return num === count;
        });
        return num;
    }
	p.canBuildSlot = function(slotID) {
		let product = gameOJ.getSlotInfor(slotID - 1);
		if(product === null || product.build.length === 0) return false;
		for(let costIndex = 0; costIndex < product.build.length; costIndex++){
			let buildInfor = product.build[costIndex];
			if(this.countSlot(buildInfor.id, buildInfor.cost) < buildInfor.cost){
				return false;
			}
		}
		return true;
	}
	p.Tick=function(pingNow){
		// if(!this.tankVisible) return;
		// update blood bar
		this.updateBloodBar();
		// Rotation Base
		if(this.targetMove.baseRotaion !== null){

			this.tankBaseSprite.rotation += this.targetMove.baseRotaion.stepValue;

			if(this.tankBaseSprite.rotation < 0){
				this.tankBaseSprite.rotation = 360 + this.tankBaseSprite.rotation;
			} else if( this.tankBaseSprite.rotation >= 360 ) {
				this.tankBaseSprite.rotation = this.tankBaseSprite.rotation % 360;
			}

			if( Math.abs(this.tankBaseSprite.rotation + this.targetMove.baseRotaion.stepValue - this.targetMove.baseRotaion.value) < Math.abs(this.targetMove.baseRotaion.stepValue)){
				this.tankBaseSprite.rotation = this.targetMove.baseRotaion.value;
				this.targetMove.baseRotaion = null;
			} else if(this.tankBaseSprite.rotation === this.targetMove.baseRotaion.value){
				this.targetMove.baseRotaion = null;
			}
		}
		// Move Point
		if(this.targetMove.tankPosition !== null){
			var roadLength = this.tankPoint.lengP(this.targetMove.tankPosition.targetPoint);
			var lateNum = pingNow < 16.7 ? (pingNow / 16.7) : 1;
			var lateNum =  1; //pingNow / 16.7;
			if(roadLength > this.targetMove.tankPosition.stepValue * lateNum){
				var nextPoint = this.tankPoint.moveT(this.targetMove.tankPosition.stepValue * lateNum,this.targetMove.tankPosition.angle);
				this.changePosition(nextPoint.x, nextPoint.y);
			}
			else {
				this.changePosition(this.targetMove.tankPosition.targetPoint.x, this.targetMove.tankPosition.targetPoint.y);
				this.applyNewPosition(roadLength);
			}
		} else{
			this.applyNewPosition();
		}
		// Move turret
		if(this.targetMove.turretRotation !== null){
			var oldTurret = this.tankTurretSprite.rotation;
			this.changeTurretRotation(this.tankTurretSprite.rotation + this.targetMove.turretRotation.stepValue);

			var arrow = 1;
			if(this.tankTurretSprite.rotation < 0){
				this.changeTurretRotation( 360 + this.tankTurretSprite.rotation);
				arrow = -1;
			} else if( this.tankTurretSprite.rotation >= 360 ) {
				this.changeTurretRotation( this.tankTurretSprite.rotation % 360 );
				arrow = -1;
			}

			if(
				Math.abs(this.tankTurretSprite.rotation + this.targetMove.turretRotation.stepValue - this.targetMove.turretRotation.value) < Math.abs(this.targetMove.turretRotation.stepValue)
				|| this.tankTurretSprite.rotation === this.targetMove.turretRotation.value
				|| arrow * (this.tankTurretSprite.rotation - this.targetMove.turretRotation.value) * (oldTurret - this.targetMove.turretRotation.value) < 0
			){
				this.changeTurretRotation( this.targetMove.turretRotation.value );
				this.targetMove.turretRotation = null;
			}
		}
		this.tankAimSprite.rotation = gameOJ.playerControl.getAimRotation(this);
	}

	/*Nạp vào gameOJ */
	gameOJ.addCon("Player",Player);
}());
(function(){
	/* Khởi tạo */
	function Enemy(cx,cy,cid, userName="@", tankStyle = '1'){
        gameOJ.Player.call(this, cx,cy,cid, userName,'enemy');
		this.updateTankStyle(tankStyle);
		this.tankNickSprite.visible = false;
		this.master = '';
    }
    /*Các phương thức chung */
    gameOJ.KetThua(gameOJ.Player, Enemy);
    var p=Enemy.prototype;
    //
    // Build tank value
    p.updateTankStyle=function(tankStyle = '1'){
		this.tankStyle = tankStyle;
		// like server
		if(tankStyle === '1'){
            this.countdown = 750;
            this.nextBullet = '1';
            this.tankHP = 100 - this.tankMaxHP + this.tankHP;
            this.tankMaxHP = 100;
            this.tankRSize = 15;
			// base and turret
			this.tankGraphic.removeAllChildren();
			this.tankBaseSprite = new createjs.Sprite(gameOJ.SpriteSheetList["Enemy"], "enemy1");
			this.tankTurretSprite = new createjs.Sprite(gameOJ.SpriteSheetList["EnemyTurret"], "enemy1");
			this.tankBaseSprite.regX=this.tankBaseSprite.regY=25;
			this.tankTurretSprite.regX=this.tankTurretSprite.regY=25;
			this.tankBaseSprite.gotoAndPlay('tank'+tankStyle);
			this.tankTurretSprite.gotoAndPlay('tank'+tankStyle);
			this.tankGraphic.addChild(this.tankBaseSprite, this.tankTurretSprite, this.tankHpBar, this.tankReloadBar);
        }

		else if(tankStyle === '2') {
			this.countdown = 750;
            this.nextBullet = '1';
            this.tankHP = 100 - this.tankMaxHP + this.tankHP;
            this.tankMaxHP = 100;
            this.tankRSize = 15;
			///
			this.tankBaseSprite = new createjs.Sprite(gameOJ.SpriteSheetList["item"], "item"+1);
			this.tankBaseSprite.regX = this.tankBaseSprite.regY=25;
			this.tankTurretSprite.visible = false;
			this.tankGraphic.removeAllChildren();
			this.tankGraphic.addChild(this.tankBaseSprite);

			this.tankHpBar.visible = false;
			this.tankEffectSprite.visible = false;
		}
	}
	/*Nạp vào gameOJ */
    gameOJ.addCon("Enemy", Enemy);
}());
// Bulllet
(function(){
	/* Khởi tạo */
	function Bullet(cx, cy, crotation, playerID, bulletID, style, isNotReal = false){
		this.bulletPoint = new KhoiTest._Point(cx, cy);
		this.bulletRotation = crotation;
		this.playerID = playerID;
		this.bulletID = bulletID;
		this.live = 1; // time disable
		this.speed = gameOJ.bulletInfor[style].speed;
		this.bulletStyle = style;
		this.fake = isNotReal;
		this.removed = 1; // Lưu ping time, nếu ping sai thì không còn tồn tại trên server
		//Đồ họa
		this.bulletSprite = new createjs.Sprite(gameOJ.SpriteSheetList["bullet"], style);
		this.bulletGraphic = new createjs.Container();
		this.bulletSprite.regX = 25;
		this.bulletSprite.regY = 25;
		this.bulletSprite.rotation = this.bulletRotation + 90;
		this.bulletGraphic.addChild(this.bulletSprite);
		this.bulletGraphic.x = cx;
		this.bulletGraphic.y = cy;
	}
	/*Các phương thức chung */
	var p=Bullet.prototype;
	//
	p.moveTo = function(cx, cy){
		this.changePosition(cx,cy);
	}
	p.changePosition = function(cx,cy){
		this.bulletPoint.setV(cx,cy);
		this.bulletGraphic.x = cx;
		this.bulletGraphic.y = cy;
	}
	p.Tick = function(){
		if(this.live){
			var nextPoint = this.bulletPoint.moveT(this.speed, this.bulletRotation);
			this.changePosition(nextPoint.x, nextPoint.y);
		}
	}
	/*Nạp vào gameOJ */
	gameOJ.addCon("Bullet",Bullet);
}());
// Effect
(function(){
	/* Khởi tạo */
	function Effect(cx, cy, crotation, style, csortID, isFixed = false, specialSprite = null,){
		this.effectPoint = new KhoiTest._Point(cx, cy);
		this.effectRotation = crotation;
		this.live = 100;
		this.sortID = csortID;
		this.style = style;
		this.fixed = isFixed;
		this.fixedRoot = null;
		this.targetMove = null;
		//Đồ họa
		this.effectSprite = specialSprite || new createjs.Sprite(gameOJ.SpriteSheetList["effect"], "effect"+style);
		this.effectGraphic = new createjs.Container();
		this.effectSprite.regX = 25;
		this.effectSprite.regY = 25;
		this.effectSprite.rotation = this.effectRotation;
		this.effectGraphic.addChild(this.effectSprite);
		this.effectGraphic.x = cx;
		this.effectGraphic.y = cy;
		let se = this;
		if(style !== '5' &&  this.style != '10' && this.style != 'item'){
			this.effectSprite.on('animationend',()=>{
				se.effectGraphic.visible = false;
			});
		}
		this.style === 'item' && (this.live = 30);
		var soundName;
		if(Boolean(soundName = gameOJ.effectSound['effect'+style])){
			gameOJ.playSound(soundName, Math.abs((Boolean(gameOJ.player)? gameOJ.player.tankPoint.x : 0) - cx), Math.abs( (Boolean(gameOJ.player)? gameOJ.player.tankPoint.y : 0) - cy));
		}
	}
	/*Các phương thức chung */
	var p=Effect.prototype;
	//
	p.moveTo = function(cx, cy){
		this.changePosition(cx,cy);
	}
	p.changePosition = function(cx,cy){
		this.effectPoint.setV(cx,cy);
		this.effectGraphic.x = cx;
		this.effectGraphic.y = cy;
	}
	p.Tick = function(){
		if(this.live){
			this.live --;
			if(this.style === '5' || this.style === '10' || this.style === '3'){
				this.effectGraphic.alpha -= 0.01;
				this.effectGraphic.scaleX += 0.03;
				this.effectGraphic.scaleY += 0.03;
			}

			if(this.style === 'item'){
				this.effectGraphic.y --;
				this.effectSprite.scaleX = (this.effectSprite.scaleY += 0.1);
				this.effectSprite.alpha -= 0.02;
			}

			if(this.fixed){
				if(this.fixedRoot === null){
					this.fixedRoot = {
						xp: this.effectGraphic.parent.x,
						yp: this.effectGraphic.parent.y,
						xe: this.effectGraphic.x,
						ye: this.effectGraphic.y,
					}
					let inScreenPoint = new KhoiTest._Point(
						this.effectGraphic.x + this.effectGraphic.parent.x,
						this.effectGraphic.y + this.effectGraphic.parent.y
					);
					let targetPoint = new KhoiTest._Point(25,65);
					this.targetMove = inScreenPoint.angleP(targetPoint);
					let step  = inScreenPoint.lengP(targetPoint) / 6;
					this.live = ~~step;
				}
				this.effectGraphic.x = this.fixedRoot.xe + ( this.fixedRoot.xp - this.effectGraphic.parent.x);
				this.effectGraphic.y = this.fixedRoot.ye + ( this.fixedRoot.yp - this.effectGraphic.parent.y);
				if(this.style === 'item'){
					let point = (new KhoiTest._Point(
						this.fixedRoot.xe,
						this.fixedRoot.ye
					)).moveT(6, this.targetMove);
					this.fixedRoot.xe = point.x;
					this.fixedRoot.ye = point.y;
				}
			}
		}
	}
	/*Nạp vào gameOJ */
	gameOJ.addCon("Effect",Effect);
}());
// Control object
(function(){
	/* Khởi tạo */
	function GameControl(){
		// Build map moveCode
		this.moveMap = [];
		this.moveMap['KeyDKeyW'] = this.moveMap['KeyWKeyD'] = 1;
		this.moveMap['KeyDKeyS'] = this.moveMap['KeySKeyD'] = 3;
		this.moveMap['KeyAKeyS'] = this.moveMap['KeySKeyA'] = 5;
		this.moveMap['KeyAKeyW'] = this.moveMap['KeyWKeyA'] = 7;
		this.moveMap['KeyW'] = 0;
		this.moveMap['KeyD'] = 2;
		this.moveMap['KeyS'] = 4;
		this.moveMap['KeyA'] = 6;
		// Build move stack
		this.moveStack = [];
		// Touch history
		this.touchCode = -1;
		// Touch Shoot history
		this.fakeMouse = new KhoiTest._Point(0,0);
		this.touchShoot = false;
		this.turretAim = false;
		this.touchAim = false;
		this.aimSpriteIndex = 0;
		this.aimSpriteRotationType = 0;
		// skill data
		this.spaceSkill = {
			t: 1, // loại 'space' 'e'
			r: 0, // hướng
			p: '', // đối tượng
			a: 0 // đã active chưa
		},
		// Control type
		this.controlType = null;
		// Build key event
		this.buildKeyEvent();
	}
	/*Các phương thức chung */
	var p=GameControl.prototype;
	// Tạo sự kiện bàn phím
	p.buildKeyEvent=function(){
		var se = this;
		// Key Event
		document.onkeydown = function(e){
			if(se.controlType === null){
				se.controlType = 'key';
				gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).alpha = 0;
				gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, gameOJ.gameW, gameOJ.gameH));
				gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).on("mousedown",function(){
					if(se.spaceSkill.a === 0){
						gameOJ.shootBullet();
					}
				});
			}
			if (!e) {
				var e = window.event;
			}
			if(gameOJ.gameTT === 2){
				if (e.code === 'KeyS' || e.code === 'KeyD' || e.code === 'KeyA' || e.code === 'KeyW'){
					if(se.moveStack.indexOf(e.code) !== -1) return; // Fix auto repeat
					se.moveStack.push(e.code);
					gameOJ.movePlayer(se.buildMoveCode());
				}
				if(e.code === 'KeyG'){
					gameOJ.showAndHideBoard(true);
				}
				// canh skill
				if(e.code === 'Space'){
					se.spaceSkill.a = 1;
					se.touchAim = true;
				}
			}
		}
		document.onkeyup = function(e){
			if(gameOJ.gameTT === 2){
				if (e.code === 'KeyS' || e.code === 'KeyD' || e.code === 'KeyA' || e.code === 'KeyW'){
					var removeCode = se.moveStack.indexOf(e.code);
					se.moveStack.splice(removeCode,1);
					gameOJ.movePlayer(se.buildMoveCode());
				}
				if(e.code === 'KeyG'){
					gameOJ.showAndHideBoard(false);
				}
				// dùng skill
				if(e.code === 'Space'){
					se.spaceSkill.a = 2;
					se.touchAim = false;
				}
			}
		}

		/* Draw touch control */
		// Move
		var moveControlBase = new createjs.Shape(
			new createjs.Graphics().setStrokeStyle(2).beginStroke("#000000").drawCircle(0,0,30)
		);
		var moveControlPoint = new createjs.Shape(
			new createjs.Graphics().beginFill("#000000").drawCircle(0,0,10)
		);
		moveControlBase.x = 50;
		moveControlBase.y = gameOJ.gameH - 50;
		moveControlBase.cache(-35,-35,70,70);
		moveControlBase.hitArea = new createjs.Shape(
			new createjs.Graphics().setStrokeStyle(2).beginStroke("#000000").beginFill("#000000").drawCircle(0,0,30)
		);
		moveControlPoint.x = moveControlBase.x;
		moveControlPoint.y = moveControlBase.y;
		moveControlPoint.cache(-20,-20,40,40);

		// turret
		var turretControlBase = new createjs.Shape(
			new createjs.Graphics().setStrokeStyle(2).beginStroke("#000000").drawCircle(0,0,30)
		);
		var turretControlPoint = new createjs.Shape(
			new createjs.Graphics().beginFill("#000000").drawCircle(0,0,10)
		);
		turretControlBase.x = gameOJ.gameW - 60;
		turretControlBase.y = gameOJ.gameH - 60;
		turretControlBase.cache(-45,-45,90,90);
		turretControlBase.hitArea = new createjs.Shape(
			new createjs.Graphics().setStrokeStyle(2).beginStroke("#000000").beginFill("#000000").drawCircle(0,0,30)
		);
		turretControlPoint.x = turretControlBase.x;
		turretControlPoint.y = turretControlBase.y;
		turretControlPoint.cache(-20,-20,40,40);

		// skill
		var skillSpaceControlBase = new createjs.Shape(
			new createjs.Graphics().setStrokeStyle(2).beginStroke("#000000").drawCircle(0,0,20)
		);
		var skillSpacePoint = (new KhoiTest._Point(turretControlBase.x, turretControlBase.y)).moveT(60, -80);
		skillSpaceControlBase.x = skillSpacePoint.x;
		skillSpaceControlBase.y = skillSpacePoint.y;
		skillSpaceControlBase.cache(-45,-45,90,90);
		skillSpaceControlBase.hitArea = new createjs.Shape(
			new createjs.Graphics().setStrokeStyle(2).beginStroke("#000000").beginFill("#000000").drawCircle(0,0,20)
		);

		//add graphic
		gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).addChild(
			moveControlBase,
			moveControlPoint,
			turretControlBase,
			turretControlPoint,
			skillSpaceControlBase
		);
		gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).alpha = 0.5;

		// set touch event
		moveControlBase.on('pressmove', (evt) =>{se.touchMoveEvent(evt, se)});
		moveControlBase.on('mousedown', (evt) =>{se.touchMoveEvent(evt, se)});
		moveControlBase.on("pressup",function(){
			moveControlPoint.x = moveControlBase.x;
			moveControlPoint.y = moveControlBase.y;
			gameOJ.movePlayer(-1);
			se.touchCode = -1;
		});
		turretControlBase.on('pressmove', (evt) =>{se.touchTurretEvent(evt, se)});
		turretControlBase.on('mousedown', (evt) =>{se.touchTurretEvent(evt, se)});
		turretControlBase.on("pressup",function(){
			turretControlPoint.x = turretControlBase.x;
			turretControlPoint.y = turretControlBase.y;
			se.touchShoot = true;
			se.turretAim = false;
			se.touchAim = false;
		});
		skillSpaceControlBase.on('mousedown', (evt) =>{
			se.touchSkillEvent(evt, se, 1);
		});
		skillSpaceControlBase.on('pressmove', (evt) =>{
			se.touchSkillEvent(evt, se, 1);
		});
		skillSpaceControlBase.on("pressup",function(){
			se.spaceSkill.a = 2;
			se.touchAim = false;
		});
	}
	p.mouseMoveEvent = function(cmouseX,cmouseY){
		var target = gameOJ.stage2.getChildAt(gameOJ.staticValues.mapL1LayerNumber).getChildAt(0).sourceRect;
		var mouseX = cmouseX / gameOJ.gameSW + target.x;
		var mouseY = cmouseY / gameOJ.gameSH + target.y;
		if(gameOJ.player === null || gameOJ.gameNN % 1 !== 0 ) return;
		var mousePoint = new KhoiTest._Point(mouseX,mouseY);
		var angle = gameOJ.player.tankPoint.angleP(mousePoint) +90.0;
		if( this.spaceSkill.a === 1){
			this.spaceSkill.r = angle;
			this.spaceSkill.a = 1;
			this.touchAim = true;
			this.aimSpriteIndex = 1;
			this.aimSpriteRotationType = 1;
		}
		else {
			//this.aimSpriteRotationType = 0;
			gameOJ.player.changeTurretRotation(angle);
		}
	}
	p.fakeMouseMoveEvent = function(mouseX,mouseY){
		if(gameOJ.player === null || !this.turretAim) return;
		var mousePoint = new KhoiTest._Point(mouseX,mouseY);
		var angle = gameOJ.player.tankPoint.angleP(mousePoint) +90.0;
		gameOJ.player.changeTurretRotation(angle);
	}
	p.buildMoveCode = function(){
		if(this.moveStack.length === 1){
			return this.moveMap[this.moveStack[0]];
		}
		else if(this.moveStack.length > 1){
			var l = this.moveStack.length;
			var moveMerg = this.moveMap[this.moveStack[l-1]+this.moveStack[l-2]];
			return Boolean(moveMerg)? moveMerg:this.moveMap[this.moveStack[l-1]];
		}
		return -1;
	}
	p.clearMove = function(){
		if(gameOJ.gameTT === 2){
			this.moveStack = [];
			gameOJ.movePlayer(-1);
		}
	}
	p.touchMoveEvent = function(evt, se){
		if(se.controlType === null){
			se.controlType = 'touch';
		}
		var rootPoint = new KhoiTest._Point(0,0);
		var hitPoint = new KhoiTest._Point(0, 0);
		var moveControlBase = gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).getChildAt(0);
		var moveControlPoint = gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).getChildAt(1);
		hitPoint.x = evt.localX;
		hitPoint.y = evt.localY;
		let angle = rootPoint.angleP(hitPoint);
		let length = rootPoint.lengP(hitPoint);
		if( length <= 30 ){
			moveControlPoint.x = moveControlBase.x + hitPoint.x;
			moveControlPoint.y = moveControlBase.y + hitPoint.y;
		}
		else {
			let newPoint = (new KhoiTest._Point(moveControlBase.x, moveControlBase.y)).moveT(30, angle);
			moveControlPoint.x = newPoint.x;
			moveControlPoint.y = newPoint.y;
		}
		let newCode = se.findTouchMoveCode(angle);
		if(newCode === se.touchCode){
			return;
		}
		se.touchCode = newCode;
		gameOJ.movePlayer(newCode);
	}
	p.touchTurretEvent = function(evt, se, allowShoot = true){
		if(se.controlType === null){
			se.controlType = 'touch';
		}
		var rootPoint = new KhoiTest._Point(0,0);
		var hitPoint = new KhoiTest._Point(0, 0);
		var turretControlBase = gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).getChildAt(2);
		var turretControlPoint = gameOJ.stage2.getChildAt(gameOJ.staticValues.controlLayerNumber).getChildAt(3);
		hitPoint.x = evt.localX;
		hitPoint.y = evt.localY;
		let angle = rootPoint.angleP(hitPoint);
		let length = rootPoint.lengP(hitPoint);
		if( false && length <= 20 ){
			turretControlPoint.x = turretControlBase.x + hitPoint.x;
			turretControlPoint.y = turretControlBase.y + hitPoint.y;
			se.touchShoot = false;
			se.touchAim = true;
		}
		else {
			if(length > 30){
				let newPoint = (new KhoiTest._Point(turretControlBase.x, turretControlBase.y)).moveT(30, angle);
				turretControlPoint.x = newPoint.x;
				turretControlPoint.y = newPoint.y;
			}
			else {
				turretControlPoint.x = turretControlBase.x + hitPoint.x;
				turretControlPoint.y = turretControlBase.y + hitPoint.y;
			}
			se.turretAim = true;
			// se.touchShoot = allowShoot;
			se.touchAim = true;
			se.aimSpriteIndex = 0;
			se.aimSpriteRotationType = 0;
		}
		this.fakeMouse.x = hitPoint.x;
		this.fakeMouse.y = hitPoint.y;
	}
	p.touchSkillEvent = function(evt, se, number){
		if(se.controlType === null){
			se.controlType = 'touch';
		}
		var rootPoint = new KhoiTest._Point(0,0);
		var hitPoint = new KhoiTest._Point(0, 0);
		hitPoint.x = evt.localX;
		hitPoint.y = evt.localY;
		let angle = rootPoint.angleP(hitPoint);
		let length = rootPoint.lengP(hitPoint);
		if(number === 1){
			se.spaceSkill.r = angle + 90;
			se.spaceSkill.a = 1;
			se.touchAim = true;
			se.aimSpriteIndex = 1;
			se.aimSpriteRotationType = 1;
		}
	}
	p.getAimRotation = function(player){
		switch(this.aimSpriteRotationType){
			case 0:
				return player.gunAngle;
			case 1:
				return this.spaceSkill.r;
		}
	}
	p.findTouchMoveCode = function(angle){
		if(angle >= -90-22.5 && angle < -90+22.5){
			return 0
		}
		else if(angle >=  -45-22.5 && angle < -45+22.5){
			return 1;
		}
		else if ( angle >= -22.5 && angle < 22.5 ){
			return 2;
		} else if ( angle >= 45-22.5 && angle < 45+22.5 ){
			return 3;
		}else if(angle >=  90-22.5 && angle < 90+22.5){
			return 4;
		}
		else if ( angle >= 135-22.5 && angle < 135+22.5 ){
			return 5;
		} else if ( angle >= 180-22.5 || angle < -180+22.5 ){
			return 6;
		}
		else if ( angle >= -135-22.5 && angle < -135+22.5 ){
			return 7;
		}
	}
	/*Nạp vào gameOJ */
	gameOJ.addCon("GameControl",GameControl);
}());
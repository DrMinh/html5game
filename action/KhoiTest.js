///////////////Phien ban moi - KhoiTest theo OOP
var KhoiTest={
	addCon: function(ten,lop){
		var se=this;
		se[ten]=lop;
	},
	KetThua: function(lopcha,lopcon){
		lopcon.prototype = Object.create(lopcha.prototype);
		lopcon.prototype.constructor=lopcon;
	},
};

///Điểm
(function(){
	/* Khởi tạo */
	function _Point(x,y){
		this.x=this.ox=x||0;
		this.y=this.oy=y||0;
	}

	/* Các phương thức chung */
	var p=_Point.prototype;
	//Đặt giá trị
	p.setX=function(xc){
		this.ox=this.x;
		this.x=xc;
	}
	//Đặt giá trị y
	p.setY=function(yc){
		this.oy=this.y;
		this.y=yc;
	}
	//Đặt x,y
	p.setV=function(xc,yc){
		this.ox=this.x;
		this.oy=this.y;
		this.x=xc;
		this.y=yc;
	}
	//chỉ số {_Point} tile chứa điểm
	//diemmau {x: tile width,y:tile height}
	p.numTile=function(diemmau){
		var se=this;
		return new KhoiTest._Point(Math.floor(se.x/diemmau.x),Math.floor(se.y/diemmau.y));
	}
	//Di chuyển điểm một đoạn kc, theo hướng (độ) huong
	//return _Point
	p.moveT=function(kc,huong){
		var se=this;
		var Rpoint=new KhoiTest._Point(se.x+kc*Math.cos((Math.PI*huong)/180),se.y+kc*Math.sin((Math.PI*huong)/180))
		//return QPointF(BD.x()+kc*cos(M_PI*huong/180),BD.y()+kc*sin(M_PI*huong/180));
		return Rpoint;
	}
	//Tính độ giữa 2 điểm
	p.angleP=function(cp){
		return Math.atan2(cp.y-this.y, cp.x-this.x) * 180 / Math.PI;
	}
	//Tính khoảng cách với điểm khác (cp: KhoiTest._Point)
	p.lengP=function(cp){
		var v1=this.x-cp.x;
		var v2=this.y-cp.y;
		return Math.sqrt(v1*v1+v2*v2);
	}
	/* Nạp vào KhoiTest */
	KhoiTest.addCon("_Point",_Point);
}());

//Đoạn thẳng
(function(){
	/* Khởi tạo */
	function _Line(A,B){
		this.PA=A||new KhoiTest._Point();
		this.PB=B||new KhoiTest._Point();
		this.a=this.PB.y-this.PA.y;
		this.b=this.PA.x-this.PB.x;
		this.c=-this.a*(this.PA.x)-this.b*(this.PA.y);
	}
	/*Các phương thức chung */
	var p=_Line.prototype;
	//Chiều dài (số)
	p.leng=function(){
		var v1=this.PB.x-this.PA.x;
		var v2=this.PB.y-this.PA.y;
		return Math.sqrt(v1*v1+v2*v2);
	}
	//Giao với đoạn khác
	//false: Không giao, _Point: Giao nhau
	p.hitLine=function(ort){
		var del=this.a*ort.b-ort.a*this.b; //Biến xét song song
		if(del==0)
			return false;
		else
		{
			var KQ=new KhoiTest._Point();
			KQ.x=(ort.c*this.b-this.c*ort.b)/del;
			KQ.y=(ort.a*this.c-this.a*ort.c)/del;
			return KQ;
		}
	}
	//Check điểm nằm trong đoạn thẳng: 0-điểm nằm ngoài, 1-điểm nằm trên đường chứa đoạn,2-điểm nằm trong đoạn
	p.hitPoint=function(P){
		var se=this;
		//console.log(P);
		//kiểm tra điểm thuộc đường thẳng
		if(Math.round(this.a*P.x+this.b*P.y+this.c)!=0) return 0;
		//Kiểm tra thuộc đoạn thẳng (xét giới hạn x)
		if(P.x>Math.max(se.PA.x,se.PB.x)||P.x<Math.min(se.PA.x,se.PB.x)||P.y>Math.max(se.PA.y,se.PB.y)||P.y<Math.min(se.PA.y,se.PB.y)){
			if((P.x==se.PA.x&&P.y==se.PA.y)||(P.x==se.PB.x&&P.y==se.PB.y)) return 3;	
			return 1;
		}
		//Xác định!
		return 2;
	}
	// Khoảng cách tới 1 điểm
	p.lenghtToPoint=function(p){
		var se = this;
		return Math.abs( se.a*p.x + se.b*p.y + se.c ) / Math.sqrt(se.a * se.a + se.b * se.b);
	}
	/*Nạp vào KhoiTest */
	KhoiTest.addCon("_Line",_Line);
}());

//Dốc nghiêng
(function(){
	/* Khởi tạo */
	function _Slope(V,L,cwi,che,top){
		this.VT=V;
		this.Line=L;
		this.wi=cwi;
		this.he=che;
		this.top=top||0; //0 dưới 1 trên
	}
	/*Các phương thức chung */
	var p=_Slope.prototype;
	//điểm P chạy, slope đứng yên
	p.hitPoint=function(P){
		//Xác định giao phần vuông
		if(P.x<this.VT.x||P.x>this.VT.x+this.wi||P.y<this.VT.y||P.y>this.VT.y+this.he)
			return false;
		//Xác định đường quay lại
		var lineback=new KhoiTest._Line(new KhoiTest._Point(P.x,0),P); //đường phản xạ lại
		var pointback=lineback.hitLine(this.Line); //Điểm phản xạ lại
		if(pointback.y>P.y&&!this.top)
			return false;
		if(pointback.y<P.y&&this.top)
			return false;
		return pointback;
	}
	/*Nạp vào KhoiTest */
	KhoiTest.addCon("_Slope",_Slope);
}());

//Gạch
(function(){
	/* Khởi tạo */
	function _Tile(V,cwi,che){
		this.VT=V||new KhoiTest._Point(); //Vị trí
		this.wi=cwi;
		this.he=che;
	}
	/*Các phương thức chung */
	var p=_Tile.prototype;
	//NumTile
	p.numTile=function(diemmau){
		var se=this;
		var minT=this.VT.numTile(diemmau);
		minT.x=Math.max(0,minT.x-1);minT.y=Math.max(0,minT.y-1);
		var maxT=(new KhoiTest._Point(se.VT.x+se.wi,se.VT.y+se.he)).numTile(diemmau);
		maxT.x=Math.max(0,maxT.x);maxT.y=Math.max(0,maxT.y);
		return {minT:minT,maxT:maxT};
	}
	//Va chạm với điểm A
	p.hitPoint=function(A){
		if(A.x<this.VT.x||A.x>this.VT.x+this.wi||A.y<this.VT.y||A.y>this.VT.y+this.he)
			return false;
		return true;
	}
	// Va chạm hình tròn tâm A, bán kính R
	p.hitCircle=function(A, R){
		var se = this;
		// Hình chữ nhật lớn bao bọc vùng có thể hit
		var outRect = new KhoiTest._Tile(new KhoiTest._Point(se.VT.x - R,se.VT.y - R), se.wi + R*2, se.he + R*2);
		if(outRect.hitPoint(A)){
			var wiRect = new KhoiTest._Tile(new KhoiTest._Point(se.VT.x - R,se.VT.y), se.wi + R*2, se.he);
			var heRect = new KhoiTest._Tile(new KhoiTest._Point(se.VT.x,se.VT.y - R), se.wi, se.he + R*2);
			if(
				wiRect.hitPoint(A) ||
				heRect.hitPoint(A) ||
				(new KhoiTest._Point(se.VT.x,se.VT.y)).lengP(A) < R ||
				(new KhoiTest._Point(se.VT.x + se.wi,se.VT.y)).lengP(A) < R ||
				(new KhoiTest._Point(se.VT.x + se.wi,se.VT.y + se.he)).lengP(A) < R ||
				(new KhoiTest._Point(se.VT.x,se.VT.y + se.he)).lengP(A) < R
			){
				return true;
			}
		}
		return false;
	}
	//Va chạm với gạch khác (Không xác định hướng)
	p.hitTile=function(Ti){
		var se=this; //Lấy đối tượng (tránh lỗi sai quy chiếu)
		// var hitp=new KhoiTest._Tile(new KhoiTest._Point(se.VT.x-Ti.wi,se.VT.y-Ti.he),se.wi+Ti.wi,se.he+Ti.he);
		// if(hitp.hitPoint(Ti.VT))
		// 	return true;
		// return false;
		if(Ti.VT.x<se.VT.x-Ti.wi||Ti.VT.x>se.VT.x-Ti.wi+se.wi+Ti.wi||Ti.VT.y<se.VT.y-Ti.he||Ti.VT.y>se.VT.y-Ti.he+se.he+Ti.he)
			return false;
		return true;
	}
	//Va chạm với gạch khác (tính hướng va chạm: 1-đầu, 2-đáy, 3-trái, 4-phải), this di chuyển, Ti đứng yên
	p.hitTileW=function(Ti,num){
		var se=this;
		num=num||new KhoiTest._Point();
		//Tạo vector di chuyển
		var vec=new KhoiTest._Point(se.VT.x-se.VT.ox,se.VT.y-se.VT.oy);
		//Nếu Ti cũng di chuyển (Sai ý nghĩa cmnr :( )
		if(Ti.VT.ox-Ti.VT.x!=0||Ti.VT.oy-Ti.VT.y!=0){
			vec.x+=Ti.VT.ox-Ti.VT.x;
			vec.y+=Ti.VT.oy-Ti.VT.y;
		}
		//Trường hợp đứng yên, lấy vector đối làm vector di chuyển
		if(vec.x==0&&vec.y==0){
			vec.x=Ti.VT.ox-Ti.VT.x;
			vec.y=Ti.VT.oy-Ti.VT.y;
		}
		//đường di chuyển
		var lineD=new KhoiTest._Line(new KhoiTest._Point(se.VT.x-vec.x,se.VT.y-vec.y),se.VT);
		//Xét trường hợp
		//1
		if(vec.y>0){
			var lineH=new KhoiTest._Line(new KhoiTest._Point(Ti.VT.x-se.wi,Ti.VT.y-se.he),new KhoiTest._Point(Ti.VT.x+Ti.wi,Ti.VT.y-se.he));
			var pointR=lineH.hitLine(lineD);
			if(lineD.hitPoint(pointR)==2&&lineH.hitPoint(pointR)==2){
				num.setV(pointR.x,pointR.y);
				return 1;
			}
		}
		//2
		else if(vec.y<0){
			var lineH=new KhoiTest._Line(new KhoiTest._Point(Ti.VT.x-se.wi,Ti.VT.y+Ti.he),new KhoiTest._Point(Ti.VT.x+Ti.wi,Ti.VT.y+Ti.he));
			var pointR=lineH.hitLine(lineD);
			if(lineD.hitPoint(pointR)==2&&lineH.hitPoint(pointR)==2){
				num.setV(pointR.x,pointR.y);
				return 2;
			}
		}
		//3
		if(vec.x>0){
			var lineH=new KhoiTest._Line(new KhoiTest._Point(Ti.VT.x-se.wi,Ti.VT.y-se.he),new KhoiTest._Point(Ti.VT.x-se.wi,Ti.VT.y+Ti.he));
			var pointR=lineH.hitLine(lineD);
			if(lineD.hitPoint(pointR)==2&&lineH.hitPoint(pointR)==2){
				num.setV(pointR.x,pointR.y);
				return 3;
			}
		}
		//4
		else if(vec.x<0){
			var lineH=new KhoiTest._Line(new KhoiTest._Point(Ti.VT.x+Ti.wi,Ti.VT.y-se.he),new KhoiTest._Point(Ti.VT.x+Ti.wi,Ti.VT.y+Ti.he));
			var pointR=lineH.hitLine(lineD);
			if(lineD.hitPoint(pointR)==2&&lineH.hitPoint(pointR)==2){
				num.setV(pointR.x,pointR.y);
				return 4;
			}
		}
		//Không giao
		return false;
	}
	p.hitSlope=function(Ti){
		if(!this.hitTile(Ti)) return false;
		var se=this;
		//Tạo vector di chuyển
		var vec=new KhoiTest._Point(se.VT.x-se.VT.ox,se.VT.y-se.VT.oy);
		//Trường hợp đứng yên, lấy vector đối làm vector di chuyển
		if(vec.x==0&&vec.y==0){
			vec.x=Ti.VT.ox-Ti.VT.x;
			vec.y=Ti.VT.oy-Ti.VT.y;
		}
		//Tìm điểm giao, vecLine là vector chỉ phương của đường thẳng slope (-b,a)
		var xp=0,yp=0,vecLine=new KhoiTest._Point(-Ti.Line.b,Ti.Line.a);
		if((vecLine.x*vecLine.y>0&&Ti.top)||(vecLine.x*vecLine.y<0&&!Ti.top))
			xp+=this.wi;
		if((vecLine.x*vecLine.y>0&&!Ti.top)||(vecLine.x*vecLine.y<0&&!Ti.top))
			yp+=this.he;
		var DiemG=new KhoiTest._Point(se.VT.x+xp,se.VT.y+yp);
		//đường di chuyển
		var lineD=new KhoiTest._Line(new KhoiTest._Point(DiemG.x-vec.x,DiemG.y-vec.y),DiemG);
		//console.log(lineD);
		//Kiểm tra giao
		var pointR=lineD.hitLine(Ti.Line);
		//console.log(pointR);
		if(pointR){
			//console.log(lineD.hitPoint(pointR),Ti.Line.hitPoint(pointR));
			if(lineD.hitPoint(pointR)>1&&Ti.Line.hitPoint(pointR)>1){
				var lineback=new KhoiTest._Line(new KhoiTest._Point(DiemG.x,0),DiemG); //đường phản xạ lại
				var pointback=lineback.hitLine(Ti.Line); //Điểm phản xạ lại
				return new KhoiTest._Point(se.VT.x,se.VT.y+pointback.y-DiemG.y);
			}
		}
		return false;
	}
	//this giao với slope Ti, trả về vị trí mới của this nếu bị phản xạ
	p.hitSlope2=function(Ti){
		if(!this.hitTile(Ti)) return false;
		var se=this;
		//Tạo vector di chuyển
		var vec=new KhoiTest._Point(se.VT.x-se.VT.ox,se.VT.y-se.VT.oy);
		//Trường hợp đứng yên, lấy vector đối làm vector di chuyển
		if(vec.x==0&&vec.y==0){
			vec.x=Ti.VT.ox-Ti.VT.x;
			vec.y=Ti.VT.oy-Ti.VT.y;
		}
		//Tìm điểm giao, vecLine là vector chỉ phương của đường thẳng slope (-b,a)
		var xp=0,yp=0,vecLine=new KhoiTest._Point(-Ti.Line.b,Ti.Line.a);
		if((vecLine.x*vecLine.y>0&&Ti.top)||(vecLine.x*vecLine.y<0&&!Ti.top))
			xp+=this.wi;
		if((vecLine.x*vecLine.y>0&&!Ti.top)||(vecLine.x*vecLine.y<0&&!Ti.top))
			yp+=this.he;
		var DiemG=new KhoiTest._Point(se.VT.x+xp,se.VT.y+yp);
		//Xác định giao phần vuông
		var TileG=se.hitTile(Ti);
		if(!TileG) return false;
		//Xác định đường quay lại
		var lineback=new KhoiTest._Line(new KhoiTest._Point(DiemG.x,0),DiemG); //đường phản xạ lại
		var pointback=lineback.hitLine(Ti.Line); //Điểm phản xạ lại
		if(pointback.y>DiemG.y&&!Ti.top)
			return false;
		if(pointback.y<DiemG.y&&Ti.top)
			return false;
		return new KhoiTest._Point(se.VT.x,se.VT.y+pointback.y-DiemG.y);
	}
	/*Nạp vào KhoiTest */
	KhoiTest.addCon("_Tile",_Tile);
}());
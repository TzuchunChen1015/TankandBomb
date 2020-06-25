"use strict";
/**/
// Available Control Variable //
var TimeInterval;
var minSpeed, maxSpeed;
var minAttackTime, maxAttackTime;
var LifeTime, largeTime, eachScore=100;
// Select Mode //
var ModeId=0;
var easy=document.getElementById("easy");
var medium=document.getElementById("medium");
var hard=document.getElementById("hard");
easy.addEventListener("click",function(){
	medium.checked=hard.checked=0;
	ModeId=0;
});
medium.addEventListener("click",function(){
	easy.checked=hard.checked=0;
	ModeId=1;
});
hard.addEventListener("click",function(){
	easy.checked=medium.checked=0;
	ModeId=2;
});
/**/
// Interface Initialization //
var gameName=document.getElementById("gameName");
var start=document.getElementById("start");
var result=document.getElementById("result");
var rule=document.getElementById("rule");
var setting=document.getElementById("setting");
var menu=document.getElementById("menu");
var restart=document.getElementById("restart");
var undo=document.getElementById("undo");
var ruleText=document.getElementById("ruleText");
var score=document.getElementById("score");
var lifeBlock=document.getElementById("lifeBlock");
var warning=document.getElementById("warning");
// Press START Button //
start.addEventListener("click",function(){
	gameName.style.display="none";
	this.style.display="none";
	rule.style.display="none";
	setting.style.display="none";
	menu.style.display="none";
	container.style.background="url('project/tankLight.jpg')";
	score.style.display="block";
	lifeBlock.style.display="block";
	warning.style.display="block";
	Init();
	Game();
});
// Press RULE Button //
rule.addEventListener("click",function(){
	gameName.style.display="none";
	start.style.display="none";
	this.style.display="none";
	setting.style.display="none";
	undo.style.display="block";
	ruleText.style.zIndex="1";
	ruleText.style.opacity="1";
});
// Press SETTING Button //
setting.addEventListener("click",function(){
	if(menu.style.display=="none")
		menu.style.display="block";
	else
		menu.style.display="none";
});
// Press RESTART Button //
restart.addEventListener("click",function(){
	undo.style.display="none";
	this.style.display="none";
	result.style.display="none";
	score.style.display="block";
	lifeBlock.style.display="block";
	warning.style.display="block";
	Init();
	Game();
});
// Press UNDO Button //
undo.addEventListener("click",function(){
	gameName.style.display="block";
	start.style.display="block";
	rule.style.display="block";
	setting.style.display="block";
	container.style.background="url('project/tank.jpg')";
	this.style.display="none";
	ruleText.style.zIndex="-1";
	ruleText.style.opacity="0";
	result.style.display="none";
	restart.style.display="none";
});
/**/
// Game Initialization //
var container=document.getElementById("container");
var lifeNumber=document.getElementById("lifeNumber");
var tank, obstacle=[], bullet=[], life, getScore;
var tankInit=1;
// Initialization //
function Init(){
	// Property Initialization //
	TimeInterval=[7000,5000,3000][ModeId];
	minSpeed=[1,2,3][ModeId];
	maxSpeed=[3,4,5][ModeId];
	minAttackTime=[5,10,15][ModeId];
	maxAttackTime=[10,15,20][ModeId];
	LifeTime=[10,8,5][ModeId];
	largeTime=[1.5,1.25,1][ModeId];
	eachScore=[50,75,100][ModeId];
	// Game Initialization //
	if(tankInit==0)
		container.removeChild(tank.node);
	for(let i=bullet.length-1;i>=0;i--){
		container.removeChild(bullet[i].node);
		bullet.splice(i,1);
	}
	for(let i=obstacle.length-1;i>=0;i--){
		container.removeChild(obstacle[i].node);
		obstacle.splice(i,1);
	}
	lifeNumber.innerText=life=LifeTime;
	score.innerText=getScore=0;
	tankInit=1;
}
// Game //
function Game(){
	// tank //
	tank=new Object();
	tank.node=document.createElement("div");
	tank.node.className="tank";
	tank.node.style.top="335px";
	tank.node.style.left="560px";
	// tank body //
	let tankBody=new Object();
	tankBody.node=document.createElement("div");
	tankBody.node.className="tankBody";
	tank.node.appendChild(tankBody.node);
	// tank gun //
	let gun=new Object();
	gun.node=document.createElement("div");
	gun.node.className="gun";
	// gun body //
	let gunBody=new Object();
	gunBody.node=document.createElement("div");
	gunBody.node.className="gunBody";
	gun.node.appendChild(gunBody.node);
	tank.node.appendChild(gun.node);
	// Insert in ontainer //
	container.appendChild(tank.node);
	tankInit=0;
	// EventListener //
	let OnMouseMove=function(evt){
		evt=evt||window.event;
		let mouseX=parseFloat(evt.offsetX);
		let mouseY=parseFloat(evt.offsetY);
		let X=parseFloat(tank.node.style.left)+50;
		let Y=parseFloat(tank.node.style.top)+50;
		let degree;
		degree=(mouseY-Y)/(mouseX-X);
		degree=Math.atan(degree);
		degree=degree*180/Math.PI;
		if(mouseX<X)
			gun.node.style.transform="rotate("+(180+degree)+"deg)";
		else
			gun.node.style.transform="rotate("+degree+"deg)";
	};
	let OnClick=function(evt){
		evt=evt||window.event;
		let mouseX=parseFloat(evt.offsetX);
		let mouseY=parseFloat(evt.offsetY);
		let X=parseFloat(tank.node.style.left)+50;
		let Y=parseFloat(tank.node.style.top)+50;
		// Gun Move //
		let degree;
		degree=(mouseY-Y)/(mouseX-X);
		degree=Math.atan(degree);
		degree=degree*180/Math.PI;
		if(mouseX<X)
			gun.node.style.transform="rotate("+(180+degree)+"deg)";
		else
			gun.node.style.transform="rotate("+degree+"deg)";
		// Create New Bullet //
		let len=bullet.length;
		bullet[len]=new Bullet();
		bullet[len].node.style.left=parseFloat(tank.node.style.left)+40+"px";
		bullet[len].node.style.top=parseFloat(tank.node.style.top)+40+"px";
		let sum=Math.sqrt((mouseX-X)*(mouseX-X)+(mouseY-Y)*(mouseY-Y));
		bullet[len].vx=10*(mouseX-X)/sum;
		bullet[len].vy=10*(mouseY-Y)/sum;
		container.appendChild(bullet[len].node);
	};
	// Aim the Obstacle //
	container.addEventListener("mousemove",OnMouseMove);
	// Shoot the Obstacle //
	container.addEventListener("click",OnClick);
	// tank move //
	document.addEventListener("keydown",OnKeyDown);
	// Run Time //
	let createObstacle=window.setInterval(function(){
		let len=obstacle.length;
		obstacle[len]=new Obstacle();
		container.appendChild(obstacle[len].node);
	},TimeInterval);
	let objectMove=window.setInterval(function(){
		obstacleMove();
		bulletMove();
		if(life==0){
			container.removeEventListener("mousemove",OnMouseMove);
			container.removeEventListener("click",OnClick);
			document.removeEventListener("KeyDown",OnKeyDown);
			clearInterval(createObstacle);
			score.style.display="none";
			lifeBlock.style.display="none";
			warning.style.display="none";
			undo.style.display="block";
			result.style.display="block";
			result.innerHTML="Your Score Is<br>"+getScore;
			restart.style.display="block";
			Init();
			clearInterval(objectMove);
		}
	},10);
}
// Document EventListener //
var OnKeyDown=function(evt){
	let x=parseInt(tank.node.style.left);
	let y=parseInt(tank.node.style.top);
	switch(evt.key){
		case "a":
			x-=10;
			break;
		case "d":
			x+=10;
			break;
		case "w":
			y-=10;
			break;
		case "s":
			y+=10;
			break;
	}
	tank.node.style.left=Math.max(0,Math.min(x,1100))+"px";
	tank.node.style.top=Math.max(0,Math.min(y,650))+"px";
};
//Random Function //
function randNum(MIN,MAX){
	let range=Math.random()*(MAX-MIN);
	return MIN+range;
}
function randInt(MIN,MAX){
	let range=Math.random()*(MAX-MIN+1);
	if(range==MAX-MAX-MIN+1)
		range--;
	range=Math.floor(range);
	return MIN+range;
}
// Obstacle //
function Obstacle(){
	// Enchance Difficulty //
	let speedUp=getScore/500;
	// Enchance Difficulty //
	this.vx=randNum(minSpeed+speedUp,maxSpeed+speedUp);
	this.vy=randNum(minSpeed+speedUp,maxSpeed+speedUp);
	this.attackTime=randInt(minAttackTime,maxAttackTime);
	this.node=document.createElement("div");
	this.node.className="obstacle";
	this.node.style.width=(50+this.attackTime*largeTime)+"px";
	this.node.style.height=(50+this.attackTime*largeTime)+"px";
	this.node.style.lineHeight=(50+this.attackTime*largeTime)+"px";
	this.node.style.fontSize=(30+this.attackTime*largeTime/2)+"px";
	let place=randInt(1,4), leftMIN, leftMAX, topMIN, topMAX;
	switch(place){
		case 1:
			leftMIN=topMIN=0;
			leftMAX=topMAX=200;
			break;
		case 2:
			leftMIN=1000;
			leftMAX=1200;
			topMIN=0;
			topMAX=200;
			break;
		case 3:
			leftMIN=0;
			leftMAX=200;
			topMIN=550;
			topMAX=750;
			break;
		case 4:
			leftMIN=1000;
			leftMAX=1200;
			topMIN=550;
			topMAX=750;
			break;
	}
	this.node.style.left=randNum(leftMIN,leftMAX-50-this.attackTime*largeTime)+"px";
	this.node.style.top=randNum(topMIN,topMAX-50-this.attackTime*largeTime)+"px";
	this.node.innerText=this.attackTime;
}
Obstacle.prototype.move=function(){
	let x=parseFloat(this.node.style.left);
	let y=parseFloat(this.node.style.top);
	let w=parseFloat(this.node.style.width);
	// Enchance Difficulty //
	let speedUp=getScore/500;
	// Enchance Difficulty //
	x+=this.vx;
	y+=this.vy;
	if(x<=0||x>=1200-w)
		this.vx=-1*Math.sign(this.vx)*randNum(minSpeed+speedUp,maxSpeed+speedUp);
	if(y<=0||y>=750-w)
		this.vy=-1*Math.sign(this.vy)*randNum(minSpeed+speedUp,maxSpeed+speedUp);
	this.node.style.left=Math.max(0,Math.min(x,1200-w))+"px";
	this.node.style.top=Math.max(0,Math.min(y,750-w))+"px";
};
// Obstacle Move //
function obstacleMove(){
	for(let i=obstacle.length-1;i>=0;i--){
		obstacle[i].move();
	}
	collision();
}
// Bullet //
function Bullet(){
	this.node=document.createElement("div");
	this.node.className="bullet";
}
Bullet.prototype.move=function(){
	let x=parseFloat(this.node.style.left);
	let y=parseFloat(this.node.style.top);
	x+=this.vx;
	y+=this.vy;
	this.node.style.left=x+"px";
	this.node.style.top=y+"px";
};
// Bullet Move //
function bulletMove(){
	for(let i=bullet.length-1;i>=0;i--){
		bullet[i].move();
		let x=parseFloat(bullet[i].node.style.left);
		let y=parseFloat(bullet[i].node.style.top);
		if(x<=0||x>=1180||y<=0||y>=730){
			container.removeChild(bullet[i].node);
			bullet.splice(i,1);
		}
	}
	collision();
}
// collision //
function collision(){
	for(let i=obstacle.length-1;i>=0;i--){
		let ox=parseFloat(obstacle[i].node.style.left);
		let oy=parseFloat(obstacle[i].node.style.top);
		let ow=parseFloat(obstacle[i].node.style.width);
		for(let j=bullet.length-1;j>=0;j--){
			let bx=parseFloat(bullet[j].node.style.left);
			let by=parseFloat(bullet[j].node.style.top);
			let dis=(ox+ow/2-bx-10)*(ox+ow/2-bx-10)+(oy+ow/2-by-10)*(oy+ow/2-by-10);
			if(dis<=(ow/2+10)*(ow/2+10)){
				container.removeChild(bullet[j].node);
				bullet.splice(j,1);
				obstacle[i].attackTime--;
				if(obstacle[i].attackTime==0){
					container.removeChild(obstacle[i].node);
					obstacle.splice(i,1);
					getScore+=eachScore;
					score.innerText=getScore;
					break;
				}
				obstacle[i].node.innerText=obstacle[i].attackTime;
				obstacle[i].node.style.width=(50+obstacle[i].attackTime*largeTime)+"px";
				obstacle[i].node.style.height=(50+obstacle[i].attackTime*largeTime)+"px";
				obstacle[i].node.style.lineHeight=(50+obstacle[i].attackTime*largeTime)+"px";
				obstacle[i].node.style.fontSize=(30+obstacle[i].attackTime*largeTime/2)+"px";
			}
		}
		let X=parseFloat(tank.node.style.left);
		let Y=parseFloat(tank.node.style.top);
		let dis=(ox+ow/2-X-50)*(ox+ow/2-X-50)+(oy+ow/2-Y-50)*(oy+ow/2-Y-50);
		if(dis<=(ow/2+50)*(ow/2+50)){
			life--;
			lifeNumber.innerText=life;
			container.removeChild(obstacle[i].node);
			obstacle.splice(i,1);
			if(life==0){
				return;
			}
		}
	}
}
/**/
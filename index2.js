
function Game() {
    //获取元素
    this.music=document.querySelector('.music');
    this.audio=document.querySelector("audio");
    this.flag=true;
    this.totalflag=true;
    this.start=document.querySelector('.begin .start');
    this.begin=document.querySelector('.begin');
    this.game=document.querySelector('.game');
    this.box=document.querySelector('.game .box');
    this.mask=document.querySelector('.mask');
    this.t,this.scor;
    this.pause=document.querySelector('.pause');
    this.mask2=document.querySelector('.mask2');
    this.continues=document.querySelector('.continue');
    this.stop_restart=document.querySelector('.stop-restart');
    this.stop_quit=document.querySelector('.stop-quit');
    this.choice=document.querySelector('.choice');
    this.difficlut=document.querySelector('.difficult');
    this.back=document.querySelector('.back');
    this.rule=document.querySelector('.rule');
    this.rules=document.querySelector('.rules');
    this.a=document.querySelector('.rules>a');
    this.scorinner=document.querySelector('.scorinner');
    this.score=document.querySelector('.score');
    this.maxscore=document.querySelector('.maxscore');
    this.time=500;
    this.quit=document.querySelector('.quit');
    this.restart=document.querySelector('.restart');
    this.bestscore=localStorage.score?localStorage.score:0;
    this.btn=document.querySelectorAll(".choosebox>div");
    this.choosebox=document.querySelector(".choosebox");
    this.great=document.querySelector('.great');
    this.acslent=document.querySelector('.acslent');
    this.world=document.querySelector('.world');
    this.she,this.food,this.way,this.newheadx,this.newheady,this.oldhead;

}
Game.prototype={
    starts:function () {
        //音乐
        this.musics();
        // 开始游戏
        this.games();


    },
    //操作音乐
    musics:function () {
        let self=this;
        this.music.onclick=function () {
            if(self.flag==true){
                self.flag=false;
                this.style.animationPlayState="paused";
                self.audio.pause();
            }else{
                self.flag=true;
                this.style.animationPlayState="running";
                self.audio.play();
            }
        }
    },
    //    开始游戏
    games:function () {
        let self=this;
        this.start.onclick=function () {
            if(self.totalflag){
                self.totalflag=false;
                self.begin.style.display='none';
                self.game.style.display='block';
                self.music.style.animationPlayState="paused";
                self.audio.pause();
                self.world.play();
                self.totalflag=true;
            }
            //创建400个盒子
            for (let i = 0; i < 20; i++) {
                for (let j = 0; j < 20; j++) {
                    var div = document.createElement('div');
                    div.id = 'r' + j + '-' + i;
                    self.box.appendChild(div);
                }
            }
            self.init();
            self.food=self.getFood();
            self.move();
            // 退出游戏
            self.quit.onclick=function () {
                self.mask.style.display='none';
                self.game.style.display='none';
                self.begin.style.display='block';
                self.world.pause();
                if(self.flag){
                    self.music.style.animationPlayState="running";
                    self.audio.play();
                }
                for(let i=0;i<self.she.length;i++){
                    var end=document.querySelector('#r'+self.she[i].x+'-'+self.she[i].y);
                    end.classList.remove('she');
                }
                self.she.splice(0,self.she.length);
                let foodobj=document.querySelector('#r'+self.food.x+'-'+self.food.y);
                foodobj.classList.remove('food');
            }
            // 重新开始
            self.restart.onclick=function () {
                self.world.play();
                self.mask.style.display='none';
                for(let i=0;i<self.she.length;i++){
                    var end=document.querySelector('#r'+self.she[i].x+'-'+self.she[i].y);
                    end.classList.remove('she');
                }
                self.she.splice(0,self.she.length);
                self.init();
                let foodobj=document.querySelector('#r'+self.food.x+'-'+self.food.y);
                foodobj.classList.remove('food');
                self.food=self.getFood();
                self.t=setInterval(function () {
                    self.oldhead = self.she[self.she.length - 1];
                    switch (self.way) {
                        case 'right':
                            self.newheadx = self.oldhead.x + 1;
                            self.newheady = self.oldhead.y;
                            // return self.newheadx,self.newheady;
                            break;
                        case 'left':
                            self.newheadx = self.oldhead.x - 1;
                            self.newheady = self.oldhead.y;
                            // return self.newheadx,self.newheady;
                            break;
                        case  'top':
                            self.newheadx = self.oldhead.x;
                            self.newheady = self.oldhead.y - 1;
                            // return self.newheadx,self.newheady;
                            break;
                        case 'bottom':
                            self.newheadx = self.oldhead.x;
                            self.newheady = self.oldhead.y + 1;
                            // return self.newheadx,self.newheady;
                            break;
                    }
                    //游戏结束
                    if(self.newheadx<0||self.newheadx>19||self.newheady<0||self.newheady>19||self.check(self.newheadx,self.newheady)){
                        clearInterval(self.t);
                        self.world.pause();
                        self.mask.style.display='block';
                        self.score.innerHTML=self.scor;
                        self.maxscore.innerHTML=self.bestscore;
                        return;
                    }
                    //吃食物
                    var newheadobj = document.querySelector('#r' + self.newheadx + '-' + self.newheady);//下一个蛇头
                    newheadobj.className = 'she';//冲掉类名
                    self.she.push({x: self.newheadx, y: self.newheady});

                    if (self.newheadx == self.food.x && self.newheady == self.food.y) {
                        self.scor++;
                        self.scorinner.innerHTML = self.scor;
                        if (self.scor < 5) {
                            self.great.play();
                        } else {
                            self.acslent.play();
                        }
                        if (self.scor < self.bestscore) {
                            self.maxscore.innerHTML = self.bestscore;
                        } else {
                            localStorage.score = self.scor;
                            self.bestscore = self.scor;
                            self.maxscore.innerHTML = self.bestscore;
                        }
                        self.food = self.getFood();
                    }else{
                        var endobj = document.querySelector('#r' +self.she[0].x + '-' + self.she[0].y);
                        endobj.classList.remove('she');
                        self.she.shift();
                    }
                    //判断方向
                    document.onkeydown = function (e) {
                        var ev = e.keyCode;
                        if (ev == 37) {
                            if (self.way == 'right') {
                                return;
                            }
                            self.way = 'left';
                        } else if (ev == 38) {
                            if (self.way == 'bottom') {
                                return;
                            }
                            self.way = 'top';
                        }
                        if (ev == 39) {
                            if (self.way == 'left') {
                                return;
                            }
                            self.way = 'right';
                        }
                        if (ev == 40) {
                            if (self.way == 'top') {
                                return;
                            }
                            self.way = 'bottom';
                        }
                    }
                },self.time);
            }
            // 暂停游戏
            self.pause.onclick=function () {
                self.mask2.style.display='block';
                clearInterval(self.t);
            }

        }
        this.choice.onclick=function () {
            if(self.totalflag){
                self.totalflag=false;
                self.difficlut.style.display='block';
            }
            self.choices();
        }
        this.rule.onclick=function () {
            if(self.totalflag){
                self.totalflag=false;
                self.rules.style.display='block';
            }
            self.ruless();
        }
    },
    //初始化游戏
     init:function(){
        //创建蛇
        this.she = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}];
        this.she.forEach(function (value) {
           let obj = document.querySelector('#r' + value.x + '-' + value.y);
            obj.classList.add('she');
        });
        this.scor=0;
        this.scorinner.innerHTML=this.scor;
        this.way='right';
     },
    //创建食物
     getFood:function() {
        //获取事物的位置
        do{
            var foodx=Math.floor(Math.random()*20);
            var foody=Math.floor(Math.random()*20);
        }while(this.check(foodx,foody));
        let obj=document.querySelector('#r'+foodx+'-'+foody);
        obj.classList.add('food');
        //食物不能到蛇身上
        return {x:foodx,y:foody};
    },
    //检查食物的位置与蛇的位置
    check:function (m,n) {
        var result=this.she.some(function (value) {
            return value.x==m && value.y==n;
        });
        return result;
    },
    // 蛇动
     move:function() {
         let self=this;
         this.t=setInterval(function () {
             self.oldhead = self.she[self.she.length - 1];
             switch (self.way) {
                 case 'right':
                     self.newheadx = self.oldhead.x + 1;
                     self.newheady = self.oldhead.y;
                     // return self.newheadx,self.newheady;
                     break;
                 case 'left':
                     self.newheadx = self.oldhead.x - 1;
                     self.newheady = self.oldhead.y;
                     // return self.newheadx,self.newheady;
                     break;
                 case  'top':
                     self.newheadx = self.oldhead.x;
                     self.newheady = self.oldhead.y - 1;
                     // return self.newheadx,self.newheady;
                     break;
                 case 'bottom':
                     self.newheadx = self.oldhead.x;
                     self.newheady = self.oldhead.y + 1;
                     // return self.newheadx,self.newheady;
                     break;
             }
             //游戏结束
             if(self.newheadx<0||self.newheadx>19||self.newheady<0||self.newheady>19||self.check(self.newheadx,self.newheady)){
                 clearInterval(self.t);
                 self.world.pause();
                 self.mask.style.display='block';
                 self.score.innerHTML=self.scor;
                 self.maxscore.innerHTML=self.bestscore;
                 return;
             }
             //吃食物
             var newheadobj = document.querySelector('#r' + self.newheadx + '-' + self.newheady);//下一个蛇头
             newheadobj.className = 'she';//冲掉类名
             self.she.push({x: self.newheadx, y: self.newheady});

             if (self.newheadx == self.food.x && self.newheady == self.food.y) {
                 self.scor++;
                 self.scorinner.innerHTML = self.scor;
                 if (self.scor < 5) {
                     self.great.play();
                 } else {
                     self.acslent.play();
                 }
                 if (self.scor < self.bestscore) {
                     self.maxscore.innerHTML = self.bestscore;
                 } else {
                     localStorage.score = self.scor;
                     self.bestscore = self.scor;
                     self.maxscore.innerHTML = self.bestscore;
                 }
                 self.food = self.getFood();
             }else{
                 var endobj = document.querySelector('#r' +self.she[0].x + '-' + self.she[0].y);
                 endobj.classList.remove('she');
                 self.she.shift();
             }
             //判断方向
             document.onkeydown = function (e) {
                 var ev = e.keyCode;
                 if (ev == 37) {
                     if (self.way == 'right') {
                         return;
                     }
                     self.way = 'left';
                 } else if (ev == 38) {
                     if (self.way == 'bottom') {
                         return;
                     }
                     self.way = 'top';
                 }
                 if (ev == 39) {
                     if (self.way == 'left') {
                         return;
                     }
                     self.way = 'right';
                 }
                 if (ev == 40) {
                     if (self.way == 'top') {
                         return;
                     }
                     self.way = 'bottom';
                 }
             }
         },self.time);
    },
    //选择关卡
    choices:function () {
         let self=this;
        this.back.onclick=function () {
            self.difficlut.style.display='none';
            self.totalflag=true;
        }
        for(let i=0;i<self.btn.length;i++) {
            self.btn[i].onclick = function () {
                for (let i = 0; i < self.btn.length; i++) {
                    self.btn[i].style.boxShadow = "none";
                }
                this.style.boxShadow = "0 0 5px red";
                if (this.className == 'easy') {
                    self.time = 500;
                } else if (this.className == 'mediu') {
                    self.time = 300;
                } else {
                    self.time = 100;
                }
            }
        }
    },
    //游戏规则
    ruless:function () {
         let self=this;
        this.a.onclick=function () {
            self.rule.style.display='block';
            self.rules.style.display='none';
            self.totalflag=true;
        }
    },
    // 暂停





}



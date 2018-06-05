var s = new Array(9); //全部数据
var bl = new Array(9); //重复记录加锁
var tn = new Array(9); //9格临时数据
var blockscount = 0; //空格数量
var finishedinfo = //成功提示
    "<div style='text-align:right;background-color:#ffffff;color:red;'><span style='font-size:20pt;' onclick='$(g.convas).unblock();'><b>X</b></span></div></br><b>恭喜！你已经成功完成了数独游戏！</b></br></br></br>";
var lastselectednum = 0;
var numcount = new Array(9);
var test = 0;
var g = {
        selectedsquare: '.sel',
        canvas: '#canvas',
        levelblocks: 16,
        leftsg: '#leftsg',
    }

//生成初始数独
function InitData() {
    for (i = 0; i < 9; i += 1) {
        bl[i] = new Array(9);
        tn[i] = new Array(2);
        s[i] = new Array(9);
        numcount[i] = 9;
    }
    for (j = 0; j < 9; j += 1) {
        for (k = 0; k < 9; k += 1) {
            bl[j][k] = 0;
            s[j][k] = 0
        }
        s[0][j] = j + 1;
    }
    shuffle(s[0]);
    fill();
    /*var Alert="";
    for(i=0;i<9;i++)
    {
        for(k=0;k<9;k++)
        {
            Alert+=s[i][k];
            Alert+=" ";
        }
        Alert+="\n";
    }
    alert(Alert);*/
}
var stack = [],
    flag = false;
//判定填入元素是否重复
function check20Grid(ss, i, j) {
    let row = {},
        col = {},
        subSudo = {} //辅助变量
    for (let k = 0; k < 9; k++) {
        let cur1 = ss[i][k],
            cur2 = ss[k][j]
        if (cur1) 
        { 
//当前元素已经在行中出现，优化掉零的判断，key为0时值为0，不需要额外判断
            if (row[cur1])
                return 1; //返回错误代码
            else
                row[cur1] = cur1 //当前元素未在行中出现，存入辅助变量中
        }
        if (cur2) 
        { //列的判定与行类似
            if (col[cur2])
                return 2;
            else
                col[cur2] = cur2;
        }
        //转化循环变量到小九宫格的坐标
        let key = ss
        [Math.floor(i / 3) * 3 + Math.floor(k / 3)]
        [Math.floor(j / 3) * 3 + Math.floor(k % 3)]
        if (subSudo[key]) //九宫格判定与行类似
            return 3
        else
            subSudo[key] = key
    }
    return 0;
}
//回溯算法寻找数独可行解
function fill() 
{
    for (let i = 0; i < 9; i++) 
    {
        for (let j = 0; j < 9;) {
            if (s[i][j] === 0 || flag) 
            { 
            //当前位置为待定元素的首次处理或回溯到当前位置
                flag = false;
                let k = s[i][j] + 1; //搜索向下一个合法值迈进
                while (k < 10) { //循环找到下一个合法值
                    s[i][j] = k; //填值
                    if (check20Grid(s, i, j) == 0) 
                    { //相关二十格判定判定合法
                        stack.push([i, j++]) //存储回溯点，并步进
                        break;
                    }
                    k++;
                }
                if (k > 9) 
                { //当前位置找不到合法值，回溯
                    s[i][j] = 0; //回溯前归零
                    let rt = stack.pop(); //堆栈中取回溯信息
                    if (!rt) //无解判断，返回0
                        return 0;
                    i = rt[0] //穿越
                    j = rt[1]
                    flag = true;
                }
            } else//当前位置数字为题目给定
                j++;
        }
    }
    return 1; //成功找到一组解
}
//挖洞策略初始化表格数据
function InitBlockData(level) {
    var lt = 20 + level + Math.floor(Math.random() * 3);
    var j = Math.floor(Math.random() * 9);
    var k = Math.floor(Math.random() * 9);
    if (level == 0)
        blockscount = 0;
    else
        for (i = 0; i < lt; i++) {
            while (true) {
                j = Math.floor(Math.random() * 9);
                k = Math.floor(Math.random() * 9);
                if (j == 4 && k == 4) {
                    if ((numcount[s[j][k] - 1] == (6 - level) ||numcount[s[Math.abs(j - 8)][Math.abs(k - 8)] - 1]
                      == (6 - level)))
                        continue;
                    else
                        break;
                } else if (numcount[s[j][k] - 1] == (5 - level) ||numcount[s[Math.abs(j - 8)][Math.abs(k - 8)] - 1]== (5 - level))
                    continue;
                else
                    break;
            }
            numcount[s[j][k] - 1]--;
            s[j][k] = 0;
            if (s[Math.abs(j - 8)][Math.abs(k - 8)] != 0) {
                numcount[s[Math.abs(j - 8)][Math.abs(k - 8)] - 1]--;
            }
            s[Math.abs(j - 8)][Math.abs(k - 8)] = 0;
        }
    blockscount = 0;
    //计算空格数量
    for (j = 0; j < 9; j++)
        for (k = 0; k < 9; k++)
            if (s[j][k] == 0)
                blockscount++;
}


//生成数独表格并打印
function CreateSudokuTable() {
    var table = "",
        x = 0,
        y = 0;
    table += "<table id='SudokuTable' class='sk' cellspacing='0' cellpadding='0'>";

    for (i = 0; i < 9; i++) {
        if (i % 3 == 0) table += "<tr>";
        table += "<td>";
        table += "<table id='t_" + i + "' class='ck' cellspacing='0' cellpadding='0'>";
        for (j = 0; j < 3; j++) {
            table += "<tr>";
            for (k = 0; k < 3; k++) {
                x = ((i % 3) * 3 + k);
                y = (Math.floor(i / 3) * 3 + j);
                if (s[x][y] != 0) {
                    table += "<td id='c_" + x + "_" + y + "' class='g'>" + s[x][y] + "</td>";
                } else {
                    table += "<td id='c_" + x + "_" + y + "' class='c'>&nbsp;</td>";
                }
            }
            table += "</tr>";
        }
        table += "</table></td>";
        if (i % 3 == 2) table += "</tr>";
    }
    table += "</table>";
    $('#canvas').html(table);
}

//数独第一行数据随机交换
function shuffle(v) {
    for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
}
//数独数据检查
function check(o) {
    var id = o.attr('id'),
        x = id.substr(2, 1),
        y = id.substr(4, 1),
        val = o.num(),
        tx = Math.floor(x / 3),
        ty = Math.floor(y / 3);

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            tn[i * 3 + j][0] = tx * 3 + i;
            tn[i * 3 + j][1] = ty * 3 + j;

        }
    }
    for (i = 0; i < 9; i++) {
        if (x != i) {
            if (s[i][y] == val && val != 0) {
                bl[i][y]++;
                bl[x][y]++;
            } else if (bl[i][y] > 0 && lastselectednum == s[i][y]) bl[i][y]--;
        }
        if (y != i) {
            if (s[x][i] == val && val != 0) {
                bl[x][i]++;
                bl[x][y]++;
            } else if (bl[x][i] > 0 && lastselectednum == s[x][i]) bl[x][i]--;
        }
    }

    for (i = 0; i < tn.length; i++) {
        if (tn[i][0] != x && tn[i][1] != y) {
            if (s[tn[i][0]][tn[i][1]] == val && val != 0) {
                bl[tn[i][0]][tn[i][1]]++;
                bl[x][y]++;
            } else if (bl[tn[i][0]][tn[i][1]] > 0 && lastselectednum == s[tn[i][0]][tn[i][1]]) bl[tn[i][0]][tn[i][1]]--;
        }
    }
    //重复数据红色提示
    for (j = 0; j < 9; j++) {
        for (k = 0; k < 9; k++) {
            if (bl[j][k] > 0) $("#c_" + j + "_" + k + "").addClass('err');
            else $("#c_" + j + "_" + k + "").removeClass('err');
        }
    }
    //填完空格且填入数据全部正确
    //计时器停止，
    if ($('.err').size() == 0 && blockscount == 0) {
        $(g.canvas).unblock().block({
            message: finishedinfo,
            css: {
                width: '400px',
                border: '3px solid #a00'
            }
        });
        $('#timer').stopTime();
    }
    //更新待填方格数
    $('#lefts').text('待填方格数:' + blockscount + '');
    $('#leftsg').refreshnumcount();
}
//游戏初始化
function finit(l) {
    $('#timer').stopTime();
    $('#timer').html('计时器:<span>00:00:00<span/>').find('span').css({
        'font-weight': '100'
    });
    InitData();
    InitBlockData(l);
    CreateSudokuTable();
    $('.g').hover(function() {
            $(this).addClass('h');
        },
        function() {
            $(this).removeClass('h');
        });
    $('.c').hover(function() {
            $(this).addClass('h');
        },
        function() {
            $(this).removeClass('h');
        }).click(function() {
        $('td').removeClass('sel');
        $(this).addClass('sel');
    });
    $('#lefts').html('待填方格数:' + blockscount + '');
    $('#leftsg').refreshnumcount();
    if (l != 0) $('#timer').everyTime(1000, 'timer', function(i) {
        $(this).html('计时器:<span>' + f(Math.floor(i / 3600)) + ':' + f(Math.floor(i / 60)) + ':' + f(i % 60) + '</span>').find('span').css({
            'font-weight': '100'
        });
    })
}

function f(s) {
    if (s < 10) return '0' + s;
    else return '' + s;
}
jQuery.fn.extend({
    num: function() {
        if (this.html() == '&nbsp;') return 0;
        return this.text() * 1;
    },
    c: function() {
        var c = {
            x: this.attr('id').substr(2, 1),
            y: this.attr('id').substr(4, 1)
        }
        return c;
    },
    setempty: function() {
        lastselectednum = this.num();
        numcount[lastselectednum - 1]--;
        this.html('&nbsp;');
        blockscount++;
        bl[this.c().x][this.c().y] = 0;
        s[this.c().x][this.c().y] = 0;
        return this;
    },
    setnum: function(code) {
        if (this.num() == 0) blockscount--;
        else numcount[this.num() - 1]--;
        lastselectednum = this.num();
        if (code > 0 && code < 9) this.text(code);
        else this.text(String.fromCharCode(code));
        if (s[this.c().x][this.c().y] != this.num()) bl[this.c().x][this.c().y] = 0;
        s[this.c().x][this.c().y] = this.num();
        numcount[this.num() - 1]++;
        return this;
    },
    setwheelnum: function(code) {
        if (this.num() == 0) blockscount--;
        else numcount[this.num() - 1]--;
        lastselectednum = this.num();
        this.text(code + '');
        if (s[this.c().x][this.c().y] != this.num()) bl[this.c().x][this.c().y] = 0;
        s[this.c().x][this.c().y] = this.num();
        numcount[this.num() - 1]++;
        return this;
    },
    check: function() {
        check(this);
    },
    gensudoku: function(l) {
        if (true)
            finit(l);
    },
    congtl: function() {
        var x = 0,
            y = 0;
        for (j = 0; j < 9; j += 1) {
            for (k = 0; k < 9; k += 1) {
                $('#c_' + j + '_' + k).fadeOut(1000).fadeIn(1200);
            }
        }
    },
    gennumcount: function() {
        var str = "";
        str += "<table id='nct' cellspacing='0' cellpadding='0' style='border:0px;vertical-align : bottom;' ><tr>";
        for (i = 1; i < 10; i++) {
            str += "<td id='nc_" + i + "' class='th' style='border:0px;vertical-align:bottom;'></td>";
        }
        str += "</tr></table>";
        this.html(str);
        return this;
    },
    refreshnumcount: function() {
        var str = ""; //log('');
        for (i = 1; i < 10; i++) {
            str = "";
            for (j = 8; j >= 0; j--) {
                if (j >= numcount[i - 1]) {
                    str += "<div class='tdb'></div>";
                } else {
                    str += "<div class='td'></div>";
                }
            }
            str += "<b>" + i + "</b>";
            $('#nc_' + i).html(str);
        }
    }
});
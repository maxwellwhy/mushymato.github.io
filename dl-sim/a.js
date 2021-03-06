// Generate chart
var mobileThreshold = 1024;
var chart = echarts.init(document.getElementById('container'), 'vintage');
function rebuildChart() {
  chart.resize();
}
window.onresize = rebuildChart;
var screenWidth = window.innerWidth;
var handleWidth;
if (screenWidth > mobileThreshold) {
  handleWidth = 15;
} else {
  handleWidth = 30;
}
var diagramHeight = document.getElementById('container').offsetHeight;
let starFilter = document.getElementById('star');
let elementFilter = document.getElementById('element');
let weaponFilter = document.getElementById('weapon');
document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', update);
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', ex_change);
});
//var advIcons = {
//    'default': '/pic/1.png',
//};

var itemStyle = {
    normal: {
    },
    emphasis: {
        // barBorderWidth: 1,
        // barBorderRadius: 4,
        // borderColor: "#fff",
        shadowBlur: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        shadowColor: 'rgba(0,0,0,0.2)'
    }
};

var describe2adv = {};
var countAvgPerPage = 12;
maxValueSpan = diagramHeight / 75;
var globalBarWidth = 15;
var option = {
    textStyle: {
      color: "#333",
      fontSize: 10,
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
    },
    animation: false,
    loadingOption: {
      text: "Loading...",
      y: 0
    },
    backgroundColor: "#ffffff",
    legend: [
        {
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            padding: 0,
            data: ['attack','force_strike','skill_1','skill_2','skill_3','team_buff', 'bleed'],
            //data:[],
            selectedMode: true,
            top: '0%',
            textStyle: {
              fontSize: 12,
              color: "#333"
            },
            formatter: function(name){
              return name.replace("skill_", "S")
                         .replace("team_buff", "Buff")
                         .replace("force_strike", "FS")
                         .replace("attack", "Atk")
                         .replace("bleed", "Others");
            }
        },
        {
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            padding: 0,
            data: [],
            selectedMode: true,
            top: '-200%', // hide it
        }
    ],
    tooltip: {
        //trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        textStyle: {
          fontSize: 12
        },
        backgroundColor: 'rgba(51,51,51,0.95)',
        padding: 10,
        formatter: function(value){
            adv = describe2adv[value.data.advdps];
            r = adv.name.replace("_","!");
            //r += value.seriesIndex%2;
            if(adv.condition && adv.condition!=' '){
                if(value.seriesIndex%2==1){
                    r+=' ('+adv.condition.slice(1,-1)+')';
                }
            }
            r = '<strong>' + r + '</strong><br>';
            r += '[' + adv.a1.replace('_',' ') + ' + ' +adv.a2.replace('_',' ') +']' + '<br>';

            sname = value.seriesName;
            if(value.seriesIndex%2==1){
                for(var i in value.data){
                    v = value.data[i];
                    if(v){
                        if(v==0)continue;
                        if(i.slice(0,3)=='_c_')continue;
                        if(i == 'advdps')continue;
                        if(i == '_rightlabel')continue;
                        if(i == '__slider')continue;
                        if(i == sname)r+='> ';
                        r += i+': '+v+'<br>';
                    }
                }
            }
            if(value.seriesIndex%2==0){
                for(var i in value.data){
                    v = value.data[i];
                    if(v){
                        if(v==0)continue;
                        if(i.slice(0,3)!='_c_')continue;
                        if(i == '_c_'+sname)r+='> ';
                        r += i.slice(3) +': '+v+'<br>';
                    }
                }
            }
            v = value.data[i];
            return r;
        }
    },
    grid: {
        containLabel: true,
        left: '0',
        right: '5%',
        top: '30px',
        bottom: '0',
    },
    dataZoom: [{
        // show: false,
        type: 'slider',
        right: '0',
        top:'5%',
        yAxisIndex: [0],
        maxValueSpan: maxValueSpan,
        showDetail: false,
        showDataShadow: false,
        zoomLock: true,
        fillerColor: "rgba(216, 124, 124, .5)",
        showDetail: false,
        // realtime: false,
        width: handleWidth,
        // height: 60,
        // handleColor: "#999",
        handleSize: 0
    }, ],
    xAxis: {
      show: false,
      max: 9600,
      // axisLine: "hide"
    },
    yAxis: {
        type:'category',
        axisLine: {
          lineStyle: {
            color: "#ddd",
            width: 2,
          }
        },
        axisTick: {
            show: false,
            alignWithLabel: true,
        },
        axisLabel: {
            interval: 0,
            formatter: function(value){
                a = describe2adv[value];
                // label = a.name + '(' + a.star + a.element + a.weapon + ')' ;
                label = a.name.replace("_","!") + " ";
                stre = '(str: ' + a.stre + ')';
                condition = ''
                amulets = a.amulets+' ';

                comment = ''
                if(a.comment){
                    comment = a.comment;
                }
                //if(a.condition){
                //    condition = a.condition
                //}
                //return '{value|' + label + stre + amulets + '}{' + a.name + '| }\n{value|'+ comment +'}';
                //return '{value|' + label + stre + amulets + '}\n{value|'+comment+'}{' + a.name + '| }';
                //return '{value|' + label + stre + amulets + comment + '}{' + a.name + '| }';
                // return '{value|' + label + stre + '}{' + a.name + '| }';
                if (screenWidth > mobileThreshold) {
                  return '{value|}                       {' + a.name + '| }{_a1_'+a.a1+'|}\n{_a2_'+a.a2+'|}';
                  // return '     {value|' + label + '}{' + a.name + '| }{a1_'+a.name+'|}\n{a2_'+a.name+'|}';
                } else {
                  return '{value|}                   {' + a.name + '| }{_a1_'+a.a1+'|}\n{_a2_'+a.a2+'|}';
                  // return '{value|' + '        ' + '}{' + a.name + '| }'
                  //return '{value|' + '        ' + '}{' + a.name + '| }{a1_'+a.name+'|}\n{a2_'+a.name+'|}';
                }
                //return '{value| }{' + a.name + '| }';
            },
            margin: 5,
            rich: {
            },
        },
    },
    dataset:{
        source: [
            {'advdps': 'Addis', 'x': 43.3, 's': 85.8, 'b': 93.7},
            {'advdps': 'b', 'x': 83.1, 's': 73.4, 'b': 55.1},
            {'advdps': 'c', 'x': 86.4, 's': 65.2, 'b': 82.5},
            {'advdps': 'd', 'x': 72.4, 's': 53.9, 'b': 39.1}
        ],
    },
    series: [
    ],
    itemStyle: {
      // borderWidth: 2
      // barBorderRadius: 2
    }
}
let characters = [];


function setData(data) {
    var tmpdata = [];
    var sp_slash = '\\'.charCodeAt()+128;
    var sp_cap = ':'.charCodeAt()+128;
    sp_slash = String.fromCharCode(sp_slash);
    sp_cap = String.fromCharCode(sp_cap);
    for(var i in data){
        if(data[i][0]=='dps'){ continue; }
        character = data[i]
        character.dps       = character[0];
        character.name      = character[1];
        character.star      = character[2];
        character.element   = character[3];
        character.weapon    = character[4];
        character.stre      = character[5];
        character.amulets   = character[6];
        character.condition = character[7];
        character.comment   = character[8];
        //console.log(character.amulets)
        //console.log(character.comment)
        var tmp = character.amulets.slice('1','-1').split('][');
        var amulets = tmp[0].split('+');
        var dragon = character.amulets.split(']')[1].split('[').join("");
        character.a1 = amulets[0];
        character.a2 = amulets[1];
        character.dragon = dragon;

        var j = 9;
        character.details = {}
        while(1){
            if(j>=character.length) break;
            unit = character[j];
            if(!unit){continue;}
            if(typeof(unit)!='string'){continue;}
            unit = unit.replace('\\\\',sp_slash).replace('\\:',sp_cap);
            if(unit.search(':')!=-1){
                a = unit.split(':',2);
                a[0] = a[0].replace(sp_cap, ':').replace(sp_slash, '\\');
                a[1] = a[1].replace(sp_cap, ':').replace(sp_slash, '\\');
                character.details[a[0]] = parseInt(a[1]);
            }
            j+=1;
        }
        while(j-=1){
            delete(character[j]);
        }
        delete(character[0]);
        tmpdata.push(character);
    }

    tmpdata.sort((character1, character2) => {
        if (character1.dps > character2.dps) {
            return 1;
        }
        if (character1.dps <= character2.dps) {
            return -1;
        }
    });
    characters = tmpdata;
}

function sortData() {
    //console.log('sort');
    op = chart.getOption();
    lg = op.legend[0].selected;
    var filtered = {};
    for(var i in lg){
        filtered[i] = !lg[i];
    }
    if (filtered['bleed']) {
        //console.log('!');
        //console.log(filtered['bleed']);
        for (var i in _dimensions) {
            if (i=='team_buff')continue;
            if (i=='attack')continue;
            if (i=='force_strike')continue;
            if (i=='skill_1')continue;
            if (i=='skill_2')continue;
            if (i=='skill_3')continue;
            op.legend[1].selected[i] = false;
        }
        chart.setOption(op);
    } else if (!op.legend[1].selected['attack']){
        //console.log('?');
        for (var i in _dimensions) {
            if (i=='team_buff')continue;
            if (i=='attack')continue;
            if (i=='force_strike')continue;
            if (i=='skill_1')continue;
            if (i=='skill_2')continue;
            if (i=='skill_3')continue;
            op.legend[1].selected[i] = true;
        }
        chart.setOption(op);
    }

    lg = op.legend[1].selected;
    for(var i in lg){
        filtered[i] = !lg[i];
    }

    //console.log(filtered);
    for(var a in characters){
        var dps = 0;
        for(var i in characters[a].details){
            if(filtered[i]){
            }else{
                dps += characters[a].details[i];
            }
        }
        characters[a].dps = dps;
    }
    characters.sort((adv1 , adv2) => {
        if (adv1.dps > adv2.dps) {
            return 1;
        }
        if (adv1.dps <= adv2.dps) {
            return -1;
        }
    });
    //console.log(characters);
}

function create_describe(name, adv){
    return name + '(' + adv.star + adv.element + adv.weapon + ')' + adv.comment;
}

//var _dimensions = {__1:1,__2:2};
var _dimensions = {};
var datasrc = {};
var o_data = [];
var c_data = [];
function update() {
    //console.log('update');
    //console.log(characters);
    let filtered = characters.filter(character => {
        if (starFilter.value != "All" && starFilter.value != character.star) {
            return false;
        }
        if (elementFilter.value != "All" && elementFilter.value != character.element) {
            return false;
        }
        if (weaponFilter.value != "All" && weaponFilter.value != character.weapon) {
            return false;
        }
        return true;
    });
    o_data = filtered;
    datasrc = {};
    c_data = {};
    var name = '';
    var a = [];
    var lines = {};
    var line = {};
    var sp_slash = '\\'.charCodeAt()+128;
    var sp_cap = ':'.charCodeAt()+128;
    var describe = '';
    var rich = {
        value: {
            lineHeight: 30,
            //align: 'center'
        },
    };
    sp_slash = String.fromCharCode(sp_slash);
    sp_cap = String.fromCharCode(sp_cap);
    //console.log(o_data);
    for(var i in o_data){
        var adv = o_data[i];
        lines[i] = {};
        line = lines[i];
        if(adv.name.slice(0,3)=='_c_'){c_data[i]=adv;continue;}
        for(var j in adv.details){
            line[j] = adv.details[j];
            line['_c_'+j] = adv.details[j]
            _dimensions[j] = 1;
        }
        name = adv.name;
        describe = create_describe(name, adv);
        line.advdps = describe;
        line._rightlabel = 1;
        datasrc[describe] = line;
        datasrc[describe].__slider = adv.dps;
        describe2adv[describe] = adv;
        advIcons[name] = picfolder+'character/'+name+'.png';
        if (screenWidth > mobileThreshold) {
            rich[adv.name] = {
                lineHeight: 0,
                height: 50,
                verticalAlign: 'top',
                backgroundColor:{
                  image: advIcons[name]
                }
            };
            //console.log(adv);
            if ('_a1_'+adv.a1 in rich) {
                //console.log('--'+ adv.a1);
            } else {
                //console.log('else--'+ adv.a1);
                rich['_a1_'+adv.a1] = {
                    lineHeight: 20,
                    height: 24,
                    verticalAlign: 'top',
                    backgroundColor:{
                        image: picfolder+'amulet/'+adv.a1+'.png'
                    }
                }
            }
            if ('_a2_'+adv.a2 in rich) {
                //console.log('--'+ adv.a2);
            } else {
                //console.log('else--'+ adv.a2);
                rich['_a2_'+adv.a2] = {
                    lineHeight: 20,
                    height: 24,
                    verticalAlign: 'bottom',
                    backgroundColor:{
                        image: picfolder+'amulet/'+adv.a2+'.png'
                    }
                }
            }
        } else {
            rich[adv.name] = {
                lineHeight: 00,
                height: 40,
                verticalAlign: 'top',
                backgroundColor:{
                  image: advIcons[name]
                }
            };
            //console.log(adv);
            if ('_a1_'+adv.a1 in rich) {
                //console.log('--'+ adv.a1);
            } else {
                //console.log('else--'+ adv.a1);
                rich['_a1_'+adv.a1] = {
                    lineHeight: 0,
                    height: 20,
                    verticalAlign: 'top',
                    backgroundColor:{
                        image: picfolder+'amulet/'+adv.a1+'.png'
                    }
                }
            }
            if ('_a2_'+adv.a2 in rich) {
                //console.log('--'+ adv.a2);
            } else {
                //console.log('else--'+ adv.a2);
                rich['_a2_'+adv.a2] = {
                    lineHeight: 0,
                    height: 20,
                    verticalAlign: 'center',
                    backgroundColor:{
                        image: picfolder+'amulet/'+adv.a2+'.png'
                    }
                }
            }
        }


        // rich['dragon_'+adv.name] = {
        //     lineHeight: 20,
        //     height: 50,
        //     verticalAlign: 'top',
        //     backgroundColor:{
        //       image: picfolder+'dragon/'+adv.dragon+'.png'
        //     }
        // };
    }

    for(var i in c_data){
        var adv = c_data[i];
        line = lines[i];
        for(var j in adv.details){
            line[j] = adv.details[j]
            _dimensions[j] = 1;
        }
        name = adv.name.slice(3);
        describe = create_describe(name, adv);

        // clean _c_
        for(var i in datasrc[describe]){
            if(i.slice(0,3) == '_c_'){
                datasrc[describe][i] = 0;
            }
        }
        // set _c_
        for(var i in line){
            datasrc[describe]['_c_'+i] = line[i];
        }
        describe2adv['_c_'+describe] = adv;
        //if(!datasrc[describe].condition){
        //    datasrc[describe].condition = adv.condition
        //}
        //if(!describe2adv[describe].condition){
        //    describe2adv[describe].condition = adv.condition;
        //}
    }

    for(var i in _dimensions){
        if(i.slice(0,2)!='__'){
            option.legend[1].data.push(i);
        }
        for(var l in datasrc){
            if(!datasrc[l][i]){
                datasrc[l][i] = null;
            }
            if(!datasrc[l]['_c_'+i]){
                datasrc[l]['_c_'+i] = null;
            }
        }
    }

    option.dataset.source = []
    for(var i in datasrc){
        option.dataset.source.push(datasrc[i]);
    }

    option.series = [];
    /**/
    s0 = {
      type:'bar',
      name:'slider',
      stack:'slider',
      encode: {
        x:'__slider',
        y:'advdps'
      }
    };
    s0.show = false;
    s0.animation = false;
    s0.barWidth = 0.001;
    s0.label = {
        normal: {
            show: true,
            //position: 'insideLeft',
            //position: 'top',
            position: [10,-13],
            formatter: params => {
                var a = describe2adv[params.name];
                var label = a.name + '(' + a.star + a.element + a.weapon + ')' ;
                var stre = '(str: ' + a.stre + ')';
                var condition = '';
                var amulets = a.amulets+' ';
                var description = amulets.split("[")[2].replace(";"," - ").replace("dpsrange:","DPS Range: ");
                var comment = '';
                var r = '';

                if(a.comment){
                    comment = a.comment;
                    r += "[" + description + "- " + comment;
                    return r
                } else {
                    r += "[" + description;
                    return r
                }
            },
            textStyle: {
              fontSize: 10,
              color: "#666"
            }
        },
    }
    s0.itemStyle = {color: '#fff'};
    option.series.push(s0);
    option.dataZoom[0].showDataShadow='__slider';

    var conditionshowed = [];
    /**/
    t1 = {
        type:'bar',
        name:'attack',
        stack:'dps',
        encode:{x:'attack',y:'advdps'},
        animation: false,
        barWidth: globalBarWidth,
        itemStyle: itemStyle,
        label: {
            normal: {
                show: true,
                position: 'insideLeft',
                formatter: params => {
                    a = describe2adv[params.name];
                    //console.log(a.name+':'+a.details.attack);
                    // if (a.details.attack) {
                    //     conditionshowed.push(params.name);
                    //     return a.condition;
                    // } else {
                    //     return '';
                    // }
                    conditionshowed.push(params.name);
                    return '';
                },
            },
        },
    }
    t2 = {
        type:'bar',
        name:'attack',
        stack:'c_dps',
        encode:{x:'_c_attack',y:'advdps'},
        animation:false,
        barWidth: globalBarWidth,
        itemStyle:itemStyle,
    }
    option.series.push(t1);
    option.series.push(t2);

    for(var i in _dimensions){
        if(i == 'attack'){continue;}
        if(i == '_c_attack'){continue;}
        if(i == '__slider'){continue;}
        s1 = {type:'bar',name:i,stack:'dps',encode:{x:i,y:'advdps'}};
        s2 = {type:'bar',name:i,stack:'c_dps',encode:{x:'_c_'+i,y:'advdps'}};
        s1.animation = false;
        s1.itemStyle = itemStyle;
        s1.barGap = 0;
        //s1.barWidth = 30;
        s2.animation = false;
        s2.itemStyle = itemStyle;
        s2.barGap = -0.05;
        //s2.barWidth = 30;
        s1.label= {
            normal: {
                show: true,
                position: 'insideLeft',
                formatter: params => {
                    if (conditionshowed.includes(params.name)) {
                        return '';
                    }
                    a = describe2adv[params.name];
                    if (a.details[params.seriesName]) {
                        conditionshowed.push(params.name);
                        return a.condition;
                    } else {
                        return '';
                    }
                },
            },
        }
        option.series.push(s1);
        option.series.push(s2);
    }

    t1 = {
        type:'bar',
        name:'_rightlabel',
        stack:'dps',
        encode:{x:'_rightlabel',y:'advdps'},
        animation:false,
        itemStyle:itemStyle,
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: params => {
                    a = describe2adv[params.name];
                    return a.dps;
                },
            },
        },
    }
    t2 = {
        type:'bar',
        name:'_rightlabel',
        stack:'c_dps',
        encode:{x:'_rightlabel',y:'advdps'},
        animation:false,
        itemStyle:itemStyle,
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: params => {
                    a = describe2adv['_c_'+params.name];
                    if(a)
                        return a.dps;
                    return '';
                },
            },
        },
    }
    option.series.push(t1);
    option.series.push(t2);


    option.yAxis.axisLabel.rich = rich;
    //option.yAxis.boundaryGap= false;

    //console.log(rich);

    var slider = option.dataZoom[0];
    len = Object.keys(datasrc).length;
    slider.endValue = len - 1;
    slider.startValue = Math.max(slider.endValue - slider.maxValueSpan, 0);

    //console.log(option);
    chart.setOption(option);
}

var checked = ['ex-kat','ex-rod'];
function ex_change() {
    //console.log('ex_change');
    var newchecked = []
    var exs = document.querySelectorAll('input');
    //console.log(exs);
    for (var idx in exs){
        ex = exs[idx]
        //console.log(ex.name);
        //console.log(ex.checked);
        if (ex.checked) {
            //console.log(ex.name);
            newchecked.push(ex.name);
            ex.checked = false;
        }
    }
    if (newchecked.length <= 4) {
        checked = newchecked;
    }

    var affix = '';
    //console.log('////////////////////');
    //console.log(checked)
    for (var idx in checked) {
        var i = checked[idx]
        document.getElementsByName(i)[0].checked = true;
        if (i == 'ex-kat'){
            affix += 'k';
        } else if (i == 'ex-rod'){
            affix += 'r';
        } else if (i == 'ex-dag'){
            affix += 'd';
        } else if (i == 'ex-bow'){
            affix += 'b';
        }
    }
    if (affix == ''){
        affix = '_'
    }
    //console.log(affix);
    dataload('data_'+affix+'.csv');
}

function dataload(name){
    fetch(name).then(response => response.text()).then(text => {
        let csv = Papa.parse(text, {
            //header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            delimiter: ',',
            delimitersToGuess: [',']
        });
        setData(csv.data);
        update();
        sortData();
        update();
    });
}

//console.log('!');
dataload('data_kr.csv')


chart.on('legendselectchanged', function () {
    sortData();
    update();
});

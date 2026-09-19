/* ==========================================================================
   德航小德 · 智能客服机器人（本地知识库模拟问答）
   ========================================================================== */
(function () {
  "use strict";

  var btn = document.getElementById("robotBtn");
  var panel = document.getElementById("robotPanel");
  var body = document.getElementById("robotBody");
  var input = document.getElementById("robotInput");
  var send = document.getElementById("robotSend");
  var tip = document.getElementById("robotTip");
  var widget = document.getElementById("robotWidget");
  if (!btn || !panel || !body || !input) return;

  /* ---------- 公司知识库（关键词 → 回答） ---------- */
  var KB = [
    {
      kw: ["介绍", "简介", "公司", "德航", "是谁", "干嘛", "什么公司", "做什么"],
      ans: "您好！我们是<strong>河南德航建设工程有限公司</strong>，成立于 <strong>1998 年</strong>，注册资本 <strong>5600 万元</strong>，"
        + "坐落于漯河市源汇区太行山路 707 号。是一家集建筑工程、市政公用、装饰装修、钢结构等十二项专业承包资质于一体的综合性建筑企业，"
        + "也是<strong>国家级高新技术企业</strong>和<strong>河南省专精特新企业</strong>。您还可以继续问我资质、业绩或联系方式哦。"
    },
    {
      kw: ["资质", "等级", "承包", "证书", "施工资质"],
      ans: "公司拥有 <strong>12 项专业承包资质</strong>，包括：建筑工程施工总承包二级、建筑装修装饰工程专业承包<strong>一级</strong>、"
        + "市政公用工程施工总承包二级、钢结构工程专业承包二级、建筑幕墙二级、城市及道路照明二级、地基基础二级、防水防腐保温二级、"
        + "环保工程二级、消防设施二级、特种工程（结构补强）以及施工劳务。"
    },
    {
      kw: ["荣誉", "获奖", "称号", "高新技术", "专精特新", "信用", "先进", "诚信", "骨干"],
      ans: "公司荣誉颇丰 🏆：<strong>2023 年获评“国家级高新技术企业”和“河南省专精特新企业”</strong>，"
        + "并获得 AAA 级信用企业、河南省“先进企业”“诚信企业”“建筑业骨干企业”、突出贡献企业等荣誉称号。"
    },
    {
      kw: ["业绩", "项目", "案例", "工程", "做过", "代表"],
      ans: "公司代表业绩包括：天际快运智能物流园建设项目（钢结构，合同额 1.02 亿元）、年回收再利用废旧钢铁 150 万吨项目（钢结构）、"
        + "东城产业集聚区康平路道路排水工程（市政，1426.69 万元）、漯河市第二人民医院（儿童医院）5、6、7 号楼装修改造项目（装饰装修，872.21 万元）等，"
        + "累计代表业绩金额超 1.9 亿元。您可点击导航栏「工程业绩」查看完整 13 项业绩明细。"
    },
    {
      kw: ["电话", "联系", "手机", "拨打", "联系你们", "call"],
      ans: "您可以直接拨打我们的联系电话：<a href=\"tel:0395777716\">0395-7777716</a>（点击即可拨打），"
        + "工作时间为周一至周五 8:00 – 18:00。"
    },
    {
      kw: ["邮箱", "邮件", "email", "发邮件"],
      ans: "我们的电子邮箱是：<a href=\"mailto:hndhjs666@163.com\">hndhjs666@163.com</a>（点击即可发邮件），欢迎来信洽谈。"
    },
    {
      kw: ["地址", "在哪", "哪里", "位置", "地图", "怎么走", "导航"],
      ans: "公司地址：<strong>漯河市源汇区太行山路 707 号</strong>。您可以在网站「联系我们」栏目点击高德地图或百度地图一键导航。"
    },
    {
      kw: ["业务", "服务", "施工", "装修", "钢结构", "市政", "幕墙", "照明", "地基", "防水", "环保", "消防", "劳务", "加固"],
      ans: "公司业务覆盖工程建设全产业链：<strong>建筑工程、市政公用、建筑装修装饰（一级）、钢结构、建筑幕墙、城市及道路照明、"
        + "地基基础、防水防腐保温、环保工程、消防设施、特种工程（结构补强）、施工劳务</strong>。"
        + "您可点击导航栏「业务领域」查看详情，或拨打电话 <a href=\"tel:0395777716\">0395-7777716</a> 咨询具体合作。"
    },
    {
      kw: ["文化", "宗旨", "理念", "价值观", "精神", "愿景"],
      ans: "企业宗旨：<strong>德行天下 · 奋楫远航</strong>；经营理念：以人为本、诚实守信、精益求精、服务至上；"
        + "运营模式：质量求生存、信誉求发展、管理求效益、服务拓市场。"
    },
    {
      kw: ["成立", "历史", "多少年", "注册资本", "规模", "员工", "人员"],
      ans: "公司成立于 <strong>1998 年</strong>，深耕建筑行业近三十年，注册资本 5600 万元，为当地提供就业岗位千余人，"
        + "拥有一批经验丰富的注册建造师、工程师及专业化的施工队伍。"
    },
    {
      kw: ["时间", "上班", "营业", "几点"],
      ans: "我们的工作时间是<strong>周一至周五 8:00 – 18:00</strong>，欢迎在工作时间来电或来访。"
    },
    {
      kw: ["合作", "洽谈", "报价", "价格", "预算", "招标", "投标", "商务"],
      ans: "很高兴您有合作意向 🤝！请拨打 <a href=\"tel:0395777716\">0395-7777716</a> 或发邮件至 "
        + "<a href=\"mailto:hndhjs666@163.com\">hndhjs666@163.com</a> 说明项目情况，"
        + "也可以在本网站「联系我们」栏目填写在线留言，我们会尽快与您联系。"
    },
    {
      kw: ["留言", "表单", "反馈", "咨询方式"],
      ans: "您可以在网站「联系我们」栏目填写在线留言表单，留下您的需求和联系方式，我们会尽快回复您。"
    },
    {
      kw: ["招聘", "求职", "应聘", "招人", "岗位"],
      ans: "感谢您的关注！招聘信息请拨打电话 <a href=\"tel:0395777716\">0395-7777716</a> 咨询人事部门，"
        + "或将简历发送至 <a href=\"mailto:hndhjs666@163.com\">hndhjs666@163.com</a>。"
    },
    {
      kw: ["你好", "您好", "hi", "hello", "在吗", "嗨"],
      ans: "您好呀 👋！我是<strong>德航小德</strong>，德航建设的智能客服机器人。您可以问我：公司介绍、资质荣誉、工程业绩、联系方式等问题。"
    },
    {
      kw: ["谢谢", "感谢", "辛苦", "好的", "明白了"],
      ans: "不客气！很高兴为您服务 😊 如有其他问题随时问我，也欢迎拨打电话 0395-7777716 联系人工客服。"
    },
    {
      kw: ["再见", "拜拜", "bye"],
      ans: "再见！祝您生活愉快，德航建设期待与您合作 🚀"
    },
    {
      kw: ["机器人", "你是", "名字", "小德"],
      ans: "我叫<strong>德航小德</strong>，是河南德航建设工程有限公司官网的智能客服机器人 🤖，负责在线解答公司相关的问题。"
    }
  ];
  var FALLBACK = "抱歉，这个问题我暂时还不会回答 😅 您可以换个问法，比如“公司介绍”“资质荣誉”“工程业绩”“联系方式”；"
    + "或拨打 <a href=\"tel:0395777716\">0395-7777716</a> / 发邮件至 <a href=\"mailto:hndhjs666@163.com\">hndhjs666@163.com</a> 咨询人工服务。";

  var GREETING = "您好！我是<strong>德航小德</strong> 🤖，河南德航建设工程有限公司的智能客服机器人。"
    + "您可以点击下方快捷问题，或直接输入问题，我会为您解答公司介绍、资质荣誉、工程业绩、联系方式等。";

  /* ---------- 面板开关 ---------- */
  var opened = false;
  function openPanel() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    widget.classList.add("talking");
    tip.classList.remove("show");
    if (!opened) {
      opened = true;
      addBot(GREETING);
    }
    setTimeout(function () { input.focus(); }, 350);
  }
  function closePanel() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    widget.classList.remove("talking");
  }
  btn.addEventListener("click", function () {
    panel.classList.contains("open") ? closePanel() : openPanel();
  });
  document.getElementById("robotClose").addEventListener("click", closePanel);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
  });

  /* 8 秒后展示提示气泡（仅一次） */
  setTimeout(function () {
    if (!opened) tip.classList.add("show");
  }, 8000);
  btn.addEventListener("click", function () { tip.classList.remove("show"); });

  /* ---------- 消息渲染 ---------- */
  function addMsg(html, from) {
    var div = document.createElement("div");
    div.className = "robot-msg from-" + from;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }
  function addUser(text) {
    var safe = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    addMsg(safe, "user");
  }
  function addBot(html) {
    return addMsg(html, "bot");
  }
  function showTyping() {
    var t = addMsg("<span class=\"typing-dots\"><i></i><i></i><i></i></span>", "bot");
    return t;
  }

  /* ---------- 关键词匹配 ---------- */
  function bestAnswer(q) {
    var best = null, bestScore = 0;
    KB.forEach(function (item) {
      var score = 0;
      item.kw.forEach(function (k) {
        if (q.indexOf(k) !== -1) score += (k.length > 2 ? 2 : 1);
      });
      if (score > bestScore) { bestScore = score; best = item.ans; }
    });
    return bestScore > 0 ? best : FALLBACK;
  }

  /* ---------- 提问流程（带"思考"延迟，模拟真人客服） ---------- */
  var busy = false;
  function ask(text) {
    if (busy || !text) return;
    busy = true;
    addUser(text);
    input.value = "";
    var typing = showTyping();
    widget.classList.add("talking");
    var delay = 700 + Math.random() * 900;
    setTimeout(function () {
      typing.remove();
      addBot(bestAnswer(text));
      widget.classList.remove("talking");
      busy = false;
    }, delay);
  }
  send.addEventListener("click", function () { ask(input.value.trim()); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") ask(input.value.trim());
  });

  /* ---------- 快捷问题 ---------- */
  document.getElementById("robotQuick").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) ask(b.textContent);
  });
})();

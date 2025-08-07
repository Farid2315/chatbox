(function(d) {
    const script = d.currentScript;
    const widgetDiv = d.createElement("div");
    widgetDiv.id = "chatbox-widget";
    widgetDiv.style.position = "fixed";
    widgetDiv.style.bottom = "20px";
    widgetDiv.style.right = "20px";
    widgetDiv.style.width = "350px";
    widgetDiv.style.height = "500px";
    widgetDiv.style.zIndex = 9999;
  
    const iframe = d.createElement("iframe");
    iframe.src = `${script.getAttribute("data-base")}/widget/chatbox?room=${encodeURIComponent(script.getAttribute("data-room"))}`;
    iframe.style.border = "none";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    widgetDiv.appendChild(iframe);
  
    d.body.appendChild(widgetDiv);
  })(document);
  
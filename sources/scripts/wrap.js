const TabGroup = require("electron-tabs");

var counter = 1;

function Wrap()
{

  var wrap = this;
  let tabGroup = new TabGroup();

  this.start = function()
  {
    let tab = tabGroup.addTab({
        title: counter.toString(),
        src: "page.html#noir",
        visible: true,
        active: true,
        closable: false
    });
    // add attributes to the webview
    tab.webview.setAttribute('nodeintegration','');
    tab.webview.setAttribute('preload',`file://${__dirname}/sources/scripts/webview-preload.js`);
    // listen to the webview's preload
    tab.webview.addEventListener('ipc-message', event => {
      if(event.channel == "title"){
        tab.setTitle(event.args[0].title);
        console.log(event.args[0].title);
      }
      if(event.channel == "theme"){
        this.theme(event.args[0].theme);
      }
    })

    tab.on("active", (tab) => {
      tab.webview.send("request");
      tab.webview.focus();
    });

    tab.webview.focus();

  }

  this.close = function()
  {
    tabGroup.getActiveTab().close(true);
  }

  this.theme = function(theme_name)
  {
    if(tabGroup.getActiveTab() !== null){
      document.getElementById("tabs").className = "";
      document.getElementById("tabs").classList.add("etabs-tabgroup",theme_name);
    }
  }

  this.activate = function(id)
  {
    tabGroup.getTab(id).activate();
  }


}

document.onkeydown = function key_down(e)
{
  // new tab on T
  if(e.key == "t" && (e.ctrlKey || e.metaKey)){
    e.preventDefault();
    counter++;
    wrap.start();
  }
  // close tab on W
  if(e.key == "w" && (e.ctrlKey || e.metaKey)){
    e.preventDefault();
    counter--;
    wrap.close(true);
  }
  // tab switch
  for(i=0; i < 10; i++){
    if(e.key == i+1 && (e.ctrlKey || e.metaKey)){
      e.preventDefault();
      wrap.activate(i);
    }
  }


}

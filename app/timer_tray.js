const electron = require('electron');
const{ Tray, app, Menu} = electron;

class TimerTray extends Tray {
    constructor(iconPath, mainWindow){
        super(iconPath);

        this.mainWindow =mainWindow;

        this.setToolTip('Timer App');
        this.on('click', this.onClick.bind(this));
        this.on('right-click',this.onRightClick.bind(this));
    }
    onClick(event, bounds){
//when you click at the icon it appears right below of the icon in osx ,and right upper in the windows 
const  {x, y} = bounds;
const {height,width} =this.mainWindow.getBounds();
console.log(bounds.x,bounds.y);
if(this.mainWindow.isVisible()){
  this.mainWindow.hide();
}
else{
  const yPosition = process.platform ==='darwin' ? y: y -height;
  this.mainWindow.setBounds({
    x: x - width/2 ,
    y: yPosition ,
    height:height,
    width:width ,
  });
  this.mainWindow.show();
}
    }
    //creating a right click pop up menu
    onRightClick(){
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click:() => app.quit()
            }
        ]);
        this.popUpContextMenu(menuConfig);
    }
}
module.exports = TimerTray;
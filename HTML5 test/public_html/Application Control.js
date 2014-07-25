function gogogo ()
 {        
     //Menu.init();
   //Interior.init("first",{"fader":fadeToFromBlack});
   
   
    
    view = new View();   
    ctrls = new Controls();
    model = new Model();
    presenter = new Presenter();
    presenter.Init(view, ctrls, model);
 }
 
function gogogo ()
 {           
    view = new View();   
    ctrls = new Controls();
    model = new Model();
    presenter = new Presenter();
    presenter.Init(view, ctrls, model, "interiorTest");
 }
 
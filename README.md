Reactive Orientation
===========

**HTML 5 Device Orientation API - EmberJS - ThreeJS - WebSockets - Scala - Play**

A full application stack for a reactive application with realt-time WebGL visualization, lets review the components:

* **HTML 5 API** - WebSockets, HTML 5 Device Orientation API
  *  [HTML 5 Rocks Tutorial](http://www.html5rocks.com/en/tutorials/device/orientation/)
    
* **EmberJS** - interesting client side javasscript framework for building ambitious webapplications
  *  [http://emberjs.com/](http://emberjs.com/)

* **Bootstrap** - Bootstrap
  *  [http://getbootstrap.com/2.3.2](http://getbootstrap.com/2.3.2/)

* **Three.js** - CoffeeScript is an attempt to expose the good parts of JavaScript in a simple way.
  *  [http://threejs.org/](http://threejs.org)

* **PlayFramework** - version 2.3 with the Scala API and Play Iteratees
  *  [PlayFramework Docs](http://www.playframework.com/documentation/2.3.x/Home)

* **ScalaWebSockets** - defining websockets usage the same way as actions
  *  [ScalaWebsockets Docs](http://www.playframework.com/documentation/2.3.x/ScalaWebSockets)



Getting Started
----------

Your development environment will require:
*  SBT / Play see [here](http://www.playframework.com/download) for installation instructions.

Once the prerequisites have been installed, you will be able to execute the following from a terminal.

```
../reactive-orientation >  activator run
```

This should fetch all the dependencies and start a Web Server listening on *localhost:9000*


Note: The new play 2.3 sometimes reloads the content too much so it's better to use the start command for live demo purposes.

```
../reactive-orientation >  activator start
```


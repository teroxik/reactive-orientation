App = Ember.Application.create();

App.SubView = Ember.View.extend({
  templateName: "sub/sub"
});

App.Router.map(function() {
  this.resource('device', {  path: '/device' });
  this.resource('test', {path: '/test'})
});

App.IndexController = Ember.ArrayController.extend({
  appName: 'My First Example',
  orientationData: { },
  cube: '',
  socket: new WebSocket("ws://192.168.0.10:9000/dashboardWebSocket"),
  init: function() {

    var self = this;
    self.createCanvas();
    self.socket.onmessage = function(evt) {
      var json = JSON.parse(evt.data);
      self.set('orientationData',json);

      self.cube.rotation.x = (json.data.beta)/80;
      self.cube.rotation.y = ((json.data.alpha)-180)/180;
      self.cube.rotation.z = -(json.data.gamma)/80;
    };
  },
  createCanvas: function() {
    	var self = this;
    	var scene = new THREE.Scene();
    	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    	var renderer = new THREE.WebGLRenderer();
    	renderer.setSize(window.innerWidth, window.innerHeight);
    	document.body.appendChild(renderer.domElement);
    	var geometry = new THREE.CubeGeometry(2,3,1);
    	var material1 = new THREE.MeshBasicMaterial({color: 0xff0000});
    	var material2 = new THREE.MeshBasicMaterial({color: 0x00ff00});
    	var material3 = new THREE.MeshBasicMaterial({color: 0x3333ff});
    	var material4 = new THREE.MeshBasicMaterial({color: 0xffff00});
    	var material5 = new THREE.MeshBasicMaterial({color: 0xff33cc});
    	var material6 = new THREE.MeshBasicMaterial({color: 0x996633});

    	var materials = [];

    	materials.push(material1);
    	materials.push(material2);
    	materials.push(material3);
    	materials.push(material4);
    	materials.push(material5);
    	materials.push(material6);

    	self.cube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    	scene.add(self.cube);
    	camera.position.z = 5;
    	var render = function () {
    		requestAnimationFrame(render);

    		renderer.render(scene, camera);
    	 };
            render();

  }
});

App.DeviceController = Ember.ObjectController.extend({
  appName: 'My First Example',
  socket: new WebSocket("ws://192.168.0.10:9000/mobileWebSocket"),
  startOn: false,
  orientation: { },
  init: function() {
    this.registerListeners();
  },
  actions: {
    start: function() {
        this.set('startOn', true);
    },
    stop: function() {
        this.set('startOn', false);
    }
  },
  registerListeners: function() {
    var self = this;
    if(window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function(event) {
        if (self.startOn) {
          var orientationData = calculateOrientation();
          var orientation =  {device: "Nexus 7", data: orientationData }
          self.set("orientation", orientation);
          self.socket.send(JSON.stringify(orientation));
        }
      }, false);
    }
  }
});

function calculateOrientation() {
    var alpha,beta,gamma;

    if(event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading;
        compass.style.WebkitTransform = 'rotate(-' + alpha + 'deg)';
    }
    else {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
      webkitAlpha = alpha;
      if(!window.chrome) {
        webkitAlpha = alpha-270;
      }
    }

    return {
             alpha: alpha,
             beta: beta,
             gamma: gamma
           };
}



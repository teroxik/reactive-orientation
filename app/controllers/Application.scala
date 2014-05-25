package controllers

import play.api._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.iteratee.{Enumerator, Iteratee}
import play.api.libs.concurrent.Akka
import akka.actor.Props
import actor._
import play.api.libs.json.JsValue


object Application extends Controller {

  lazy val mergingActor = Akka.system.actorOf(Props[DataMerger])

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def mobileData = WebSocket.using[JsValue] { request =>

    mergingActor ! RegisterProducer()


    (in, out)
  }

  def dashboard = WebSocket.using[String] { request =>


    (in, out)
  }


}
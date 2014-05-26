package controllers

import play.api.mvc._
import play.api.libs.concurrent.Akka
import akka.actor.Props
import actor._
import play.api.libs.json.JsValue
import actor.DataMerger._
import play.api.libs.iteratee.{Enumerator, Iteratee}
import akka.pattern.ask
import actor.DataMerger.RegisterConsumer
import actor.DataMerger.OrientationChangeEvent
import play.api.Play.current
import akka.util.Timeout
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext
import ExecutionContext.Implicits.global
import json.JsonFormats._
import utils.IpAddress


object Application extends Controller {

  lazy val mergingActor = Akka.system.actorOf(Props[DataMerger])

  implicit val timeout = Timeout(2 second)
  
  def index = Action {
    println(IpAddress.getIpAddresses())
    Ok(views.html.index())
  }

  def mobileWebSocket = WebSocket.using[OrientationChangeEvent] { request =>

    val in = Iteratee
      .foreach[OrientationChangeEvent] { mergingActor ! _ }
      .map(_ => "Disconnected")

    val out = Enumerator.empty[OrientationChangeEvent]

    (in, out)
  }

  def dashboardWebSocket = WebSocket.async[JsValue] { request =>
    (mergingActor ? RegisterConsumer()).map { case RegisterConsumerConfirmation(en) => (Iteratee.ignore, en) }
  }

}

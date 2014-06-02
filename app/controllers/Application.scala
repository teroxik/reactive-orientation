package controllers

import play.api.mvc._
import play.api.libs.concurrent.Akka
import akka.actor.Props
import actor._
import play.api.libs.json.JsValue
import actor.StreamMergingActor._
import play.api.libs.iteratee.{Enumerator, Iteratee}
import akka.pattern.ask
import actor.StreamMergingActor.RegisterConsumer
import actor.StreamMergingActor.OrientationChangeEvent
import play.api.Play.current
import akka.util.Timeout
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext
import ExecutionContext.Implicits.global
import json.JsonFormats._
import utils.IpAddress

object Application extends Controller with IpAddress {

  lazy val mergingActor = Akka.system.actorOf(Props[StreamMergingActor])
  implicit val timeout = Timeout(2 second)
  
  def index = Action {
    println(getIpAddresses())

    Ok(views.html.index(getIpAddresses()))
  }

  def mobileWebSocket = WebSocket.using[OrientationChangeEvent] { request =>
    val in = Iteratee.foreach[OrientationChangeEvent] { mergingActor ! _ }
    val out = Enumerator.empty[OrientationChangeEvent]

    (in, out)
  }

  def dashboardWebSocket = WebSocket.tryAccept[JsValue] { request =>
    (mergingActor ? RegisterConsumer()).map {
      case RegisterConsumerConfirmation(en) => Right((Iteratee.ignore, en))
    }
  }

}

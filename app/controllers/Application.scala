package controllers

import play.api.mvc._
import akka.actor.Props
import actors._
import play.api.libs.json.JsValue
import play.api.libs.iteratee.{Concurrent, Iteratee}
import play.api.Play.current
import akka.util.Timeout
import scala.concurrent.duration._
import utils.IpAddress
import json.JsonFormats._
import actors.StreamMergingActor.OrientationChangeEvent

object Application extends Controller with IpAddress {

  val (dataEnumerator, dataChannel) = Concurrent.broadcast[JsValue]

  implicit val timeout = Timeout(2 second)
  
  def index = Action {
    println(getIpAddresses())
    println(Runtime.getRuntime().availableProcessors())

    Ok(views.html.index(getIpAddresses()))
  }

  def mobileWebSocket = WebSocket.acceptWithActor[OrientationChangeEvent, JsValue] { request => out =>
    Props(new StreamMergingActor(dataChannel))
  }

  def dashboardWebSocket = WebSocket.using[JsValue] { request =>
    (Iteratee.ignore, dataEnumerator)
  }

}
